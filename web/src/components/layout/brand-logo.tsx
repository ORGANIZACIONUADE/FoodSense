import Image from "next/image";

type BrandLogoProps = {
  variant?: "icon" | "full";
  className?: string;
};

export function BrandLogo({ variant = "icon", className }: BrandLogoProps) {
  const src = variant === "full" ? "/foodsense-logo.jpg" : "/foodsense-icon.jpg";
  const size = 640;

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
