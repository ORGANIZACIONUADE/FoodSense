import type { Metadata } from "next";
import { AddProductForm } from "@/components/agregar/add-product-form";

export const metadata: Metadata = {
  title: "Agregar producto — FoodSense",
};

export default function AgregarPage() {
  return (
    <div className="flex h-dvh flex-col bg-bg">
      <AddProductForm />
    </div>
  );
}
