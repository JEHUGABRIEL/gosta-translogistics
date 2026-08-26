"use client";

const keyframes = `
  @keyframes progress-fill {
    0% { width: 0%; }
    20% { width: 30%; }
    50% { width: 60%; }
    80% { width: 80%; }
    100% { width: 90%; }
  }
`;

export default function TopProgressBar() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div className="fixed top-0 left-0 right-0 z-[10000] h-1 overflow-hidden">
        <div
          className="h-full rounded-r-full bg-[var(--red)]"
          style={{ animation: "progress-fill 2.5s ease-in-out infinite" }}
        />
      </div>
    </>
  );
}
