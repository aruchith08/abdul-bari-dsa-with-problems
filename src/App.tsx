import { useState, useMemo, useRef } from 'react';
import { ABDUL_BARI_PROBLEMS } from './data/abdulBariData';
import { TOPIC_CATEGORIES } from './data/topicCategories';
import { FilterStatus, DSAProblem } from './types/dsa';
import { useDSAProgress } from './hooks/useDSAProgress';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/dashboard/HeroSection';
import { ProgressStats } from './components/dashboard/ProgressStats';
import { FilterBar } from './components/dashboard/FilterBar';
import { ProblemTable } from './components/table/ProblemTable';
import { MobileProblemCard } from './components/mobile/MobileProblemCard';
import { AboutPage } from './components/pages/AboutPage';
import { ProgressPage } from './components/pages/ProgressPage';
import { NoteModal } from './components/modals/NoteModal';
import { ConfirmDialog } from './components/modals/ConfirmDialog';
import { AuthModal } from './components/modals/AuthModal';
import { ShareModal } from './components/modals/ShareModal';
import { EmptyState } from './components/common/EmptyState';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeNavTab, setActiveNavTab] = useState<string>('roadmap');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNoteProblem, setActiveNoteProblem] = useState<DSAProblem | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    completed,
    revisions,
    notes,
    totalCount,
    completedCount,
    remainingCount,
    revisionCount,
    progressPercentage,
    todayCompletedCount: _todayCompletedCount,
    syncStatus,
    cloudError,
    toggleCompleted,
    toggleRevision,
    saveNote,
    resetProgress,
  } = useDSAProgress();

  // Keyboard shortcut listener
  useKeyboardShortcut({
    onSearchFocus: () => {
      searchInputRef.current?.focus();
    },
    onEscape: () => {
      if (searchQuery) setSearchQuery('');
      if (mobileMenuOpen) setMobileMenuOpen(false);
    },
  });

  const handleSelectNavTab = (tab: string) => {
    if (tab === 'share') {
      setIsShareModalOpen(true);
      return;
    }

    if (tab === 'about') {
      setActiveNavTab('about');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (tab === 'progress') {
      setActiveNavTab('progress');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (tab === 'revision') {
      setActiveNavTab('roadmap');
      setCurrentFilter('revision');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (tab === 'notes') {
      setActiveNavTab('notes');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setActiveNavTab('roadmap');
      setCurrentFilter('all');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Category counts based on the whole dataset
  const totalProblemsCount = totalCount;

  // Total problems in selected category
  const problemsInCategory = useMemo(() => {
    if (activeCategory === 'all') return ABDUL_BARI_PROBLEMS;
    return ABDUL_BARI_PROBLEMS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Combined filtered problem list (Category + Status Filter + Difficulty + Search + NavTab)
  const filteredProblems = useMemo(() => {
    let result = problemsInCategory;

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(
        (p) => p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    // Filter by NavTab if 'notes' is selected
    if (activeNavTab === 'notes') {
      result = result.filter((p) => Boolean(notes[p.id] && notes[p.id].trim().length > 0));
    }

    // Filter by completion/revision status
    if (currentFilter === 'pending') {
      result = result.filter((p) => !completed[p.id]);
    } else if (currentFilter === 'completed') {
      result = result.filter((p) => Boolean(completed[p.id]));
    } else if (currentFilter === 'revision') {
      result = result.filter((p) => Boolean(revisions[p.id]));
    }

    // Filter by search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.cleanTitle.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          String(p.id) === q ||
          `#${p.id}` === q
      );
    }

    return result;
  }, [problemsInCategory, selectedDifficulty, activeNavTab, currentFilter, searchQuery, completed, revisions, notes]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setCurrentFilter('all');
    setActiveCategory('all');
    setSelectedDifficulty('all');
    setActiveNavTab('roadmap');
  };

  return (
    <div className="min-h-screen bg-[#ECECEC] text-black flex flex-col font-sans">
      {/* Sticky Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNavTab={activeNavTab}
        onSelectNavTab={handleSelectNavTab}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        searchInputRef={searchInputRef}
        syncStatus={syncStatus}
        cloudError={cloudError}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-start">
        {/* Left Sticky Sidebar (on Desktop) & Slide-out Drawer (on Mobile) */}
        <Sidebar
          categories={TOPIC_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (activeNavTab === 'about' || activeNavTab === 'progress') {
              setActiveNavTab('roadmap');
            }
          }}
          totalProblemsCount={totalProblemsCount}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          activeNavTab={activeNavTab}
          onSelectNavTab={handleSelectNavTab}
          onOpenShare={() => setIsShareModalOpen(true)}
        />

        {/* View Switch: Dedicated About Page, Progress Page, or DSA Roadmap */}
        {activeNavTab === 'about' ? (
          <main className="flex-1 px-3 sm:px-6 py-6 min-w-0 max-w-[1300px]">
            <AboutPage onBackToRoadmap={() => handleSelectNavTab('roadmap')} />
            <Footer />
          </main>
        ) : activeNavTab === 'progress' ? (
          <main className="flex-1 px-3 sm:px-6 py-6 min-w-0 max-w-[1300px]">
            <ProgressPage
              completedMap={completed}
              revisionsMap={revisions}
              notesMap={notes}
              totalCount={totalCount}
              completedCount={completedCount}
              remainingCount={remainingCount}
              revisionCount={revisionCount}
              progressPercentage={progressPercentage}
              onBackToRoadmap={() => handleSelectNavTab('roadmap')}
              onFilterCategory={(catId) => {
                setActiveCategory(catId);
                setActiveNavTab('roadmap');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onFilterStatus={(status) => {
                setCurrentFilter(status);
                setActiveNavTab('roadmap');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onResetClick={() => setIsResetDialogOpen(true)}
            />
            <Footer />
          </main>
        ) : (
          <main className="flex-1 px-3 sm:px-5 lg:px-6 py-4 min-w-0">
            {/* Hero Section */}
            <HeroSection />

            {/* Progress Stats Cards */}
            <ProgressStats
              totalCount={totalCount}
              completedCount={completedCount}
              remainingCount={remainingCount}
              progressPercentage={progressPercentage}
            />

            {/* Filters & Actions Bar */}
            <FilterBar
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              totalCount={totalCount}
              pendingCount={remainingCount}
              completedCount={completedCount}
              revisionCount={revisionCount}
              categories={TOPIC_CATEGORIES}
              selectedCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              onResetClick={() => setIsResetDialogOpen(true)}
            />

            {/* Problems Content */}
            {filteredProblems.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                currentFilter={currentFilter}
                activeCategory={activeCategory}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                {/* Desktop 9-Column Table */}
                <div className="hidden lg:block">
                  <ProblemTable
                    problems={filteredProblems}
                    completedMap={completed}
                    revisionsMap={revisions}
                    notesMap={notes}
                    onToggleCompleted={toggleCompleted}
                    onToggleRevision={toggleRevision}
                    onOpenNote={(problem) => setActiveNoteProblem(problem)}
                  />
                </div>

                {/* Mobile / Tablet Responsive Cards */}
                <div className="space-y-3 lg:hidden">
                  {filteredProblems.map((problem) => (
                    <MobileProblemCard
                      key={problem.id}
                      problem={problem}
                      isCompleted={Boolean(completed[problem.id])}
                      isRevision={Boolean(revisions[problem.id])}
                      hasNote={Boolean(notes[problem.id])}
                      onToggleCompleted={toggleCompleted}
                      onToggleRevision={toggleRevision}
                      onOpenNote={(prob) => setActiveNoteProblem(prob)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Footer */}
            <Footer />
          </main>
        )}
      </div>

      {/* Note Modal */}
      <NoteModal
        problem={activeNoteProblem}
        initialNote={activeNoteProblem ? notes[activeNoteProblem.id] || '' : ''}
        isOpen={Boolean(activeNoteProblem)}
        onClose={() => setActiveNoteProblem(null)}
        onSave={saveNote}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={(keepNotes) => resetProgress(keepNotes)}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal />

      {/* Share Platform Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}

export default App;
