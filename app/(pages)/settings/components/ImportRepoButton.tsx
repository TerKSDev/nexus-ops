"use client";

import { useState } from "react";
import ImportRepoModal from "./ImportRepoModal";
import { CloudDownload } from "lucide-react";

export default function ImportRepoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-neutral-800 text-xs hover:bg-neutral-700 border border-neutral-700 rounded-lg text-neutral-200 font-bold uppercase tracking-wider transition-colors"
      >
        <CloudDownload className="w-4 h-4" />
        Import
      </button>
      <ImportRepoModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
