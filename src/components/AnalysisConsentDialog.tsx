import { useMemo } from "react";
import { EyeOff, FileLock2, ImageIcon, Info, ShieldCheck, Sparkles } from "lucide-react";

import { ImageRedactionEditor } from "@/components/ImageRedactionEditor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Language } from "@/contexts/UserModeContext";
import {
  getContractAnalysisProfile,
  redactSensitiveText,
  summarizeRedactions,
  type ContractInputKind,
  type ImageRedactionArea,
  type ProcessingMode,
} from "@/lib/privacy";

interface ConfirmPayload {
  content: string;
  processingMode: ProcessingMode;
  redactionSummary: string;
  appliedRedactionCount: number;
}

interface AnalysisConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  inputKind: ContractInputKind;
  draftText: string;
  imageSrc: string | null;
  imageAreas: ImageRedactionArea[];
  onImageAreasChange: (areas: ImageRedactionArea[]) => void;
  processingMode: ProcessingMode;
  onProcessingModeChange: (mode: ProcessingMode) => void;
  isSubmitting: boolean;
  onConfirm: (payload: ConfirmPayload) => Promise<void> | void;
}

export function AnalysisConsentDialog({
  open,
  onOpenChange,
  language,
  inputKind,
  draftText,
  imageSrc,
  imageAreas,
  onImageAreasChange,
  processingMode,
  onProcessingModeChange,
  isSubmitting,
  onConfirm,
}: AnalysisConsentDialogProps) {
  const profile = getContractAnalysisProfile(inputKind);
  const redactionPreview = useMemo(() => redactSensitiveText(draftText), [draftText]);
  const copy = language === "zh"
    ? {
        title: "上传前同意确认",
        description: "我们会在发送到云端模型前告诉你将共享什么，以及如何最小化敏感信息。",
        standard: "标准模式",
        redacted: "脱敏模式",
        standardHint: "发送完整文本或图片，得到最完整的分析。",
        redactedHint:
          inputKind === "text"
            ? "先在本机自动遮掉姓名、证件号、账号等信息，再发起分析。"
            : "先在本机手动框选敏感区域并打码，再发起分析。",
        inputLabel: inputKind === "image" ? "输入类型：合同图片" : "输入类型：合同文本",
        shared: "将发送的数据",
        retention: "保留策略",
        processor: "处理方",
        previewOriginal: "原始内容",
        previewRedacted: "脱敏后内容",
        previewHelp: "我们建议在向任何外部模型发送之前先做脱敏。",
        noRedaction:
          inputKind === "image"
            ? "脱敏模式下，图片至少需要一个遮罩区域。"
            : "没有检测到明显的 PII；如果文本仍包含敏感字段，请手动检查。",
        confirm: processingMode === "redacted" ? "同意并以脱敏模式分析" : "同意并继续分析",
        cancel: "取消",
        receipt: "这次操作会在本机留下 consent receipt，之后可导出或删除。",
      }
    : {
        title: "Consent before upload",
        description: "We show exactly what leaves the device, who processes it, and how to minimize sensitive data before cloud analysis.",
        standard: "Standard mode",
        redacted: "Redacted mode",
        standardHint: "Send the full text or image for the fullest analysis.",
        redactedHint:
          inputKind === "text"
            ? "Automatically mask names, IDs, account numbers, and similar PII on-device before analysis."
            : "Manually blackout sensitive regions on-device before the image is sent.",
        inputLabel: inputKind === "image" ? "Input: contract image" : "Input: contract text",
        shared: "Data sent",
        retention: "Retention",
        processor: "Processor",
        previewOriginal: "Original",
        previewRedacted: "Redacted",
        previewHelp: "We recommend redacting before any external model sees the content.",
        noRedaction:
          inputKind === "image"
            ? "Redacted mode requires at least one blackout box for images."
            : "No obvious PII was detected automatically. Please review the preview if the text still contains sensitive fields.",
        confirm: processingMode === "redacted" ? "Consent and analyze redacted copy" : "Consent and continue",
        cancel: "Cancel",
        receipt: "This action will create a local consent receipt you can export or delete later.",
      };

  const isImageRedacted = processingMode === "redacted" && inputKind === "image";
  const isTextRedacted = processingMode === "redacted" && inputKind === "text";
  const canSubmit = processingMode === "standard" || inputKind === "text" || imageAreas.length > 0;

  const submit = async () => {
    const payload = isTextRedacted
      ? {
          content: redactionPreview.redactedText,
          processingMode,
          redactionSummary: summarizeRedactions(redactionPreview.findings),
          appliedRedactionCount: redactionPreview.totalRedactions,
        }
      : {
          content: imageSrc ?? draftText,
          processingMode,
          redactionSummary:
            inputKind === "image" && imageAreas.length
              ? `${imageAreas.length} manual image redaction box${imageAreas.length === 1 ? "" : "es"}`
              : "No redactions applied.",
          appliedRedactionCount: inputKind === "image" ? imageAreas.length : 0,
        };

    await onConfirm(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-[2rem] border border-slate-200 bg-white/95 p-0 shadow-2xl dark:border-white/10 dark:bg-[#0B0F19]/95">
        <DialogHeader className="gap-3 p-6 text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <FileLock2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl text-slate-900 dark:text-white">{copy.title}</DialogTitle>
              <DialogDescription className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {copy.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <ToggleGroup
            type="single"
            value={processingMode}
            onValueChange={(value) => {
              if (value === "standard" || value === "redacted") {
                onProcessingModeChange(value);
              }
            }}
            className="grid grid-cols-2 gap-3"
          >
            <ToggleGroupItem value="standard" variant="outline" className="h-auto rounded-[1.5rem] border border-slate-200 px-4 py-4 text-left data-[state=on]:border-slate-900 data-[state=on]:bg-slate-900 data-[state=on]:text-white dark:border-white/10 dark:data-[state=on]:border-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-slate-900">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{copy.standard}</span>
                <span className="text-xs leading-relaxed opacity-80">{copy.standardHint}</span>
              </div>
            </ToggleGroupItem>
            <ToggleGroupItem value="redacted" variant="outline" className="h-auto rounded-[1.5rem] border border-slate-200 px-4 py-4 text-left data-[state=on]:border-emerald-600 data-[state=on]:bg-emerald-600 data-[state=on]:text-white dark:border-white/10 dark:data-[state=on]:border-emerald-400 dark:data-[state=on]:bg-emerald-500 dark:data-[state=on]:text-slate-950">
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{copy.redacted}</span>
                <span className="text-xs leading-relaxed opacity-80">{copy.redactedHint}</span>
              </div>
            </ToggleGroupItem>
          </ToggleGroup>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2">
                {inputKind === "image" ? <ImageIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" /> : <ShieldCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{copy.shared}</p>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-800 dark:text-white">{copy.inputLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.dataCategories.map((category) => (
                  <Badge key={category} variant="outline" className="border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-transparent dark:text-slate-200">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{copy.processor}</p>
              </div>
              <p className="mt-3 text-sm font-medium text-slate-800 dark:text-white">{profile.provider}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{profile.model}</p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{copy.retention}</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{profile.retention}</p>
            </div>
          </div>

          <Alert className="rounded-[1.5rem] border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-white/5">
            <EyeOff className="h-4 w-4" />
            <AlertTitle className="text-sm">{copy.receipt}</AlertTitle>
            <AlertDescription>{copy.previewHelp}</AlertDescription>
          </Alert>

          <Separator />

          {inputKind === "text" ? (
            <Tabs defaultValue={isTextRedacted ? "redacted" : "original"}>
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 dark:bg-white/10">
                <TabsTrigger value="original" className="rounded-full">
                  {copy.previewOriginal}
                </TabsTrigger>
                <TabsTrigger value="redacted" className="rounded-full">
                  {copy.previewRedacted}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="original" className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-[#0E1422]">
                <pre className="max-h-56 whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  {draftText}
                </pre>
              </TabsContent>

              <TabsContent value="redacted" className="rounded-[1.5rem] border border-emerald-200/80 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <pre className="max-h-56 whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-100">
                  {redactionPreview.redactedText}
                </pre>
                <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {redactionPreview.totalRedactions
                    ? summarizeRedactions(redactionPreview.findings)
                    : copy.noRedaction}
                </p>
              </TabsContent>
            </Tabs>
          ) : imageSrc ? (
            <div className="flex flex-col gap-4">
              {isImageRedacted ? (
                <ImageRedactionEditor
                  imageSrc={imageSrc}
                  areas={imageAreas}
                  onChange={onImageAreasChange}
                  language={language}
                />
              ) : (
                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-[#0E1422]">
                  <img src={imageSrc} alt="Contract preview" className="block max-h-[420px] w-full object-contain" />
                </div>
              )}

              {!canSubmit && (
                <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-300">{copy.noRedaction}</p>
              )}
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 dark:border-white/10">
          <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {processingMode === "redacted" && inputKind === "text"
              ? summarizeRedactions(redactionPreview.findings)
              : processingMode === "redacted" && inputKind === "image"
                ? `${imageAreas.length} blackout box${imageAreas.length === 1 ? "" : "es"}`
                : copy.standardHint}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
              {copy.cancel}
            </Button>
            <Button type="button" className="rounded-full" onClick={submit} disabled={isSubmitting || !canSubmit}>
              <ShieldCheck data-icon="inline-start" />
              {copy.confirm}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
