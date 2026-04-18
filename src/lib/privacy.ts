export type ProcessingMode = "standard" | "redacted";
export type ContractInputKind = "text" | "image";

export interface RedactionFinding {
  label: string;
  count: number;
}

export interface ImageRedactionArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ConsentRecord {
  id: string;
  createdAt: string;
  feature: string;
  inputKind: ContractInputKind;
  processingMode: ProcessingMode;
  provider: string;
  model: string;
  retention: string;
  dataCategories: string[];
  redactionSummary: string;
}

export interface AnalysisProfile {
  provider: string;
  model: string;
  retention: string;
  dataCategories: string[];
}

interface PatternDefinition {
  label: string;
  regex: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
}

const CONTRACT_ANALYSIS_PROFILES: Record<ContractInputKind, AnalysisProfile> = {
  text: {
    provider: "Featherless API",
    model: "Qwen/Qwen2.5-7B-Instruct",
    retention:
      "FinClear does not store raw contract text after the response. Consent receipts stay only on this device until you delete them.",
    dataCategories: ["Contract text", "Risk explanation request", "Redaction mode"],
  },
  image: {
    provider: "Lovable AI Gateway",
    model: "google/gemini-2.5-flash",
    retention:
      "FinClear does not store uploaded images after the response. Consent receipts stay only on this device until you delete them.",
    dataCategories: ["Contract image", "Risk explanation request", "Manual image redactions"],
  },
};

const REDACTION_PATTERNS: PatternDefinition[] = [
  {
    label: "Name",
    regex:
      /(name|full name|borrower|applicant|customer|姓名|借款人|申请人|客户)\s*[:：]?\s*([A-Za-z\u4e00-\u9fa5·\s]{2,40})/giu,
    replacement: (_match, field) => `${field}: [REDACTED_NAME]`,
  },
  {
    label: "Email",
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu,
    replacement: "[REDACTED_EMAIL]",
  },
  {
    label: "Phone",
    regex:
      /(phone|mobile|telephone|contact number|联系电话|手机号|手机|电话)\s*[:：]?\s*(\+?\d[\d\s-]{7,}\d)/giu,
    replacement: (_match, field) => `${field}: [REDACTED_PHONE]`,
  },
  {
    label: "National ID",
    regex:
      /(id number|national id|identity card|身份证号|身份证|证件号)\s*[:：]?\s*([0-9Xx-]{6,24})/giu,
    replacement: (_match, field) => `${field}: [REDACTED_ID]`,
  },
  {
    label: "National ID",
    regex: /\b\d{17}[\dXx]\b/gu,
    replacement: "[REDACTED_ID]",
  },
  {
    label: "Account number",
    regex:
      /(account number|bank account|card number|iban|账号|银行卡号|卡号|账户)\s*[:：]?\s*([A-Z0-9\s-]{8,34})/giu,
    replacement: (_match, field) => `${field}: [REDACTED_ACCOUNT]`,
  },
  {
    label: "Account number",
    regex: /\b(?:\d[ -]?){12,19}\d\b/gu,
    replacement: "[REDACTED_ACCOUNT]",
  },
  {
    label: "Address",
    regex: /(address|home address|residential address|地址|住址)\s*[:：]?\s*([^\n]{8,120})/giu,
    replacement: (_match, field) => `${field}: [REDACTED_ADDRESS]`,
  },
];

function countPatternMatches(input: string, pattern: RegExp): number {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  const matches = input.match(matcher);
  return matches?.length ?? 0;
}

export function getContractAnalysisProfile(inputKind: ContractInputKind): AnalysisProfile {
  return CONTRACT_ANALYSIS_PROFILES[inputKind];
}

export function redactSensitiveText(text: string): {
  redactedText: string;
  findings: RedactionFinding[];
  totalRedactions: number;
} {
  let output = text;
  const findings: RedactionFinding[] = [];

  for (const pattern of REDACTION_PATTERNS) {
    const matchCount = countPatternMatches(output, pattern.regex);
    if (!matchCount) {
      continue;
    }

    output =
      typeof pattern.replacement === "string"
        ? output.replace(pattern.regex, pattern.replacement)
        : output.replace(pattern.regex, pattern.replacement);

    const existing = findings.find((item) => item.label === pattern.label);
    if (existing) {
      existing.count += matchCount;
    } else {
      findings.push({ label: pattern.label, count: matchCount });
    }
  }

  const totalRedactions = findings.reduce((sum, item) => sum + item.count, 0);

  return {
    redactedText: output,
    findings,
    totalRedactions,
  };
}

export function summarizeRedactions(findings: RedactionFinding[]): string {
  if (!findings.length) {
    return "No automatic text redactions were applied.";
  }

  return findings
    .map((item) => `${item.count} ${item.label.toLowerCase()}${item.count > 1 ? "s" : ""}`)
    .join(", ");
}

export async function applyImageRedactions(
  sourceDataUrl: string,
  areas: ImageRedactionArea[],
): Promise<string> {
  if (!areas.length) {
    return sourceDataUrl;
  }

  const image = await loadImage(sourceDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create a drawing context for image redaction.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.fillStyle = "#050505";

  for (const area of areas) {
    context.fillRect(
      (area.x / 100) * canvas.width,
      (area.y / 100) * canvas.height,
      (area.width / 100) * canvas.width,
      (area.height / 100) * canvas.height,
    );
  }

  return canvas.toDataURL("image/png");
}

function loadImage(sourceDataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load the selected image."));
    image.src = sourceDataUrl;
  });
}
