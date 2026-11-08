"use client";

import { Badge } from "@/components/tailgrids/core/badge";
import { useSyncExternalStore } from "react";

const credentialChangeEvent = "credential-change";

function subscribeToCredential(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener(credentialChangeEvent, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(credentialChangeEvent, onChange);
  };
}

function getCredentialSnapshot() {
  return window.localStorage.getItem("credential");
}

function getServerCredentialSnapshot() {
  return null;
}

export default function Header() {
  const credentialString = useSyncExternalStore(
    subscribeToCredential,
    getCredentialSnapshot,
    getServerCredentialSnapshot
  );

  let credential = null;
  try {
    credential = credentialString ? JSON.parse(credentialString) : null;
  } catch {
    credential = null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center gap-2">
        <Badge className="-rotate-6 rounded-lg bg-red-600 px-2 py-0.5 text-2xl text-white">C</Badge>
        <Badge className="-rotate-3 rounded-lg bg-emerald-600 px-2 py-0.5 text-2xl text-white">S</Badge>
        <Badge className="-rotate-6 rounded-lg bg-blue-600 px-2 py-0.5 text-2xl text-white">I</Badge>
        <Badge className="rotate-3 rounded-lg bg-sky-400 px-2 py-0.5 text-2xl text-white">2</Badge>
        <Badge className="rotate-6 rounded-lg bg-amber-400 px-2 py-0.5 text-2xl text-white">0</Badge>
        <Badge className="rotate-6 rounded-lg bg-slate-500 px-2 py-0.5 text-2xl text-white">5</Badge>
      </div>
      <div className="mt-1 rounded-sm bg-black px-2 py-0.5 text-sm text-white">
        FRONT END SOFTWARE DEVELOPMENT
      </div>
      {credential && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold">
          <span>
            ROLE: <strong className="rounded bg-red-100 px-1.5 py-0.5 text-red-600">{credential.role.toUpperCase()}</strong>
          </span>
          <span>
            NAME: <strong className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">{credential.name}</strong>
          </span>
          <span>
            EMAIL: <strong className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{credential.email}</strong>
          </span>
        </div>
      )}
    </div>
  );
}