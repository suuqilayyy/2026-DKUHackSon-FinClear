import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Eraser, RotateCcw, ScanSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Language } from "@/contexts/UserModeContext";
import type { ImageRedactionArea } from "@/lib/privacy";

interface ImageRedactionEditorProps {
  imageSrc: string;
  areas: ImageRedactionArea[];
  onChange: (areas: ImageRedactionArea[]) => void;
  language: Language;
}

interface DraftArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function ImageRedactionEditor({
  imageSrc,
  areas,
  onChange,
  language,
}: ImageRedactionEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<DraftArea | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

  const copyText =
    language === "zh"
      ? {
          title: "本地图片脱敏",
          subtitle: "在上传前用鼠标框选姓名、账号、身份证号等敏感区域。",
          help: "拖拽即可添加遮罩。建议至少覆盖姓名、证件号和银行卡号。",
          badges: `${areas.length} 个遮罩`,
          undo: "撤销上一个",
          clear: "清空遮罩",
        }
      : {
          title: "On-device image redaction",
          subtitle: "Draw over names, account numbers, or IDs before anything is sent.",
          help: "Drag to add blackout boxes. We recommend covering names, IDs, and bank numbers at minimum.",
          badges: `${areas.length} redaction box${areas.length === 1 ? "" : "es"}`,
          undo: "Undo last",
          clear: "Clear all",
        };

  const toPercentage = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: clampPercentage(((clientX - rect.left) / rect.width) * 100),
      y: clampPercentage(((clientY - rect.top) / rect.height) * 100),
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const point = toPercentage(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture(event.pointerId);
    setOrigin(point);
    setDraft({ x: point.x, y: point.y, width: 0, height: 0 });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!origin) {
      return;
    }

    const point = toPercentage(event.clientX, event.clientY);
    setDraft({
      x: Math.min(origin.x, point.x),
      y: Math.min(origin.y, point.y),
      width: Math.abs(point.x - origin.x),
      height: Math.abs(point.y - origin.y),
    });
  };

  const handlePointerUp = () => {
    if (draft && draft.width > 1 && draft.height > 1) {
      onChange([
        ...areas,
        {
          id: `${Date.now()}-${Math.round(draft.x * 10)}-${Math.round(draft.y * 10)}`,
          ...draft,
        },
      ]);
    }

    setOrigin(null);
    setDraft(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ScanSearch className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{copyText.title}</p>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{copyText.subtitle}</p>
        </div>
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          {copyText.badges}
        </Badge>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-slate-50 touch-none dark:border-white/10 dark:bg-[#0D1220]"
      >
        <img src={imageSrc} alt="Redaction preview" className="block w-full rounded-[1.5rem]" />
        <div
          className="absolute inset-0 cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            if (!origin) {
              return;
            }
            handlePointerUp();
          }}
        >
          {areas.map((area) => (
            <div
              key={area.id}
              className="absolute border-2 border-rose-500 bg-rose-500/35"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
              }}
            />
          ))}

          {draft && (
            <div
              className="absolute border-2 border-amber-400 bg-amber-400/35"
              style={{
                left: `${draft.x}%`,
                top: `${draft.y}%`,
                width: `${draft.width}%`,
                height: `${draft.height}%`,
              }}
            />
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{copyText.help}</p>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => onChange(areas.slice(0, -1))} disabled={!areas.length}>
          <RotateCcw data-icon="inline-start" />
          {copyText.undo}
        </Button>
        <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => onChange([])} disabled={!areas.length}>
          <Eraser data-icon="inline-start" />
          {copyText.clear}
        </Button>
      </div>
    </div>
  );
}
