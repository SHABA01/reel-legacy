/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer';
import { useOverlay } from '../../context/OverlayContext';
import { Bell, Film, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Trash2, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AppNotification {
  id: string;
  category: 'render' | 'ai' | 'system' | 'warning';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'success' | 'warning' | 'info';
}

export function NotificationOverlay() {
  const { activeOverlay, closeOverlay } = useOverlay();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      category: 'render',
      title: 'Cinematic Render Complete',
      description: 'Your project "The Silver Lining of 1972" is fully synthesized in HD.',
      time: '10 mins ago',
      unread: true,
      type: 'success',
    },
    {
      id: 'notif-2',
      category: 'ai',
      title: 'Voice Narration Script Prepared',
      description: 'AI compiled voice-over tracks for Elizabeth Vance biography profile.',
      time: '1 hour ago',
      unread: true,
      type: 'info',
    },
    {
      id: 'notif-3',
      category: 'warning',
      title: 'Missing Media in Scene 3',
      description: 'Scene 3 has a script track but no linked image files. Upload now.',
      time: 'Yesterday',
      unread: false,
      type: 'warning',
    },
    {
      id: 'notif-4',
      category: 'system',
      title: 'Cloud Integration Synced',
      description: 'Linked Google Drive "Legacy Memories" folder synchronized successfully.',
      time: '2 days ago',
      unread: false,
      type: 'success',
    },
  ]);

  const isOpen = activeOverlay === 'notifications';

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('success', 'All notifications marked as read');
  };

  const clearAllNotifs = () => {
    setNotifications([]);
    showToast('info', 'All notifications cleared');
  };

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const removeNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (category: string, type: string) => {
    switch (category) {
      case 'render':
        return <Film className="w-4 h-4 text-cinema-amber-500" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-cinema-ai" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'system':
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/5';
      case 'warning':
        return 'bg-rose-500/5';
      case 'info':
      default:
        return 'bg-muted/40';
    }
  };

  return (
    <Drawer
      id="notification-drawer"
      isOpen={isOpen}
      onClose={closeOverlay}
      title="Notification Center"
      position="right"
      size="md"
    >
      <div id="notif-wrapper" className="flex flex-col h-full -mx-6 -my-4 text-foreground">
        {/* Actions Header */}
        <div id="notif-header" className="px-5 py-3 border-b border-border shrink-0 flex items-center justify-between bg-muted/40 text-xs">
          <span className="font-semibold text-muted-foreground">
            {notifications.filter((n) => n.unread).length} Unread Actions
          </span>
          {notifications.length > 0 && (
            <div className="flex gap-4" id="notif-actions">
              <button
                id="notif-mark-read"
                onClick={markAllAsRead}
                className="text-cinema-amber-500 hover:text-cinema-amber-600 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Read All
              </button>
              <button
                id="notif-clear-all"
                onClick={clearAllNotifs}
                className="text-muted-foreground hover:text-rose-500 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          )}
        </div>

        {/* List Body */}
        <div id="notif-body" className="flex-1 overflow-y-auto p-5 space-y-3">
          {notifications.length === 0 ? (
            <div id="notif-empty" className="py-16 text-center flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quiet workspace</p>
                <p className="text-xs max-w-xs mt-1">No pending events or compile signals inside your account dashboard.</p>
              </div>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                id={notif.id}
                className={`p-4 rounded-xl border flex gap-3 relative transition-all duration-250 ${getBgColor(
                  notif.type
                )} ${
                  notif.unread
                    ? 'border-cinema-amber-500/30'
                    : 'border-border'
                }`}
              >
                {/* Category Indicator Icon */}
                <div id={`${notif.id}-indicator`} className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shadow-sm shrink-0 border border-border">
                  {getIcon(notif.category, notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" id={`${notif.id}-content`}>
                  <div className="flex justify-between items-start gap-1 mb-0.5" id={`${notif.id}-header-row`}>
                    <p className={`text-sm leading-snug truncate ${notif.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.description}
                  </p>

                  {/* Actions Row */}
                  <div className="flex gap-3 mt-3 border-t border-border/50 pt-2 text-[11px] font-medium" id={`${notif.id}-actions`}>
                    <button
                      id={`${notif.id}-mark-read-toggle`}
                      onClick={() => toggleReadStatus(notif.id)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {notif.unread ? 'Mark as Read' : 'Mark as Unread'}
                    </button>
                    <span className="text-border select-none">|</span>
                    <button
                      id={`${notif.id}-dismiss`}
                      onClick={() => removeNotif(notif.id)}
                      className="text-rose-500/80 hover:text-rose-500 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Unread circle badge */}
                {notif.unread && (
                  <span id={`${notif.id}-unread-dot`} className="absolute top-4 right-4 w-2 h-2 bg-cinema-amber-500 rounded-full animate-pulse" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Drawer>
  );
}
