"use client";

import { useState } from "react";

function randomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `ZCM-${s}`;
}

export default function CodeInput() {
  const [code, setCode] = useState("");

  return (
    <div className="flex gap-2">
      <input
        name="code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="ZCM-XXXXXX"
        required
        className="bg-transparent border border-current/25 px-3 py-2 text-sm focus:outline-none focus:border-current/60 uppercase flex-1 min-w-0"
      />
      <button
        type="button"
        onClick={() => setCode(randomCode())}
        className="border border-current/25 px-3 py-1 text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity whitespace-nowrap"
      >
        Gen
      </button>
    </div>
  );
}
