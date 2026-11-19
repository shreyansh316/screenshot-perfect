import { useEffect, useRef, useState } from "react";
import type { ResumeData, TemplateKey } from "@/lib/resume";
import { ResumeSheet } from "./ResumeSheet";

const SHEET_W = 794;

/** Renders the A4-width resume sheet scaled down to fit its container. */
export function ScaledPreview({ data, template }: { data: ResumeData; template: TemplateKey }) {
  const box = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [height, setHeight] = useState(1123);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / SHEET_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = sheet.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="w-full overflow-hidden" style={{ height: height * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: SHEET_W }}>
        <ResumeSheet ref={sheet} data={data} template={template} className="rounded-sm border shadow-pop" />
      </div>
    </div>
  );
}
