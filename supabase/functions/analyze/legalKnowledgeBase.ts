export interface LegalKnowledgeRecord {
  id: string;
  title: string;
  citation: string;
  year: string;
  jurisdiction: string;
  sourceType: "case" | "regulation" | "enforcement";
  holding: string;
  relevance: string;
  matchTerms: string[];
  url: string;
}

const LEGAL_KNOWLEDGE_BASE: LegalKnowledgeRecord[] = [
  {
    id: "tila-reg-z",
    title: "Truth in Lending Act / Regulation Z",
    citation: "12 C.F.R. Part 1026",
    year: "2021",
    jurisdiction: "United States",
    sourceType: "regulation",
    holding:
      "Credit terms must be disclosed in a meaningful, standardized way so consumers can compare total borrowing cost before committing.",
    relevance:
      "Use when headline pricing looks cheaper than the all-in economics because fees, add-on products, or default costs are obscured.",
    matchTerms: [
      "apr",
      "annual percentage rate",
      "finance charge",
      "service fee",
      "fee schedule",
      "late fee",
      "default charge",
      "total cost",
      "rollover",
      "extension",
      "balloon",
    ],
    url: "https://www.consumerfinance.gov/compliance/supervision-examinations/truth-in-lending-act-tila-examination-procedures/",
  },
  {
    id: "udaap-exam",
    title: "CFPB UDAAP Examination Procedures",
    citation: "CFPB Supervision and Examination Manual",
    year: "2023",
    jurisdiction: "United States",
    sourceType: "regulation",
    holding:
      "Examiners assess whether product features and terms make it harder for consumers to understand overall costs or risks and whether that creates unfair, deceptive, or abusive harm.",
    relevance:
      "Use when a clause may be formally permitted yet still exploits confusion, asymmetry, or borrower vulnerability.",
    matchTerms: [
      "unfair",
      "deceptive",
      "abusive",
      "unilateral",
      "sole discretion",
      "we may change",
      "at any time",
      "automatic renewal",
      "rollover",
      "collections",
      "debt trap",
    ],
    url: "https://www.consumerfinance.gov/compliance/supervision-examinations/unfair-deceptive-or-abusive-acts-or-practices-udaaps-examination-procedures/",
  },
  {
    id: "cashcall-cfpb",
    title: "CFPB v. CashCall",
    citation: "CFPB enforcement action",
    year: "2013",
    jurisdiction: "United States",
    sourceType: "enforcement",
    holding:
      "CFPB alleged CashCall collected on void or uncollectible high-cost online loans and used lender-structure design to evade state-law limits.",
    relevance:
      "Helpful when the contract relies on fee engineering, servicing structure, or jurisdictional design to preserve unlawful economics.",
    matchTerms: [
      "online loan",
      "tribal",
      "state law",
      "interest cap",
      "service fee",
      "origination fee",
      "void",
      "uncollectible",
      "debit account",
      "automatic debit",
    ],
    url: "https://www.consumerfinance.gov/about-us/newsroom/cfpb-sues-cashcall-for-illegal-online-loan-servicing/",
  },
  {
    id: "ace-cash-express",
    title: "CFPB action against ACE Cash Express",
    citation: "CFPB enforcement action",
    year: "2014",
    jurisdiction: "United States",
    sourceType: "enforcement",
    holding:
      "CFPB found ACE used illegal debt collection tactics and pushed borrowers into repeated payday borrowing cycles that generated new fees.",
    relevance:
      "Useful when the document combines delinquency pressure, extension mechanics, and repeated fee extraction.",
    matchTerms: [
      "payday",
      "rollover",
      "renewal",
      "extend the loan",
      "collections",
      "harass",
      "threaten",
      "overdue",
      "refinance",
      "reborrow",
    ],
    url: "https://www.consumerfinance.gov/about-us/newsroom/cfpb-takes-action-against-ace-cash-express-for-pushing-payday-borrowers-into-cycle-of-debt/",
  },
  {
    id: "mla-rights",
    title: "Military Lending Act",
    citation: "10 U.S.C. § 987 / MLA guidance",
    year: "2025",
    jurisdiction: "United States",
    sourceType: "regulation",
    holding:
      "Covered servicemembers and dependents receive a 36% MAPR cap and protection against mandatory arbitration, prepayment penalties, and mandatory allotments.",
    relevance:
      "Critical when contracts touch military borrowers or include arbitration, MAPR-sensitive fees, or prepayment penalties.",
    matchTerms: [
      "military",
      "servicemember",
      "service member",
      "dependent",
      "arbitration",
      "prepayment penalty",
      "mapr",
      "allotment",
      "active duty",
    ],
    url: "https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/military-lending-act-mla/",
  },
  {
    id: "firstcash-mla",
    title: "CFPB v. FirstCash settlement",
    citation: "CFPB enforcement action",
    year: "2025",
    jurisdiction: "United States",
    sourceType: "enforcement",
    holding:
      "The CFPB resolved claims that FirstCash made pawn loans above the MLA's 36% cap, required arbitration, and failed to provide required disclosures.",
    relevance:
      "Useful for military-family lending fact patterns where the agreement mixes excessive rates with procedural waivers.",
    matchTerms: [
      "pawn",
      "military",
      "arbitration",
      "36%",
      "annual percentage rate",
      "required disclosures",
      "servicemember",
    ],
    url: "https://www.consumerfinance.gov/about-us/newsroom/cfpb-reaches-settlement-with-firstcash-inc-and-its-subsidiaries-for-military-lending-act-violations/",
  },
  {
    id: "student-loan-exams",
    title: "Education Loan Examination Procedures",
    citation: "CFPB examination procedures",
    year: "2023",
    jurisdiction: "United States",
    sourceType: "regulation",
    holding:
      "CFPB examination procedures for private education loans and servicing emphasize marketing, origination, servicing, collections, complaints, and borrower communications.",
    relevance:
      "Useful when student-loan contracts contain aggressive servicing, collection, or benefit-denial risk.",
    matchTerms: [
      "student loan",
      "education loan",
      "forbearance",
      "deferment",
      "servicing",
      "borrower inquiry",
      "collection",
      "refinancing",
      "school",
    ],
    url: "https://www.consumerfinance.gov/compliance/supervision-examinations/education-loan-examination-procedures/",
  },
];

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "that",
  "with",
  "this",
  "from",
  "have",
  "your",
  "their",
  "into",
  "will",
  "may",
  "shall",
  "than",
  "they",
  "them",
  "are",
  "was",
  "were",
  "been",
  "being",
  "also",
  "any",
  "all",
  "our",
  "you",
  "not",
  "but",
  "can",
  "its",
  "loan",
  "loans",
  "borrower",
  "lender",
  "agreement",
  "contract",
]);

