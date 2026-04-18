import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const scanMessages = [
  "正在读取合同…",
  "识别风险条款…",
  "为您整理结果…",
];

export function ScanningAnimation() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % scanMessages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
        {scanMessages[msgIndex]}
      </p>
    </div>
  );
}
