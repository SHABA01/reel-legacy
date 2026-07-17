/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  Check, 
  Trash2, 
  Archive, 
  BookOpen, 
  User, 
  Clock, 
  Sparkles, 
  Film, 
  ShieldAlert, 
  Eye, 
  RefreshCw, 
  SlidersHorizontal,
  ChevronDown,
  Filter,
  CheckSquare,
  Square,
  Info
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export interface NotificationItem {
  id: string;
  category: 'stories' | 'ai' | 'production' | 'profiles' | 'media' | 'system' | 'security' | 'account';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
  unread: boolean;
  relatedStory?: string;
  relatedProfile?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-p1',
    category: 'production',
    priority: 'high',
    title: 'Cinematic Render Success',
    description: 'The documentary "The Legacy of Elizabeth Vance (1932-2024)" compiled successfully in Full HD.',
    time: '10:14 AM',
    dateGroup: 'Today',
    unread: true,
    relatedStory: 'The Legacy of Elizabeth Vance',
    relatedProfile: 'Elizabeth Vance',
  },
  {
    id: 'notif-p2',
    category: 'ai',
    priority: 'medium',
    title: 'AI Script Draft Complete',
    description: 'AI Director generated Scene 2 ("The Farmhouse Era") script outline using raw audio transcripts.',
    time: '08:30 AM',
    dateGroup: 'Today',
    unread: true,
    relatedStory: 'Memoirs of Kansas Prairie',
    relatedProfile: 'Robert Vance Senior',
  },
  {
    id: 'notif-p3',
    category: 'stories',
    priority: 'low',
    title: 'Story Scene Updated',
    description: 'Co-Author Philip Shaba appended 3 historical letters and 2 photographs to Scene 4.',
    time: 'Yesterday, 04:15 PM',
    dateGroup: 'Yesterday',
    unread: false,
    relatedStory: 'The Silver Lining of 1972',
  },
  {
    id: 'notif-p4',
    category: 'security',
    priority: 'high',
    title: 'New Device Logged In',
    description: 'A new session was authenticated from Chrome on macOS (IP: 192.168.1.104).',
    time: 'Yesterday, 11:02 AM',
    dateGroup: 'Yesterday',
    unread: true,
  },
  {
    id: 'notif-p5',
    category: 'media',
    priority: 'medium',
    title: 'High-Resolution Restoration Completed',
    description: 'Vintage photograph "Grandpa Vance Farmhouse 1952" was automatically colorized and restored.',
    time: 'July 10, 02:45 PM',
    dateGroup: 'Earlier',
    unread: false,
    relatedProfile: 'Elizabeth Vance',
  },
  {
    id: 'notif-p6',
    category: 'system',
    priority: 'low',
    title: 'Cloud Integration Synced',
    description: 'Your mapped Google Drive archive synchronized 12 new legacy document scans successfully.',
    time: 'July 08, 09:12 AM',
    dateGroup: 'Earlier',
    unread: false,
  },
  {
    id: 'notif-p7',
    category: 'profiles',
    priority: 'medium',
    title: 'Legacy Biography Completed',
    description: 'Chronology verification successful. Fully ready for AI Script drafting sequences.',
    time: 'July 05, 11:30 AM',
    dateGroup: 'Earlier',
    unread: false,
    relatedProfile: 'Arthur Pendelton',
  },
  {
    id: 'notif-p8',
    category: 'account',
    priority: 'low',
    title: 'Subscription Plan Renewed',
    description: 'Your ReelLegacy Pro membership has successfully renewed for the month of July.',
    time: 'July 01, 12:00 AM',
    dateGroup: 'Earlier',
    unread: false,
  }
];

