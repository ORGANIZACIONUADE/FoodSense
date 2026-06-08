"use client";

import { useEffect, useRef } from "react";

type ConfirmExitDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmExitDialog({
  open,
  onConfirm,
  onCancel,
}: ConfirmExitDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmed = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      confirmed.current = false;
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleClose() {
      if (!confirmed.current) onCancel();
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onCancel]);

  function handleConfirm() {
    confirmed.current = true;
    onConfirm();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="confirm-exit-title"
      className="m-auto w-[min(calc(100vw-2.25rem),360px)] rounded-2xl border border-border bg-bg p-6 shadow-xl backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-5">
        <div>
          <p id="confirm-exit-title" className="text-[15px] font-bold tracking-tight">
            ¿Salir sin guardar?
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">
            Tenés datos cargados que se van a perder si salís ahora.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="flex-1 rounded-full border border-border py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-surface-alt"
          >
            Quedarme
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-full bg-[#D85B4A] py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            Salir igual
          </button>
        </div>
      </div>
    </dialog>
  );
}
