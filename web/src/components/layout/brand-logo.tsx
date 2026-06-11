import Image from "next/image";

type BrandLogoProps = {
  variant?: "icon" | "full";
  className?: string;
};

export function BrandLogo({ variant = "icon", className }: BrandLogoProps) {
  const src = variant === "full" ? "/foodsense-logo.svg" : "/foodsense-icon.svg";
  const size = variant === "full" ? 720 : 512;

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
