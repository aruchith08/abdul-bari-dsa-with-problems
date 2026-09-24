import React from 'react';
import { TopicCategory } from '../../types/dsa';
import { RoadmapIcon, ProgressIcon, RevisionIcon, NotesIcon, AboutIcon, Share2 } from '../common/icons';

interface SidebarProps {
  categories: TopicCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  totalProblemsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activeNavTab?: string;
  onSelectNavTab?: (tab: string) => void;
  onOpenShare?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  totalProblemsCount,
  isOpenMobile,
  onCloseMobile,
  activeNavTab = 'roadmap',
  onSelectNavTab,
  onOpenShare,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-40 w-64 shrink-0 border-r-2 border-black bg-[#ECECEC] p-3 pb-8 overflow-y-auto transition-transform duration-200 lg:sticky lg:top-14 lg:z-20 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 flex flex-col justify-between ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile Navigation Section (Only shown on mobile view) */}
          <div className="lg:hidden mb-4 pb-3 border-b-2 border-black">
            <div className="px-2 py-1 mb-2 text-[10px] font-mono font-black tracking-wider text-black/60 uppercase">
              NAVIGATION
            </div>
            <nav className="space-y-1.5 font-sans">
              <button
                onClick={() => {
                  onSelectNavTab?.('roadmap');
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer ${
                  activeNavTab === 'roadmap'
                    ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white'
                }`}
              >
                <RoadmapIcon className="h-4 w-4 shrink-0" />
                <span>DSA ROADMAP</span>
              </button>

              <button
                onClick={() => {
                  onSelectNavTab?.('progress');
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer ${
                  activeNavTab === 'progress'
                    ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white'
                }`}
              >
                <ProgressIcon className="h-4 w-4 shrink-0" />
                <span>PROGRESS</span>
              </button>

              <button
                onClick={() => {
                  onSelectNavTab?.('revision');
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer ${
                  activeNavTab === 'revision'
                    ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white'
                }`}
              >
                <RevisionIcon className="h-4 w-4 shrink-0" />
                <span>REVISION</span>
              </button>

              <button
                onClick={() => {
                  onSelectNavTab?.('notes');
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer ${
                  activeNavTab === 'notes'
                    ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white'
                }`}
              >
                <NotesIcon className="h-4 w-4 shrink-0" />
                <span>NOTES</span>
              </button>

              <button
                onClick={() => {
                  onSelectNavTab?.('about');
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer ${
                  activeNavTab === 'about'
                    ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white'
                }`}
              >
                <AboutIcon className="h-4 w-4 shrink-0" />
                <span>ABOUT</span>
              </button>

              <button
                onClick={() => {
                  onOpenShare?.();
                  onCloseMobile();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000000] hover:bg-[#FF5E1E]"
              >
                <Share2 className="h-4 w-4 shrink-0 text-[#FF5E1E]" />
                <span>SHARE WITH FRIENDS</span>
              </button>
            </nav>
          </div>

          {/* Roadmap Topic Continuation */}
          <div className="px-2 py-1 mb-2 text-xs font-black tracking-wider text-black uppercase flex items-center justify-between">
            <span>Roadmap Topics</span>
            <span className="font-mono text-[10px] text-black/60 font-bold">{totalProblemsCount} TOTAL</span>
          </div>

          <nav className="space-y-0.5 font-sans">
            {/* All Problems Item */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onCloseMobile();
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-xs font-black uppercase transition-all duration-100 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-black hover:bg-black/5'
              }`}
            >
              <span>All Problems</span>
              <span className="font-mono">{totalProblemsCount}</span>
            </button>

            <div className="my-2 border-t-2 border-black/20" />

            {/* Topic Categories */}
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onCloseMobile();
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-xs font-bold uppercase transition-all duration-100 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF5E1E] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
                      : 'text-black hover:bg-black/5'
                  }`}
                >
                  <span className="truncate pr-2 text-left">{cat.name}</span>
                  <span className="font-mono text-xs text-black/80">{cat.count}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Quick About Link */}
          <div className="hidden lg:block mt-4 pt-3 border-t-2 border-black/20">
            <button
              onClick={() => {
                if (onSelectNavTab) onSelectNavTab('about');
              }}
              className="flex w-full items-center justify-between border-2 border-black bg-white px-2.5 py-1.5 text-xs font-black uppercase text-black hover:bg-[#FF5E1E] transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
            >
              <span>ABOUT &amp; INFO</span>
              <span className="font-mono text-xs">→</span>
            </button>
          </div>
        </div>

        {/* Bottom Brutalist Motto Card */}
        <div className="mt-6 border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000000]">
          <div className="text-xs font-black uppercase leading-tight tracking-tight text-black">
            Master<br />
            the patterns,<br />
            not just<br />
            the problems.
          </div>
          <div className="mt-2 text-[10px] font-mono font-bold text-black/60 text-right">
            — ARH
          </div>
        </div>
      </aside>
    </>
  );
};
