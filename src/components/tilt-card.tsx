import { useRef, type ReactNode } from "react";

/** 3D tilt-on-hover wrapper with a moving glare highlight. */
export function TiltCard({
  children,
  className = "",
  maxTilt = 9,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * maxTilt}deg) rotateY(${(x - 0.5) * maxTilt}deg) translateZ(8px)`;
    el.style.setProperty("--glare-x", `${x * 100}%`);
    el.style.setProperty("--glare-y", `${y * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card relative ${className}`}
    >
      {children}
      <div className="tilt-glare" />
    </div>
  );
}
