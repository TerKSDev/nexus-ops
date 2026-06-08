"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import ActionModal from "./ActionModal";

interface RepoActionsProps {
  repoId: string;
  repoName: string;
  url: string;
  isActive: boolean;
}

export default function RepoActions({ repoId, repoName, url, isActive }: RepoActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-neutral-900 border-neutral-800 rounded-md text-neutral-300 border hover:bg-neutral-700 h-7 cursor-pointer w-7 flex items-center justify-center transition-colors duration-200"
      >
        <Settings size={14} />
      </button>

      {isModalOpen && (
        <ActionModal
          repoId={repoId}
          repoName={repoName}
          url={url}
          isActive={isActive}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