export function NotificationsView() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePriority, setActivePriority] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [viewingDetail, setViewingDetail] = useState<NotificationItem | null>(null);

  // Pagination / Infinite Scroll states
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'stories', label: 'Stories' },
    { id: 'ai', label: 'AI Activities' },
    { id: 'production', label: 'Production' },
    { id: 'profiles', label: 'Profiles' },
    { id: 'media', label: 'Media' },
    { id: 'system', label: 'System' },
    { id: 'security', label: 'Security' },
    { id: 'account', label: 'Account' },
  ];

  // Icons configuration
  const categoryMeta: Record<string, { icon: React.ComponentType<any>; color: string; bg: string }> = {
    stories: { icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    ai: { icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    production: { icon: Film, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
    profiles: { icon: User, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    media: { icon: SlidersHorizontal, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/20' },
    system: { icon: Info, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/40' },
    security: { icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
    account: { icon: Clock, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/20' },
  };

  // Filter logic
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Category filter
      if (activeCategory !== 'all' && notif.category !== activeCategory) return false;
      // Priority filter
      if (activePriority !== 'all' && notif.priority !== activePriority) return false;
      // Status filter
      if (statusFilter === 'unread' && !notif.unread) return false;
      if (statusFilter === 'read' && notif.unread) return false;
      // Search search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          notif.title.toLowerCase().includes(query) ||
          notif.description.toLowerCase().includes(query) ||
          (notif.relatedStory && notif.relatedStory.toLowerCase().includes(query)) ||
          (notif.relatedProfile && notif.relatedProfile.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [notifications, activeCategory, activePriority, statusFilter, searchQuery]);

  // Group notifications by dateGroup
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {
      'Today': [],
      'Yesterday': [],
      'Earlier': []
    };
    filteredNotifications.forEach((notif) => {
      if (groups[notif.dateGroup]) {
        groups[notif.dateGroup].push(notif);
      } else {
        groups['Earlier'].push(notif);
      }
    });
    return groups;
  }, [filteredNotifications]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick actions
  const handleMarkAsRead = (id: string, state: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: state } : n))
    );
    showToast('success', `Notification marked as ${state ? 'unread' : 'read'}`);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast('info', 'Notification deleted');
  };

  const handleArchive = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast('success', 'Notification archived safely');
  };

  // Bulk actions
  const handleBulkMarkRead = () => {
    if (selectedIds.length === 0) return;
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.includes(n.id) ? { ...n, unread: false } : n))
    );
    setSelectedIds([]);
    showToast('success', 'Selected notifications marked as read');
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return;
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    showToast('success', 'Selected notifications archived');
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
    showToast('info', 'Selected notifications deleted');
  };

  return (
    <div id="notifications-view" className="space-y-6 animate-fade-in text-foreground pb-12">
      {/* Page Title Header */}
      <div id="notifications-title-card" className="border-b border-border pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mt-1">
            Review synthesis milestones, rendering queue updates, and co-author workflow triggers.
          </p>
        </div>
        <div className="flex items-center gap-2" id="notif-actions-top">
          <Button
            id="btn-mark-all-read"
            variant="secondary"
            size="sm"
            onClick={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
              showToast('success', 'All notifications marked as read');
            }}
          >
            <Check className="w-4 h-4 mr-1.5" /> Mark All Read
          </Button>
          <Button
            id="btn-refresh-notifications"
            variant="ghost"
            size="sm"
            onClick={() => {
              showToast('loading', 'Refreshing feed...');
              setTimeout(() => {
                showToast('success', 'Notification feed synchronized');
              }, 600);
            }}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid Layout: Sidebar filters + Main list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" id="notifications-grid">
        {/* Left Filters Rail */}
        <div className="space-y-4 lg:col-span-1 border border-border p-5 rounded-2xl bg-card" id="notif-filters-rail">
          <div className="flex items-center justify-between pb-2 border-b border-border" id="filters-rail-header">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-cinema-amber-500" /> Filters & Categories
            </span>
            {(activeCategory !== 'all' || activePriority !== 'all' || statusFilter !== 'all') && (
              <button
                id="btn-clear-rail-filters"
                onClick={() => {
                  setActiveCategory('all');
                  setActivePriority('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-[10px] text-cinema-amber-500 hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Read / Unread tab */}
          <div className="space-y-2" id="filter-group-status">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
            <div className="grid grid-cols-3 gap-1 bg-muted/40 p-1 rounded-lg text-xs" id="status-filter-tabs">
              <button
                id="tab-status-all"
                onClick={() => setStatusFilter('all')}
                className={`py-1.5 rounded-md font-semibold text-center transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                All
              </button>
              <button
                id="tab-status-unread"
                onClick={() => setStatusFilter('unread')}
                className={`py-1.5 rounded-md font-semibold text-center transition-all cursor-pointer relative ${statusFilter === 'unread' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Unread
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-cinema-amber-500 rounded-full" />
                )}
              </button>
              <button
                id="tab-status-read"
                onClick={() => setStatusFilter('read')}
                className={`py-1.5 rounded-md font-semibold text-center transition-all cursor-pointer ${statusFilter === 'read' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Read
              </button>
            </div>
          </div>

          {/* Priority filter */}
          <div className="space-y-2" id="filter-group-priority">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Priority Level</label>
            <select
              id="priority-select-filter"
              value={activePriority}
              onChange={(e) => setActivePriority(e.target.value)}
              className="w-full text-xs bg-muted/30 border border-border p-2 rounded-xl text-foreground outline-none focus:border-cinema-amber-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Categories List */}
          <div className="space-y-1" id="filter-group-categories">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Category Channel</label>
            <div className="space-y-1 max-h-64 overflow-y-auto" id="categories-list-rail">
              {categories.map((cat) => {
                const count = cat.id === 'all' 
                  ? notifications.length 
                  : notifications.filter((n) => n.category === cat.id).length;
                
                return (
                  <button
                    key={cat.id}
                    id={`cat-btn-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-cinema-amber-500/10 text-cinema-amber-500 border border-cinema-amber-500/20 font-semibold'
                        : 'border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-[10px] opacity-70 font-mono bg-muted px-1.5 py-0.5 rounded-md">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right main notification lists */}
        <div className="lg:col-span-3 space-y-4" id="notif-main-area">
          {/* List Toolbar (Search + Bulk Actions) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border border-border bg-card rounded-2xl" id="notif-toolbar">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md" id="notif-search-box">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="notif-feed-search-input"
                type="text"
                placeholder="Search updates, bio tracks or files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 bg-muted/40 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-cinema-amber-500"
              />
            </div>

            {/* Bulk actions triggers */}
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-border" id="bulk-actions-strip">
                <span className="text-xs font-semibold text-cinema-amber-500">
                  {selectedIds.length} Selected
                </span>
                <div className="flex gap-2">
                  <Button
                    id="bulk-btn-read"
                    variant="ghost"
                    size="xs"
                    onClick={handleBulkMarkRead}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Read
                  </Button>
                  <Button
                    id="bulk-btn-archive"
                    variant="ghost"
                    size="xs"
                    onClick={handleBulkArchive}
                  >
                    <Archive className="w-3.5 h-3.5 mr-1 text-sky-500" /> Archive
                  </Button>
                  <Button
                    id="bulk-btn-delete"
                    variant="ghost"
                    size="xs"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-500" /> Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-muted-foreground font-semibold" id="selection-checkbox-all">
                <button
                  id="btn-toggle-select-all"
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 hover:text-foreground cursor-pointer"
                >
                  {selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  Select All visible
                </button>
              </div>
            )}
          </div>

          {/* Feed Grid cards grouped by DateGroup */}
          <div className="space-y-6" id="notifications-feed-list">
            {filteredNotifications.length === 0 ? (
              <EmptyState
                type="notifications"
                title="No matching alerts"
                description="Adjust your filters or query keywords to inspect other chronological history blocks inside this co-author workspace."
                primaryActionLabel="Clear Filters"
                onPrimaryAction={() => {
                  setActiveCategory('all');
                  setActivePriority('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
              />
            ) : (
              (Object.keys(groupedNotifications) as Array<'Today' | 'Yesterday' | 'Earlier'>).map((group) => {
                const list = groupedNotifications[group];
                if (!list || list.length === 0) return null;

                return (
                  <div key={group} id={`group-box-${group}`} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 pl-1">
                      {group}
                    </h3>
                    <div className="space-y-3" id={`group-list-${group}`}>
                      {list.map((notif) => {
                        const meta = categoryMeta[notif.category] || categoryMeta.system;
                        const CategoryIcon = meta.icon;
                        const isSelected = selectedIds.includes(notif.id);

                        return (
                          <div
                            key={notif.id}
                            id={`card-notif-${notif.id}`}
                            className={`p-4 rounded-2xl border transition-all duration-200 flex gap-4 bg-card/60 relative ${
                              notif.unread
                                ? 'border-cinema-amber-500/20 shadow-xs shadow-cinema-amber-500/5'
                                : 'border-border/60 hover:border-border'
                            } ${isSelected ? 'border-cinema-amber-500 bg-cinema-amber-500/[0.02]' : ''}`}
                          >
                            {/* Checkbox selector */}
                            <button
                              id={`select-notif-${notif.id}`}
                              onClick={() => toggleSelectOne(notif.id)}
                              className="self-start mt-1 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-cinema-amber-500" />
                              ) : (
                                <Square className="w-4 h-4 text-muted-foreground/50 hover:text-muted-foreground" />
                              )}
                            </button>

                            {/* Category channel icon */}
                            <div
                              id={`avatar-notif-${notif.id}`}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border ${meta.bg}`}
                            >
                              <CategoryIcon className={`w-4.5 h-4.5 ${meta.color}`} />
                            </div>

                            {/* Center contents */}
                            <div className="flex-1 min-w-0" id={`info-notif-${notif.id}`}>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className={`text-sm leading-snug text-foreground ${notif.unread ? 'font-bold' : 'font-semibold'}`}>
                                  {notif.title}
                                </h4>
                                {notif.priority === 'high' && (
                                  <span className="text-[9px] uppercase tracking-wider font-bold bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full border border-rose-500/20">
                                    High Alert
                                  </span>
                                )}
                                <span className="text-[10px] text-muted-foreground font-mono ml-auto">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {notif.description}
                              </p>

                              {/* Badges for related models */}
                              {(notif.relatedStory || notif.relatedProfile) && (
                                <div className="flex flex-wrap gap-2 mt-2.5" id={`badge-row-notif-${notif.id}`}>
                                  {notif.relatedStory && (
                                    <span className="inline-flex items-center text-[10px] font-semibold text-cinema-amber-600 bg-cinema-amber-500/10 px-2 py-0.5 rounded-md border border-cinema-amber-500/20">
                                      <BookOpen className="w-3 h-3 mr-1" /> {notif.relatedStory}
                                    </span>
                                  )}
                                  {notif.relatedProfile && (
                                    <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                      <User className="w-3 h-3 mr-1" /> {notif.relatedProfile}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Interactive Actions footer bar */}
                              <div className="flex items-center gap-3.5 mt-3 border-t border-border/30 pt-2 text-[11px] font-bold text-muted-foreground" id={`footer-actions-notif-${notif.id}`}>
                                <button
                                  id={`btn-toggle-unread-${notif.id}`}
                                  onClick={() => handleMarkAsRead(notif.id, !notif.unread)}
                                  className="hover:text-foreground cursor-pointer flex items-center gap-1"
                                >
                                  {notif.unread ? <Check className="w-3 h-3 text-emerald-500" /> : null}
                                  {notif.unread ? 'Mark as Read' : 'Mark as Unread'}
                                </button>
                                <span>•</span>
                                <button
                                  id={`btn-archive-${notif.id}`}
                                  onClick={() => handleArchive(notif.id)}
                                  className="hover:text-sky-500 cursor-pointer flex items-center gap-1"
                                >
                                  <Archive className="w-3 h-3" /> Archive
                                </button>
                                <span>•</span>
                                <button
                                  id={`btn-delete-${notif.id}`}
                                  onClick={() => handleDelete(notif.id)}
                                  className="hover:text-rose-500 cursor-pointer flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                                <span>•</span>
                                <button
                                  id={`btn-details-${notif.id}`}
                                  onClick={() => setViewingDetail(notif)}
                                  className="hover:text-cinema-amber-500 cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" /> Details
                                </button>
                              </div>
                            </div>

                            {/* Unread dot indicator on card margin */}
                            {notif.unread && (
                              <span className="absolute top-4 right-4 w-2 h-2 bg-cinema-amber-500 rounded-full animate-pulse" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Infinite Scroll / Pagination Placeholder */}
          <div className="border-t border-border pt-4 flex items-center justify-between text-xs text-muted-foreground" id="notif-pagination-bar">
            <span>Showing {filteredNotifications.length} of {notifications.length} records</span>
            <div className="flex gap-2">
              <Button
                id="btn-prev-page-notif"
                variant="ghost"
                size="xs"
                disabled
              >
                Previous
              </Button>
              <Button
                id="btn-next-page-notif"
                variant="ghost"
                size="xs"
                onClick={() => {
                  showToast('info', 'Additional compilation history loads...', 'Retrieving archives from cloud cold logs.');
                }}
              >
                Load More Chronicles
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {viewingDetail && (
        <div id="modal-notif-detail-container" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setViewingDetail(null)} />
          <div className="bg-card border border-border p-6 rounded-2xl max-w-md w-full relative z-10 space-y-4 shadow-2xl text-foreground">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${viewingDetail.priority === 'high' ? 'bg-red-500' : viewingDetail.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                  {viewingDetail.category} channel
                </span>
              </div>
              <button
                id="btn-close-notif-modal"
                className="text-xs text-muted-foreground hover:text-foreground font-semibold"
                onClick={() => setViewingDetail(null)}
              >
                Close (ESC)
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-foreground">
                {viewingDetail.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                Received: {viewingDetail.time}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
                {viewingDetail.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Context Metadata</span>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/10 p-2.5 rounded-xl">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-muted-foreground/50">Related Profile</span>
                  <span className="font-semibold text-foreground truncate block">{viewingDetail.relatedProfile || 'Global Domain'}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-muted-foreground/50">Active Memoir</span>
                  <span className="font-semibold text-foreground truncate block">{viewingDetail.relatedStory || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                id="btn-modal-notif-delete"
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleDelete(viewingDetail.id);
                  setViewingDetail(null);
                }}
              >
                Delete
              </Button>
              <Button
                id="btn-modal-notif-archive"
                variant="secondary"
                size="sm"
                onClick={() => {
                  handleArchive(viewingDetail.id);
                  setViewingDetail(null);
                }}
              >
                Archive Update
              </Button>
              <Button
                id="btn-modal-notif-action"
                variant="accent"
                size="sm"
                onClick={() => {
                  if (viewingDetail.unread) {
                    handleMarkAsRead(viewingDetail.id, false);
                  }
                  setViewingDetail(null);
                  showToast('success', 'Navigating to connected workspace workflow');
                }}
              >
                Open Workflow
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
