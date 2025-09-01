
import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Rect = { left: number; top: number; width: number; height: number };

export type FlowAnimatorHandle = {
  fly: (text: string, from: Rect, to: Rect) => void;
};

export const FlowAnimator = forwardRef<FlowAnimatorHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.className = "pointer-events-none fixed inset-0 z-50";
    document.body.appendChild(el);
    containerRef.current = el;
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    fly(text: string, from: Rect, to: Rect) {
      if (!containerRef.current) return;
      const ghost = document.createElement("div");
      ghost.textContent = text;
      ghost.setAttribute("role","presentation");
      ghost.className = cn("absolute px-3 py-2 rounded-md border bg-card shadow-md will-change-transform");
      const startX = from.left;
      const startY = from.top;
      const endX = to.left;
      const endY = to.top;
      ghost.style.left = `${startX}px`;
      ghost.style.top = `${startY}px`;
      containerRef.current.appendChild(ghost);

      const dx = endX - startX;
      const dy = endY - startY;

      try {
        const anyGhost = ghost as any;
        if (typeof anyGhost.animate === "function") {
          const anim = anyGhost.animate(
            [
              { transform: "translate(0px, 0px) scale(0.98)", opacity: 0.0 },
              { transform: `translate(${dx * 0.3}px, ${dy * 0.3}px) scale(1)`, opacity: 1 },
              { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0.6 },
            ],
            { duration: 550, easing: "cubic-bezier(.22,.61,.36,1)" }
          );
          anim.onfinish = () => ghost.remove();
        } else {
          // jsdom: нет Web Animations API — просто мгновенно удалить
          ghost.remove();
        }
      } catch {
        ghost.remove();
      }
    },
  }));

  return containerRef.current ? createPortal(null, containerRef.current) : null;
});
