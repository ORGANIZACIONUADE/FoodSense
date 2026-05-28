import { ICON_PATHS } from "./icon-paths";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.75,
  className,
}: IconProps) {
  const path = ICON_PATHS[name];
  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      {path}
    </svg>
  );
}
