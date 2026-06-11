"use client";

import { AddProductForm } from "@/components/agregar/add-product-form";
import { useRequireAuth } from "@/lib/use-require-auth";

export default function AgregarPage() {
  const session = useRequireAuth();
  if (!session) return null;

  return (
    <div className="flex h-dvh flex-col bg-bg">
      <AddProductForm />
    </div>
  );
}
