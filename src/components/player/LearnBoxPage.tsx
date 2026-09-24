import React, { useEffect, useState } from 'react';
import { DSAProblem } from '../../types/dsa';
import { ABDUL_BARI_PROBLEMS } from '../../data/abdulBariData';
import { getYouTubeEmbedUrl, parsePlatformLinks } from '../../utils/urlHelper';
import { DifficultyBadge } from '../table/DifficultyBadge';
import { RevisionButton } from '../table/RevisionButton';
import {
  Play,
  Check,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Sparkles,
  ChefHat,
} from '../common/icons';

interface LearnBoxPageProps {
  problem: DSAProblem;
  isCompleted: boolean;
  isRevision: boolean;
  currentNote: string;
  onToggleCompleted: (id: number) => void;
  onToggleRevision: (id: number) => void;
  onSaveNote: (id: number, note: string) => void;
  onSelectProblem: (problem: DSAProblem) => void;
  onBackToRoadmap: () => void;
}

export const LearnBoxPage: React.FC<LearnBoxPageProps> = ({
  problem,
  isCompleted,
  isRevision,
  currentNote,
  onToggleCompleted,
  onToggleRevision,
  onSaveNote,
  onSelectProblem,
  onBackToRoadmap,
}) => {
  const [noteText, setNoteText] = useState(currentNote);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  useEffect(() => {
    setNoteText(currentNote);
  }, [currentNote, problem.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [problem.id]);

  const embedUrl = getYouTubeEmbedUrl(problem.videoUrl);

  const currentIndex = ABDUL_BARI_PROBLEMS.findIndex((p) => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? ABDUL_BARI_PROBLEMS[currentIndex - 1] : null;
  const nextProblem =
    currentIndex < ABDUL_BARI_PROBLEMS.length - 1 ? ABDUL_BARI_PROBLEMS[currentIndex + 1] : null;

  const leetcodeLinks = parsePlatformLinks(problem.leetcodeUrls, 'leetcode');
  const hackerrankLinks = parsePlatformLinks(problem.hackerrankUrls, 'hackerrank');
  const codechefLinks = parsePlatformLinks(problem.codechefUrls, 'codechef');
  const totalPracticeCount = leetcodeLinks.length + hackerrankLinks.length + codechefLinks.length;

  const handleSaveNote = () => {
    onSaveNote(problem.id, noteText);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-black bg-white p-3.5 sm:p-4 shadow-[3px_3px_0px_#000000]">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToRoadmap}
            className="inline-flex items-center gap-1.5 border-2 border-black bg-[#FF5E1E] px-3.5 py-1.5 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000] hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>BACK TO ROADMAP</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono font-bold text-black/60 pl-2">
            <span>#{problem.id}</span>
            <span>/</span>
            <span className="uppercase">{problem.category}</span>
          </div>
        </div>

        {/* Prev / Next Lecture Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => prevProblem && onSelectProblem(prevProblem)}
            disabled={!prevProblem}
            className={`inline-flex items-center gap-1 border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-colors ${
              prevProblem
                ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer shadow-[2px_2px_0px_#000000]'
                : 'bg-[#E5E5E5] text-black/30 border-black/30 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PREV</span>
          </button>

          <span className="font-mono text-xs font-bold text-black/60 px-1">
            {currentIndex + 1} / {ABDUL_BARI_PROBLEMS.length}
          </span>

          <button
            onClick={() => nextProblem && onSelectProblem(nextProblem)}
            disabled={!nextProblem}
            className={`inline-flex items-center gap-1 border-2 border-black px-3 py-1.5 text-xs font-black uppercase transition-colors ${
              nextProblem
                ? 'bg-white text-black hover:bg-black hover:text-white cursor-pointer shadow-[2px_2px_0px_#000000]'
                : 'bg-[#E5E5E5] text-black/30 border-black/30 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="border-2 border-black bg-white p-4 sm:p-6 shadow-[4px_4px_0px_#000000] text-black">
        {/* Title Header */}
        <div className="border-b-2 border-black pb-5 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="border-2 border-black bg-black text-white px-2 py-0.5 text-xs font-mono font-black">
              LECTURE #{problem.id}
            </span>
            <span className="border border-black bg-[#ECECEC] px-2 py-0.5 text-xs font-mono font-bold uppercase text-black">
              {problem.category}
            </span>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-black leading-tight">
            {problem.cleanTitle || problem.title}
          </h1>
        </div>

        {/* Two-Column Grid: Video Player on Left, Side Action & Practice on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Video Player Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* 16:9 Responsive Video Frame */}
            <div className="relative w-full aspect-video border-2 border-black bg-black shadow-[4px_4px_0px_#000000] overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={problem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
                  <Play className="h-10 w-10 text-[#FF5E1E] mb-2" />
                  <p className="font-mono text-sm">Video embed not available for this link.</p>
                  <a
                    href={problem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 border-2 border-white bg-[#FF5E1E] px-4 py-2 text-xs font-black uppercase text-black shadow-[2px_2px_0px_#FFFFFF] hover:bg-white transition-colors"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Video Sub-Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black bg-[#ECECEC] p-3 shadow-[2px_2px_0px_#000000]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleCompleted(problem.id)}
                  className={`inline-flex items-center gap-1.5 border-2 border-black px-3.5 py-1.5 text-xs font-black uppercase transition-colors cursor-pointer ${
                    isCompleted
                      ? 'bg-[#FF5E1E] text-white shadow-[2px_2px_0px_#000000]'
                      : 'bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0px_#000000]'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>{isCompleted ? 'COMPLETED' : 'MARK COMPLETE'}</span>
                </button>

                <div className="scale-105">
                  <RevisionButton
                    isRevision={isRevision}
                    onToggle={() => onToggleRevision(problem.id)}
                  />
                </div>
              </div>

              <a
                href={problem.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border-2 border-black bg-white hover:bg-black hover:text-white px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Personal Lecture Notes Box */}
            <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0px_#000000] space-y-3">
              <div className="flex items-center justify-between border-b border-black/20 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-black" />
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    LECTURE STUDY NOTES
                  </span>
                </div>
                {isSavedRecently && (
                  <span className="text-[10px] font-mono font-black text-[#00B8A3] uppercase">
                    ✓ Notes Saved!
                  </span>
                )}
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write your key takeaways, time-complexity observations, recursion bases, or edge-case reminders here..."
                rows={4}
                className="w-full border-2 border-black bg-[#FAFAFA] p-3 text-xs font-mono text-black placeholder:text-black/40 focus:bg-white focus:outline-none focus:ring-0 shadow-inner resize-y"
              />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-black/50">
                  Notes are stored safely and synced to your cloud account.
                </span>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="border-2 border-black bg-black text-white hover:bg-[#FF5E1E] hover:text-black px-4 py-1.5 text-xs font-black uppercase transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
                >
                  SAVE NOTE
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Practice Challenges & Quick Jump Curriculum */}
          <div className="lg:col-span-4 space-y-4">
            {/* Practice Problems Section */}
            <div className="border-2 border-black bg-[#FAFAFA] p-4 shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FF5E1E]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-black">
                    PRACTICE DRILLS
                  </h3>
                </div>
                <span className="border border-black bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold">
                  {totalPracticeCount} CHALLENGES
                </span>
              </div>

              {totalPracticeCount === 0 ? (
                <p className="text-xs font-mono text-black/60 italic py-2">
                  No external practice links linked to this foundational theoretical lecture.
                </p>
              ) : (
                <div className="space-y-3">
                  {/* LeetCode Links */}
                  {leetcodeLinks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono font-black text-[#FFA116] uppercase">
                        <span>LeetCode ({leetcodeLinks.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {leetcodeLinks.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between border-2 border-black bg-white p-2 text-xs font-bold text-black hover:bg-[#FFF6E5] transition-colors shadow-[2px_2px_0px_#000000]"
                          >
                            <span className="truncate pr-2">{item.label}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 text-black/60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* HackerRank Links */}
                  {hackerrankLinks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono font-black text-[#00EA64] uppercase">
                        <span>HackerRank ({hackerrankLinks.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {hackerrankLinks.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between border-2 border-black bg-white p-2 text-xs font-bold text-black hover:bg-[#E6F8F5] transition-colors shadow-[2px_2px_0px_#000000]"
                          >
                            <span className="truncate pr-2">{item.label}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 text-black/60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CodeChef Links */}
                  {codechefLinks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono font-black text-[#5B4638] uppercase">
                        <ChefHat className="h-3 w-3" />
                        <span>CodeChef ({codechefLinks.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {codechefLinks.map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between border-2 border-black bg-white p-2 text-xs font-bold text-black hover:bg-[#F3EFEA] transition-colors shadow-[2px_2px_0px_#000000]"
                          >
                            <span className="truncate pr-2">{item.label}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 text-black/60" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Playlist Curriculum Jumper */}
            <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>CURRICULUM LECTURES</span>
                </div>
                <span className="text-[10px] font-mono text-black/60">
                  {ABDUL_BARI_PROBLEMS.length} TOTAL
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1 pr-1 font-sans">
                {ABDUL_BARI_PROBLEMS.map((p) => {
                  const isCurrent = p.id === problem.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectProblem(p)}
                      className={`flex w-full items-center justify-between p-2 text-left text-xs font-bold transition-all cursor-pointer border ${
                        isCurrent
                          ? 'border-2 border-black bg-[#FF5E1E] text-black shadow-[2px_2px_0px_#000000]'
                          : 'border-black/20 bg-white hover:bg-black/5 text-black'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-mono text-[11px] font-black shrink-0">#{p.id}</span>
                        <span className="truncate">{p.cleanTitle || p.title}</span>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono text-black/60 uppercase">
                        {p.difficulty[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
