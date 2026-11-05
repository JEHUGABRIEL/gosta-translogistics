/**
 * Soulignement « au pinceau » orange, repris de la maquette de référence :
 * deux traits légèrement courbés, plus épais au centre. Purement décoratif.
 */
export default function BrushUnderline({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 16"
      preserveAspectRatio="none"
      fill="none"
      className={className}
    >
      <path
        d="M3 11.5C44 3.5 132 1.5 237 6.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M38 14.5C96 9.5 168 9 210 12.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
