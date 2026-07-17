import React, { useEffect, useState, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function EphemeralScrollbar() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseStyleY: number; scrollStyleY: number }>({ mouseStyleY: 0, scrollStyleY: 0 });
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep track of timeouts for nested scrollable elements
  const activeTimeoutsRef = useRef<Map<HTMLElement, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    // 1. Handle window scroll
    const handleWindowScroll = () => {
      setScrollY(window.scrollY);
      setScrollHeight(document.documentElement.scrollHeight);
      setClientHeight(document.documentElement.clientHeight);
      
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Disappear 1.5 seconds after scroll stops
    };

    // 2. Capture-phase global scroll listener for nested scrollable elements (sidebar, tabs, divs, etc.)
    const handleCaptureScroll = (e: Event) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement) || target === document.documentElement) {
        return;
      }

      // Add scrolling class to nested scrollable element
      target.classList.add('is-scrolling');

      // Clear existing timeout for this specific element
      const existingTimeout = activeTimeoutsRef.current.get(target);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Hide scrollbar after 1.5 seconds of no scrolling activity on this element
      const timeout = setTimeout(() => {
        target.classList.remove('is-scrolling');
        activeTimeoutsRef.current.delete(target);
      }, 1500);

      activeTimeoutsRef.current.set(target, timeout);
    };

    // Initial window size calculations
    setScrollY(window.scrollY);
    setScrollHeight(document.documentElement.scrollHeight);
    setClientHeight(document.documentElement.clientHeight);

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleWindowScroll);
    
    // Capture scroll events globally for all scrollable sub-elements
    window.addEventListener('scroll', handleCaptureScroll, { capture: true, passive: true });
    
    const interval = setInterval(() => {
      setScrollHeight(document.documentElement.scrollHeight);
      setClientHeight(document.documentElement.clientHeight);
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleWindowScroll);
      window.removeEventListener('scroll', handleCaptureScroll, { capture: true });
      clearInterval(interval);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Clean up all active sub-element timeouts
      activeTimeoutsRef.current.forEach((t) => clearTimeout(t));
      activeTimeoutsRef.current.clear();
    };
  }, []);

  const scrollableHeight = scrollHeight - clientHeight;
  const isScrollable = scrollableHeight > 10;

  // Maintain fixed height of 140px
  const trackHeight = 140;
  
  // Calculate thumb height proportionally (clamp between 20px and 60px)
  const calculatedThumbHeight = Math.max(20, Math.min(60, (clientHeight / (scrollHeight || 1)) * trackHeight));
  
  // Available height for thumb to move
  const availableTrackHeight = trackHeight - calculatedThumbHeight;
  const scrollPercent = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
  const thumbTop = scrollPercent * availableTrackHeight;

  const handleScrollUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollBy({ top: -window.innerHeight * 0.4, behavior: 'smooth' });
    
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 1500);
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollBy({ top: window.innerHeight * 0.4, behavior: 'smooth' });
    
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 1500);
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      mouseStyleY: e.clientY,
      scrollStyleY: window.scrollY
    };
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !trackRef.current) return;
      
      const deltaY = e.clientY - dragStartRef.current.mouseStyleY;
      const percentMovement = deltaY / (availableTrackHeight || 1);
      const additionalScroll = percentMovement * scrollableHeight;
      const targetScroll = dragStartRef.current.scrollStyleY + additionalScroll;
      
      window.scrollTo(0, Math.max(0, Math.min(scrollableHeight, targetScroll)));
      
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, availableTrackHeight, scrollableHeight]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current || e.target === e.currentTarget) {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clickY = e.clientY - rect.top;
      const relativeClickPercent = (clickY - calculatedThumbHeight / 2) / (availableTrackHeight || 1);
      const targetScroll = Math.max(0, Math.min(scrollableHeight, relativeClickPercent * scrollableHeight));
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const shouldBeVisible = isScrollable && (isScrolling || isDragging || isHovered);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed right-1 sm:right-1.5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 p-0.5 rounded-full border border-cinema-amber-500/10 bg-black/55 backdrop-blur-md shadow-xl select-none transition-all duration-300 ${
        shouldBeVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}
      style={{ width: '16px' }}
      id="ephemeral-gold-scrollbar"
    >
      {/* Scroll Up Button */}
      <button
        onClick={handleScrollUp}
        className="p-0.5 text-cinema-amber-500 hover:text-cinema-amber-400 hover:scale-110 transition-all cursor-pointer rounded-full active:scale-95"
        title="Scroll Up"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>

      {/* Floating Scroll Track - thinner and transparent */}
      <div 
        ref={trackRef}
        onClick={handleTrackClick}
        style={{ height: `${trackHeight}px` }}
        className="w-1.5 relative cursor-pointer flex justify-center bg-transparent"
      >
        {/* Transparent track guide line */}
        <div className="absolute inset-y-0 w-[1px] bg-cinema-amber-500/5 rounded-full" />
        
        {/* Floating Thumb */}
        <div
          onMouseDown={handleThumbMouseDown}
          style={{ 
            height: `${calculatedThumbHeight}px`,
            transform: `translateY(${thumbTop}px)`,
          }}
          className={`w-[3px] rounded-full absolute bg-cinema-amber-500 hover:bg-cinema-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all cursor-grab active:cursor-grabbing ${
            isDragging ? 'bg-cinema-amber-400 scale-x-120 shadow-[0_0_12px_rgba(245,158,11,0.8)]' : ''
          }`}
        />
      </div>

      {/* Scroll Down Button */}
      <button
        onClick={handleScrollDown}
        className="p-0.5 text-cinema-amber-500 hover:text-cinema-amber-400 hover:scale-110 transition-all cursor-pointer rounded-full active:scale-95"
        title="Scroll Down"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
