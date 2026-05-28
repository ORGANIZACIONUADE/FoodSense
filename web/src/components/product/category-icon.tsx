import { Icon } from "@/components/icons/icon";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryKey } from "@/lib/types";

type CategoryIconProps = {
  category: CategoryKey;
  size?: number;
};

export function CategoryIcon({ category, size = 44 }: CategoryIconProps) {
  const meta = CATEGORIES[category] ?? CATEGORIES.conservas;
  const iconSize = Math.round(size * 0.58);

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md"
      style={{
        width: size,
        height: size,
        backgroundColor: meta.tint,
        color: meta.stroke,
      }}
    >
      <Icon name={meta.icon} size={iconSize} color={meta.stroke} />
    </div>
  );
}