function normalizeText(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9% ]+/g, " ");
}

function tokenize(input: string) {
  return normalizeText(input)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function scoreRecord(text: string, tokenSet: Set<string>, record: LegalKnowledgeRecord) {
  let score = 0;

  for (const term of record.matchTerms) {
    const normalizedTerm = normalizeText(term).trim();
    if (!normalizedTerm) {
      continue;
    }

    if (normalizedTerm.includes(" ")) {
      if (text.includes(normalizedTerm)) {
        score += 5;
      }
      continue;
    }

    if (tokenSet.has(normalizedTerm)) {
      score += 3;
    }
  }

  if (record.sourceType === "regulation") {
    score += 0.15;
  }

  return score;
}

export function retrieveLegalKnowledge(
  contractText: string,
  limit = 4,
): { items: LegalKnowledgeRecord[]; retrievalSummary: string } {
  const normalizedText = normalizeText(contractText);
  const tokenSet = new Set(tokenize(contractText));

  const scored = LEGAL_KNOWLEDGE_BASE.map((record) => ({
    record,
    score: scoreRecord(normalizedText, tokenSet, record),
  }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  const selected = scored.length
    ? scored.slice(0, limit).map((entry) => entry.record)
    : LEGAL_KNOWLEDGE_BASE.slice(0, Math.min(limit, 3));

  const retrievalSummary = selected
    .map((item) => `${item.title}: ${item.relevance}`)
    .join(" ");

  return {
    items: selected,
    retrievalSummary,
  };
}

