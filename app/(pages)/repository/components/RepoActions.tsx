"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import ActionModal from "./ActionModal";

interface RepoActionsProps {
  repoId: string;
  repoName: string;
  url: string;
  isActive: boolean;
  autoMergePR: boolean;
}

export default function RepoActions({
  repoId,
  repoName,
  url,
  isActive,
  autoMergePR,
}: RepoActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="repo-settings"
        className="h-7 w-7 flex items-center justify-center rounded border border-neutral-700/60 text-neutral-500 hover:text-neutral-100 hover:border-neutral-500/60 hover:bg-neutral-800/60 cursor-pointer transition-all duration-200 bg-transparent"
      >
        <Settings size={13} />
      </button>

      {isModalOpen && (
        <ActionModal
          repoId={repoId}
          repoName={repoName}
          url={url}
          isActive={isActive}
          autoMergePR={autoMergePR}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
