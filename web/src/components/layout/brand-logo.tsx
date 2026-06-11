import Image from "next/image";

type BrandLogoProps = {
  variant?: "icon" | "full";
  className?: string;
};

export function BrandLogo({ variant = "icon", className }: BrandLogoProps) {
  const src = variant === "full" ? "/foodsense-logo.png" : "/foodsense-icon.png";
  const size = 464;

  return (
    <Image
      src={src}
      alt="FoodSense"
      width={size}
      height={size}
      className={className}
      draggable={false}
      priority={variant === "full"}
    />
  );
}
