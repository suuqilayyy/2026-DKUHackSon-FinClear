import { Download, FileLock2, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUserMode } from "@/contexts/UserModeContext";

function formatReceiptTime(timestamp: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return timestamp;
  }
}

export function PrivacyLedgerCard() {
  const { analysisMode, consentLedger, clearConsentLedger, language } = useUserMode();

  const modeLabel =
    analysisMode === "redacted"
      ? language === "zh"
        ? "脱敏模式"
        : "Redacted mode"
      : language === "zh"
        ? "标准模式"
        : "Standard mode";

  const exportLedger = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      receiptCount: consentLedger.length,
      receipts: consentLedger,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finclear-consent-ledger.json";
    link.click();
    URL.revokeObjectURL(url);

    toast.success(language === "zh" ? "已导出本地 consent ledger" : "Consent ledger exported");
  };

  const deleteLedger = () => {
    clearConsentLedger();
    toast.success(language === "zh" ? "已删除本地 consent receipts" : "Local consent receipts deleted");
  };

  return (
    <Card className="rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-[#11131A]/90 dark:shadow-none">
      <CardHeader className="gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <FileLock2 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                {language === "zh" ? "隐私与同意账本" : "Privacy & Consent Ledger"}
              </CardTitle>
              <CardDescription className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {language === "zh"
                  ? "每次云端分析都会在本机留下 receipt，可导出也可删除。"
                  : "Each cloud analysis leaves a local receipt you can export or delete."}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {modeLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-5 pt-0">
        <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {language === "zh"
                ? "FinClear 不会在响应返回后保留原始合同内容。这里保存的是本地 consent receipt，不是合同全文。"
                : "FinClear does not keep raw contract content after a response. This card stores local consent receipts, not full documents."}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <span>{language === "zh" ? "最近 receipts" : "Recent receipts"}</span>
          <span>{consentLedger.length}</span>
        </div>

        {consentLedger.length ? (
          <ScrollArea className="h-48 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/70 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-3 p-3">
              {consentLedger.map((receipt) => (
                <div
                  key={receipt.id}
                  className="rounded-[1.25rem] border border-slate-200/70 bg-white/90 p-3 dark:border-white/10 dark:bg-[#0F1320]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {receipt.processingMode === "redacted"
                          ? language === "zh"
                            ? "脱敏分析"
                            : "Redacted analysis"
                          : language === "zh"
                            ? "标准分析"
                            : "Standard analysis"}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        {formatReceiptTime(receipt.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      {receipt.inputKind === "image"
                        ? language === "zh"
                          ? "图片"
                          : "Image"
                        : language === "zh"
                          ? "文本"
                          : "Text"}
                    </Badge>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {receipt.provider} · {receipt.model}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {receipt.redactionSummary}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200/80 bg-slate-50/50 p-4 text-xs leading-relaxed text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
            {language === "zh"
              ? "还没有本地 receipt。下一次分析前，用户 consent 会先被记录。"
              : "No local receipts yet. The next analysis will record consent before upload."}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={exportLedger}
            disabled={!consentLedger.length}
          >
            <Download data-icon="inline-start" />
            {language === "zh" ? "导出" : "Export"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={deleteLedger}
            disabled={!consentLedger.length}
          >
            <Trash2 data-icon="inline-start" />
            {language === "zh" ? "删除" : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
