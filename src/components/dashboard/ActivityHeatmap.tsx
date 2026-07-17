/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Calendar, Flame, Award, Layers } from 'lucide-react';

interface ContributionDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export function ActivityHeatmap() {
  // Generate contribution data for the last 365 days (53 weeks)
  const { weeks, totalContributions, currentStreak, longestStreak } = useMemo(() => {
    const today = new Date();
    const daysData: ContributionDay[] = [];
    
    // We want 53 weeks (371 days) ending today
    const totalDays = 53 * 7;
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays + 1);
    
    let totalCount = 0;
    
    // Simple deterministic pseudo-random generator based on date index for beautiful, realistic waves
    const getSeedCount = (index: number, dayOfWeek: number) => {
      // Create some nice "active" waves throughout the year
      const wave1 = Math.sin(index / 15) * 2;
      const wave2 = Math.cos(index / 40) * 3;
      // Weekend dip
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendModifier = isWeekend ? -2 : 1;
      
      const combined = Math.floor(wave1 + wave2 + weekendModifier + (Math.sin(index / 3) * 2));
      const count = Math.max(0, combined);
      
      // Determine level (0-4)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count === 0) level = 0;
      else if (count <= 2) level = 1;
      else if (count <= 4) level = 2;
      else if (count <= 6) level = 3;
      else level = 4;
      
      return { count, level };
    };

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const { count, level } = getSeedCount(i, currentDate.getDay());
      totalCount += count;
      
      daysData.push({
        date: currentDate,
        count,
        level,
      });
    }

    // Group into weeks
    const weeksList: ContributionDay[][] = [];
    for (let i = 0; i < daysData.length; i += 7) {
      weeksList.push(daysData.slice(i, i + 7));
    }

    // Streaks calculations
    let current = 0;
    let longest = 0;
    let tempStreak = 0;

    // Scan backwards from today for current streak
    let reachedEnd = false;
    for (let i = daysData.length - 1; i >= 0; i--) {
      if (daysData[i].count > 0) {
        if (!reachedEnd) current++;
        tempStreak++;
      } else {
        reachedEnd = true;
        longest = Math.max(longest, tempStreak);
        tempStreak = 0;
      }
    }
    longest = Math.max(longest, tempStreak);

    // Fallbacks if no streak found
    if (current === 0 && daysData[daysData.length - 1].count > 0) current = 1;
    if (longest < current) longest = current;

    return {
      weeks: weeksList,
      totalContributions: totalCount,
      currentStreak: current || 14, // seed realistic numbers
      longestStreak: longest || 32,
    };
  }, []);

  // Helper to format date for tooltips
  const formatDateTooltip = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Helper to get month labels and their approximate column indexes
  const monthLabels = useMemo(() => {
    const labels: { label: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, colIndex) => {
      // Check the first day of each week
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        const monthName = week[0].date.toLocaleDateString(undefined, { month: 'short' });
        // Avoid packing labels too close
        if (labels.length === 0 || colIndex - labels[labels.length - 1].colIndex > 3) {
          labels.push({ label: monthName, colIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm text-left pretty-float-card" id="activity-heatmap-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-4 mb-5 gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-cinema-amber-500 animate-pulse" /> Workspace Contribution Ledger
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Dynamic timeline log entries, script revisions, and multimedia imports recorded across the biography.
          </p>
        </div>

        {/* Minimalist Stats */}
        <div className="flex items-center gap-6 text-xs" id="heatmap-quick-stats">
          <div className="flex items-center gap-1.5" title="Total documented actions">
            <Award className="w-4 h-4 text-cinema-amber-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-mono leading-none">Total Work</span>
              <span className="font-bold text-foreground font-mono">{totalContributions} contributions</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5" title="Consecutive active days">
            <Flame className="w-4 h-4 text-orange-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-mono leading-none">Current Streak</span>
              <span className="font-bold text-foreground font-mono">{currentStreak} days</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5" title="Maximum consecutive active days">
            <Layers className="w-4 h-4 text-indigo-500" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-mono leading-none">Longest Streak</span>
              <span className="font-bold text-foreground font-mono">{longestStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Grid Container with responsive scrolling */}
      <div className="w-full overflow-x-auto scrollbar-ephemeral pb-2" id="heatmap-scroll-container">
        <div className="min-w-[640px] select-none" id="heatmap-grid-wrapper">
          {/* Month Labels row */}
          <div className="flex h-5 text-[10px] font-mono text-muted-foreground/80 pl-8 relative" id="heatmap-months">
            {monthLabels.map((m, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{ left: `${32 + m.colIndex * 14}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Grid Rows: Day-of-week + Grid columns */}
          <div className="flex gap-2 items-start" id="heatmap-days-and-grid">
            {/* Days Column (Sun, Tue, Thu, Sat left blank, Mon, Wed, Fri visible like GitHub) */}
            <div className="flex flex-col gap-[3px] text-[9px] font-mono text-muted-foreground/70 w-6 pt-1 text-right pr-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Heatmap Columns (53 Weeks) */}
            <div className="flex gap-[3px] flex-1" id="heatmap-columns-grid">
              {weeks.map((week, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, rowIdx) => {
                    // Decide color level using ReelLegacy custom color scheme (Cinema Amber / Warm Gold)
                    let bgClass = 'heatmap-zero-cell';
                    if (day.level === 1) bgClass = 'bg-cinema-amber-500/20 dark:bg-cinema-amber-500/10 border border-cinema-amber-500/5';
                    else if (day.level === 2) bgClass = 'bg-cinema-amber-500/45 dark:bg-cinema-amber-500/25 border border-cinema-amber-500/10';
                    else if (day.level === 3) bgClass = 'bg-cinema-amber-500/75 dark:bg-cinema-amber-500/50';
                    else if (day.level === 4) bgClass = 'bg-cinema-amber-500';

                    return (
                      <div
                        key={rowIdx}
                        className="group relative cursor-crosshair"
                        id={`heatmap-day-${colIdx}-${rowIdx}`}
                      >
                        <div
                          className={`w-3 h-3 rounded-[2px] transition-all duration-150 hover:ring-2 hover:ring-cinema-amber-500/40 ${bgClass}`}
                        />
                        {/* Interactive Dynamic CSS Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-950 text-white text-[10px] font-mono rounded px-2.5 py-1 whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/15">
                          <span className="font-bold text-cinema-amber-400">{day.count === 0 ? 'No' : day.count} entries</span> on {formatDateTooltip(day.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Summary footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-4 border-t border-border mt-3" id="heatmap-footer">
        <span>Contributions made during local sessions</span>
        <div className="flex items-center gap-1.5" id="heatmap-legend">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] heatmap-zero-cell" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cinema-amber-500/20 dark:bg-cinema-amber-500/10" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cinema-amber-500/45 dark:bg-cinema-amber-500/25" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cinema-amber-500/75 dark:bg-cinema-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-cinema-amber-500" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
