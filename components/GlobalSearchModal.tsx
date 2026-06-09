"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Monitor, BookOpen, Settings, LayoutDashboard, TerminalSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  type: "PAGE" | "ACTION";
};

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: SearchItem[] = [
    { id: "dashboard", title: "Overview Dashboard", subtitle: "Go to system overview", icon: LayoutDashboard, href: "/overview", type: "PAGE" },
    { id: "repo", title: "Repository Monitor", subtitle: "Manage your GitHub tracking", icon: Monitor, href: "/repository", type: "PAGE" },
    { id: "docs", title: "Data Bank (Docs)", subtitle: "Read system documentation", icon: BookOpen, href: "/docs", type: "PAGE" },
    { id: "settings", title: "System Configuration", subtitle: "Manage settings and webhooks", icon: Settings, href: "/settings", type: "PAGE" },
    { id: "action_sync", title: "Sync All Repositories", subtitle: "Trigger a global sync (Mock)", icon: TerminalSquare, action: () => alert("Sync triggered!"), type: "ACTION" },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-neutral-900/90 border border-neutral-700/50 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[101]"
          >
            <div className="flex items-center px-4 py-3 border-b border-neutral-800 bg-neutral-950/50">
              <Search className="w-5 h-5 text-healthy-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, pages, or operations..."
                className="flex-1 bg-transparent border-none outline-none text-neutral-100 placeholder-neutral-600 font-mono text-sm"
              />
              <div className="flex items-center gap-1.5 ml-3">
                <kbd className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px] font-bold">ESC</kbd>
                <span className="text-neutral-600 text-xs">to close</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? "bg-healthy-500/10 border-healthy-500/30 border" : "border border-transparent hover:bg-neutral-800/50"
                      }`}
                    >
                      <div className={`p-2 rounded-md ${isSelected ? "bg-healthy-500/20 text-healthy-400" : "bg-neutral-800 text-neutral-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold tracking-wide uppercase ${isSelected ? "text-healthy-400" : "text-neutral-200"}`}>
                          {item.title}
                        </span>
                        <span className="text-xs text-neutral-500">{item.subtitle}</span>
                      </div>
                      <div className="ml-auto flex items-center">
                        <span className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">{item.type}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <TerminalSquare className="w-8 h-8 text-neutral-700 mb-3" />
                  <p className="text-neutral-400 text-sm font-bold tracking-widest uppercase">No results found</p>
                  <p className="text-neutral-600 text-xs mt-1">Try searching for pages or actions.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
