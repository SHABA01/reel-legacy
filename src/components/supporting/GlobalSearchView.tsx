/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { persistenceService, SearchService } from '../../storage';
import { 
  Search, 
  BookOpen, 
  User, 
  History, 
  Image, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FolderHeart,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Bookmark,
  Plus,
  Trash2,
  X,
  Clock,
  Filter
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface SearchResult {
  id: string;
  type: 'profile' | 'story' | 'timeline' | 'people' | 'media' | 'document' | 'career' | 'education' | 'achievement' | 'collection';
  title: string;
  subtitle: string;
  meta: string;
  date: string;
  status?: string;
}

const SEARCH_RESULTS: SearchResult[] = [
  // Profiles
  { id: 'res-1', type: 'profile', title: 'Elizabeth Vance', subtitle: 'Matriarch & Primary Chronicler of Vance Clan', meta: 'Born 1932 • Kansas • 42 Linked Memoirs', date: 'Restored July 12, 2026', status: 'Published' },
  { id: 'res-2', type: 'profile', title: 'Arthur Pendelton', subtitle: 'Distinguished Veteran of the Pacific Fleet', meta: 'Born 1921 • California • 18 Timeline Events', date: 'Restored July 10, 2026', status: 'Drafting' },
  // Stories
  { id: 'res-3', type: 'story', title: 'The Silver Lining of 1972', subtitle: 'Epic Biographical Memoir', meta: '8 completed chapters • compiled vocal track', date: 'Created 2 days ago', status: 'Ready' },
  { id: 'res-4', type: 'story', title: 'Kansas Prairies and Grain Elevators', subtitle: 'Industrial Homestead Documentary', meta: '4 audio tracks • 18 vintage raw photos', date: 'Created 5 days ago', status: 'Rendering' },
  // Timeline Events
  { id: 'res-5', type: 'timeline', title: 'Wedding Day at Saint Mary Cathedral', subtitle: 'Legacy Chronicle Milestone Event', meta: 'Elizabeth & Arthur Vance • June 14, 1954', date: 'June 14, 1954' },
  { id: 'res-6', type: 'timeline', title: 'Graduation from Kansas State University', subtitle: 'Academic Legacy Event', meta: 'Bachelor of Science in Agronomy • June 1952', date: 'June 01, 1952' },
  // People
  { id: 'res-7', type: 'people', title: 'Grandma Robert Senior', subtitle: 'Co-Author & Great Uncle', meta: 'Primary source of historical vocal tapes', date: 'Joined July 2026' },
  { id: 'res-8', type: 'people', title: 'Philip Shaba', subtitle: 'Lead Archivist', meta: 'Primary administrator of memory nodes', date: 'Active now' },
  // Media & Documents
  { id: 'res-9', type: 'media', title: 'wedding_portrait_vintage_1954.png', subtitle: 'Photo Shelf - Restored High-Res', meta: '3200x2400 PNG • Colorized and De-scratched', date: 'Uploaded yesterday' },
  { id: 'res-10', type: 'document', title: 'Military Deployment Orders Navy 1944.pdf', subtitle: 'Official Document scan', meta: 'Declassified Certificate scan • 3 pages', date: 'Uploaded July 04, 2026' },
  // Career, Education & Achievements
  { id: 'res-11', type: 'career', title: 'Chief Agronomist at Heartland Grain Corp', subtitle: 'Professional Career History Record', meta: '1962 - 1994 • Led grain silo automation project', date: 'Restored July 01, 2026' },
  { id: 'res-12', type: 'education', title: 'Master of Soil Sciences, Iowa State University', subtitle: 'Postgraduate Education Record', meta: '1954 - 1956 • Thesis on prairie erosion control', date: 'Restored June 28, 2026' },
  { id: 'res-13', type: 'achievement', title: 'Heartland Pioneer Medal of Honor', subtitle: 'Civic Achievement Award', meta: 'Awarded for 35 years of voluntary farming assistance', date: 'Restored July 02, 2026' },
  // Collections
  { id: 'res-14', type: 'collection', title: 'Vance Family Farmstead Archives', subtitle: 'Memory Collection Album', meta: 'Contains 42 photos, 12 documents, 3 audio transcripts', date: 'Created 2 weeks ago' }
];

export function GlobalSearchView() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Interactive filters panel expanded on tablet/mobile
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Saved / Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Vance Farmhouse 1952',
    'Military deployment papers',
    'Elizabeth Vance memoirs',
  ]);
  const [savedSearches, setSavedSearches] = useState<string[]>([
    'Kansas Grain Silos 1972',
    'High-Res Colorized portraits',
  ]);

  // Categories definition
  const categories = [
    { id: 'all', label: 'All Results', icon: Search },
    { id: 'profile', label: 'Legacy Profiles', icon: User },
    { id: 'story', label: 'Stories', icon: BookOpen },
    { id: 'timeline', label: 'Timeline Events', icon: History },
    { id: 'people', label: 'People', icon: User },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'document', label: 'Documents', icon: FileText },
    { id: 'career', label: 'Career Records', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'achievement', label: 'Achievements', icon: Award },
    { id: 'collection', label: 'Collections', icon: FolderHeart }
  ];

  const typeMeta: Record<string, { label: string; icon: React.ComponentType<any>; color: string; bg: string }> = {
    profile: { label: 'Legacy Profile', icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    story: { label: 'Story Memoir', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    timeline: { label: 'Timeline Event', icon: History, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    people: { label: 'Person', icon: User, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    media: { label: 'Media File', icon: Image, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/20' },
    document: { label: 'Document PDF', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
    career: { label: 'Career History', icon: Briefcase, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/20' },
    education: { label: 'Education', icon: GraduationCap, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/20' },
    achievement: { label: 'Achievement', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
    collection: { label: 'Album Collection', icon: FolderHeart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/20' },
  };

  // Dynamic async search effect
  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        let rawResults;
        const cleanQuery = query.toLowerCase().trim();
        if (!cleanQuery) {
          // Retrieve all records to display comprehensive initial archives
          const [profiles, stories, timeline, media, documents, imports] = await Promise.all([
            persistenceService.profiles.getAll(),
            persistenceService.stories.getAll(),
            persistenceService.timeline.getAll(),
            persistenceService.media.getAll(),
            persistenceService.documents.getAll(),
            persistenceService.imports.getAll()
          ]);
          rawResults = { profiles, stories, timeline, media, documents, imports };
        } else {
          rawResults = await SearchService.searchAll(query);
        }

        if (!active) return;

        const mapped: SearchResult[] = [];

        // 1. Profiles
        rawResults.profiles.forEach((p: any) => {
          mapped.push({
            id: p.id,
            type: 'profile',
            title: `${p.firstName} ${p.lastName}`,
            subtitle: p.preferredName || p.nickname || p.relationship || 'Legacy Profile',
            meta: `Born ${p.dateOfBirth || 'Unknown'} • Category: ${p.category || 'personal'}`,
            date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Restored',
            status: p.status === 'published' ? 'Published' : p.status === 'draft' ? 'Draft' : 'Archived'
          });
        });

        // 2. Stories
        rawResults.stories.forEach((s: any) => {
          mapped.push({
            id: s.id,
            type: 'story',
            title: s.title,
            subtitle: s.subtitle || s.description || 'Memoir Story',
            meta: `${s.chapterCount || 0} Chapters • Completion: ${s.completionProgress || 0}%`,
            date: s.lastEdited ? new Date(s.lastEdited).toLocaleDateString() : 'Edited',
            status: s.status || 'Draft'
          });
        });

        // 3. Timeline Events
        rawResults.timeline.forEach((t: any) => {
          mapped.push({
            id: t.id,
            type: 'timeline',
            title: t.title,
            subtitle: t.description || 'Milestone timeline event',
            meta: `Year: ${t.year} • Location: ${t.location || 'Unknown'}`,
            date: t.year || 'Milestone'
          });
        });

        // 4. Media
        rawResults.media.forEach((m: any) => {
          mapped.push({
            id: m.id,
            type: 'media',
            title: m.name,
            subtitle: m.description || 'Uploaded Media Asset',
            meta: `Type: ${m.type.toUpperCase()} • Size: ${m.size || 'Unknown'}`,
            date: m.uploadDate ? new Date(m.uploadDate).toLocaleDateString() : 'Uploaded',
            status: m.status || 'Ready'
          });
        });

        // 5. Documents
        rawResults.documents.forEach((d: any) => {
          mapped.push({
            id: d.id,
            type: 'document',
            title: d.displayName || d.originalFilename,
            subtitle: d.description || 'Official Archive Document',
            meta: `Type: ${d.documentType || 'PDF'} • Size: ${d.fileSize || 'Unknown'}`,
            date: d.uploadDate ? new Date(d.uploadDate).toLocaleDateString() : 'Uploaded'
          });
        });

        // 6. Biographical Imports
        rawResults.imports.forEach((imp: any) => {
          const typeMap: Record<string, string> = {
            'Resume / CV': 'career',
            'Biography': 'profile',
            'Obituary': 'profile',
            'Academic': 'education',
            'Award': 'achievement'
          };
          const resolvedType = typeMap[imp.importType] || 'document';
          mapped.push({
            id: imp.id,
            type: resolvedType as any,
            title: imp.displayName || imp.originalFilename,
            subtitle: imp.description || `Imported ${imp.importType}`,
            meta: `Status: ${imp.importStatus || 'Processed'} • Size: ${imp.fileSize || 'Unknown'}`,
            date: imp.uploadDate ? new Date(imp.uploadDate).toLocaleDateString() : 'Imported'
          });
        });

        // If database is completely brand new and empty, merge with mock items to keep search rich
        if (mapped.length === 0) {
          setAllResults(SEARCH_RESULTS);
        } else {
          setAllResults(mapped);
        }
      } catch (err) {
        console.warn('Error loading real search results, falling back to archive presets:', err);
        setAllResults(SEARCH_RESULTS);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      active = false;
    };
  }, [query]);

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let results = allResults.filter((item) => {
      // Type Filter
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      
      // Status Filter
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;

      return true;
    });

    // Custom sorting algorithms
    if (sortBy === 'date-desc') {
      results = [...results].sort((a, b) => {
        const timeA = a.date.includes('yesterday') || a.date.includes('ago') ? Date.now() : new Date(a.date).getTime() || 0;
        const timeB = b.date.includes('yesterday') || b.date.includes('ago') ? Date.now() : new Date(b.date).getTime() || 0;
        return timeB - timeA;
      });
    } else if (sortBy === 'date-asc') {
      results = [...results].sort((a, b) => {
        const timeA = a.date.includes('yesterday') || a.date.includes('ago') ? Date.now() : new Date(a.date).getTime() || 0;
        const timeB = b.date.includes('yesterday') || b.date.includes('ago') ? Date.now() : new Date(b.date).getTime() || 0;
        return timeA - timeB;
      });
    }

    return results;
  }, [allResults, selectedType, filterStatus, sortBy]);

  const handleSaveSearch = () => {
    if (query.trim() === '') return;
    if (savedSearches.includes(query)) {
      showToast('info', 'Search query already saved');
      return;
    }
    setSavedSearches((prev) => [...prev, query]);
    showToast('success', 'Search parameters bookmarked successfully!');
  };

  const handleRemoveSaved = (search: string) => {
    setSavedSearches((prev) => prev.filter((s) => s !== search));
    showToast('info', 'Bookmarked search removed');
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    showToast('info', 'Recent search histories cleared');
  };

  const triggerSearch = (searchVal: string) => {
    setQuery(searchVal);
    if (searchVal.trim() !== '' && !recentSearches.includes(searchVal)) {
      setRecentSearches((prev) => [searchVal, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div id="global-search-view" className="space-y-6 animate-fade-in text-foreground pb-12">
      {/* Top Title Bar */}
      <div id="search-title-card" className="border-b border-border pb-5">
        <p className="text-sm text-muted-foreground">
          Deep query and explore memoirs, timeline points, declassified certificates, and family album assets.
        </p>
      </div>

      {/* Main Search Command Box */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4" id="search-command-card">
        <div className="relative" id="main-search-input-wrapper">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5 text-muted-foreground" />
          <input
            id="global-search-primary-input"
            type="text"
            placeholder="Search declassified order documents, family events, careers, degrees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                triggerSearch(query);
              }
            }}
            className="w-full text-sm md:text-base pl-12 pr-24 py-3.5 bg-muted/40 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-cinema-amber-500 transition-colors"
          />
          {query.trim() !== '' && (
            <button
              id="clear-search-query-btn"
              onClick={() => setQuery('')}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
          <button
            id="bookmark-search-query-btn"
            disabled={query.trim() === ''}
            onClick={handleSaveSearch}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors cursor-pointer ${
              query.trim() === '' ? 'text-muted-foreground/35 cursor-not-allowed' : 'text-cinema-amber-500 hover:bg-cinema-amber-500/10'
            }`}
            title="Bookmark search filter"
          >
            <Bookmark className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {query.length === 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs" id="search-suggestions-strip">
            <span className="text-muted-foreground font-semibold">Suggested Searches:</span>
            {['Kansas Wedding 1954', 'Military Fleet Orders', 'Soil Erosion Thesis', 'Colorized Farmhouse'].map((tag) => (
              <button
                key={tag}
                id={`btn-tag-${tag}`}
                onClick={() => triggerSearch(tag)}
                className="bg-muted hover:bg-muted/80 text-foreground/80 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Categories Sidebar + Main Results list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" id="search-layout-grid">
        {/* Left Filter Options Sidebar */}
        <div className="space-y-6 lg:col-span-1" id="search-filter-sidebar">
          {/* Categories card */}
          <div className="border border-border p-5 rounded-2xl bg-card space-y-4" id="categories-filter-card">
            <div className="flex items-center justify-between pb-2 border-b border-border" id="cat-card-header">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cinema-amber-500" /> Search Categories
              </span>
              {selectedType !== 'all' && (
                <button
                  id="reset-search-type-btn"
                  onClick={() => setSelectedType('all')}
                  className="text-[10px] text-cinema-amber-500 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1" id="search-categories-pill-list">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const count = cat.id === 'all' 
                  ? allResults.length 
                  : allResults.filter((r) => r.type === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    id={`search-cat-${cat.id}`}
                    onClick={() => setSelectedType(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                      selectedType === cat.id
                        ? 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 font-semibold'
                        : 'border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent & Saved searches card */}
          <div className="border border-border p-5 rounded-2xl bg-card space-y-5" id="history-saved-search-card">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2" id="recent-search-inner">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/40">
                  <span className="font-bold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Recent Queries
                  </span>
                  <button
                    id="clear-recent-history-btn"
                    onClick={handleClearRecent}
                    className="text-[10px] text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-1" id="recent-search-history-list">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      id={`recent-query-item-${search}`}
                      onClick={() => triggerSearch(search)}
                      className="w-full text-left text-xs text-foreground/80 py-1.5 px-2 rounded-lg hover:bg-muted/50 truncate cursor-pointer block font-medium"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Searches */}
            <div className="space-y-2" id="saved-search-inner">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border/40">
                <span className="font-bold text-muted-foreground flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-cinema-amber-500" /> Saved Searches
                </span>
              </div>
              {savedSearches.length === 0 ? (
                <p className="text-[11px] text-muted-foreground py-2 pl-1 italic">No bookmarked filters</p>
              ) : (
                <div className="space-y-1" id="saved-searches-list">
                  {savedSearches.map((search) => (
                    <div key={search} id={`saved-search-${search}`} className="flex items-center justify-between gap-1 group">
                      <button
                        id={`saved-query-btn-${search}`}
                        onClick={() => triggerSearch(search)}
                        className="text-left text-xs text-foreground/80 py-1.5 px-2 rounded-lg hover:bg-muted/50 truncate cursor-pointer block font-medium flex-1"
                      >
                        {search}
                      </button>
                      <button
                        id={`delete-saved-query-${search}`}
                        onClick={() => handleRemoveSaved(search)}
                        className="p-1 rounded-md text-muted-foreground hover:text-rose-500 cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content View: Results Feed */}
        <div className="lg:col-span-3 space-y-4" id="search-main-view">
          {/* Results Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border border-border bg-card rounded-2xl" id="results-feed-toolbar">
            <span className="text-xs font-semibold text-muted-foreground" id="found-records-badge">
              Found {filteredResults.length} Matching Records inside the ReelLegacy Engine
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto" id="results-feed-sort">
              <span className="text-xs text-muted-foreground font-medium shrink-0">Sort:</span>
              <select
                id="search-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-muted/40 border border-border p-1.5 rounded-lg text-foreground outline-none focus:border-cinema-amber-500 w-full sm:w-auto font-semibold"
              >
                <option value="relevance">Highly Relevant First</option>
                <option value="date-desc">Newest Restorations</option>
                <option value="date-asc">Chronological Order</option>
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3" id="search-results-list">
            {filteredResults.length === 0 ? (
              <EmptyState
                type="search"
                title="No archive matches"
                description="Adjust your search syntax or look up another date category. High-resolution restorations might be currently compiling."
                primaryActionLabel="Clear Search Filter"
                onPrimaryAction={() => {
                  setQuery('');
                  setSelectedType('all');
                  setFilterStatus('all');
                }}
              />
            ) : (
              filteredResults.map((result) => {
                const meta = typeMeta[result.type] || typeMeta.document;
                const ResultIcon = meta.icon;

                return (
                  <div
                    key={result.id}
                    id={`result-card-${result.id}`}
                    className="p-4 rounded-2xl border border-border/70 hover:border-border hover:shadow-xs transition-all bg-card/40 flex items-start gap-4 group"
                  >
                    {/* Visual Type Indicator */}
                    <div
                      id={`result-icon-box-${result.id}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-border ${meta.bg}`}
                    >
                      <ResultIcon className={`w-5 h-5 ${meta.color}`} />
                    </div>

                    {/* Middle Info Block */}
                    <div className="flex-1 min-w-0" id={`result-info-${result.id}`}>
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${meta.bg} ${meta.color}`}>
                          {meta.label}
                        </span>
                        {result.status && (
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                            result.status === 'Ready' || result.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20'
                          }`}>
                            {result.status}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                          {result.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-0.5">
                        {result.title}
                      </h3>
                      <p className="text-xs text-foreground/80">
                        {result.subtitle}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-2 font-medium">
                        {result.meta}
                      </p>
                    </div>

                    {/* Navigation Trigger Button */}
                    <button
                      id={`navigate-result-btn-${result.id}`}
                      onClick={() => {
                        showToast('success', `Navigating to active record: ${result.title}`);
                      }}
                      className="p-1.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-cinema-amber-500 transition-colors shrink-0 self-center opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm"
                      title="Navigate to Record"
                    >
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Search Helper banner at bottom */}
          <div className="bg-gradient-to-r from-cinema-ai/10 via-indigo-500/5 to-transparent p-5 border border-cinema-ai/20 rounded-2xl flex items-center justify-between gap-4" id="ai-deep-search-card">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cinema-ai flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 animate-pulse" /> Advanced Semantic search
              </h4>
              <p className="text-xs text-muted-foreground max-w-lg">
                Type in natural language questions like "Show me grandpa's farm photos in high contrast mode" to trigger AI-directed cross-profile queries.
              </p>
            </div>
            <Button
              id="ai-search-learn-more-btn"
              variant="accent"
              size="sm"
              onClick={() => {
                showToast('info', 'Activating AI Search tutorial', 'Opening help guides for semantic memory indices.');
              }}
            >
              Learn Syntax
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
