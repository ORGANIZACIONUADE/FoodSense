"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/icon";

type CameraState = "requesting" | "active" | "denied" | "unsupported" | "error";

type CameraScannerProps = {
  onClose: () => void;
};

export function CameraScanner({ onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>("requesting");

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const timeout = window.setTimeout(() => setState("unsupported"), 0);
      return () => window.clearTimeout(timeout);
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setState("active");
      })
      .catch((err: unknown) => {
        if (
          err instanceof DOMException &&
          (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")
        ) {
          setState("denied");
        } else {
          setState("error");
        }
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function handleCapture() {
    // OCR / lectura de código EAN se implementa en sprint posterior
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Feed de cámara — siempre montado para que el ref esté disponible */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full object-cover ${state !== "active" ? "hidden" : ""}`}
      />

      {/* Header */}
      <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar escáner"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 transition-opacity active:opacity-70"
        >
          <Icon name="x" size={20} color="white" />
        </button>
        <span className="font-mono text-[11px] uppercase tracking-[2px] text-white/60">
          Escáner
        </span>
        <div className="h-10 w-10" />
      </div>

      {/* Contenido central */}
      {state === "active" && (
        <>
          {/* Viewfinder */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div
              className="h-60 w-[min(300px,78vw)] rounded-2xl border-2 border-white/90"
              style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.58)" }}
              aria-label="Marco de escaneo"
            />
          </div>

          {/* Branding + captura */}
          <div className="relative z-10 flex shrink-0 flex-col items-center gap-2 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-5">
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-[2.5px] text-white/40">
              FoodSense
            </p>
            <p className="text-[14px] font-medium text-white/85">
              Escaneá un producto para agregarlo
            </p>
            <button
              type="button"
              onClick={handleCapture}
              aria-label="Capturar foto"
              className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform active:scale-90"
            >
              <div className="h-12 w-12 rounded-full bg-green" />
            </button>
          </div>
        </>
      )}

      {state === "requesting" && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3">
          <p className="text-[14px] text-white/70">Activando cámara…</p>
        </div>
      )}

      {state === "denied" && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
          <Icon name="camera" size={52} color="rgba(255,255,255,0.3)" strokeWidth={1.25} />
          <p className="text-[17px] font-bold text-white">Sin acceso a la cámara</p>
          <p className="text-[13.5px] leading-relaxed text-white/65">
            Habilitá el permiso de cámara en la configuración de tu dispositivo y volvé a intentar.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 rounded-full border border-white/30 px-7 py-2.5 text-[13.5px] font-semibold text-white transition-opacity active:opacity-70"
          >
            Volver
          </button>
        </div>
      )}

      {(state === "unsupported" || state === "error") && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
          <Icon name="camera" size={52} color="rgba(255,255,255,0.3)" strokeWidth={1.25} />
          <p className="text-[17px] font-bold text-white">
            {state === "unsupported"
              ? "Tu dispositivo no soporta esta función"
              : "Error al acceder a la cámara"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 rounded-full border border-white/30 px-7 py-2.5 text-[13.5px] font-semibold text-white transition-opacity active:opacity-70"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
}
