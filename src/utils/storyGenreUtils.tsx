import React from 'react';
import {
  BookOpen,
  Heart,
  Sparkles,
  Briefcase,
  Users,
  Globe,
  Calendar,
  GraduationCap,
  Wine,
  Gift,
  Film,
} from 'lucide-react';

export const STORY_TYPE_ICONS: Record<string, string> = {
  'Biographical Memoir': 'User',
  'Family History': 'Users',
  'Love & Relationship': 'Heart',
  'Career & Legacy': 'Briefcase',
  'Military Heritage': 'Sparkles',
  'Cultural & Heritage': 'Globe',
  'Tribute & Memorial': 'Calendar',
  'Milestone Event': 'GraduationCap',
  'Special Celebration': 'Wine',
  'Custom Story': 'Gift',
};

export function renderStoryGenreIcon(category: string, className = 'w-4 h-4 text-cinema-amber-500') {
  const iconName = STORY_TYPE_ICONS[category] || 'BookOpen';

  switch (iconName) {
    case 'User':
      return <BookOpen className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Wine':
      return <Wine className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    default:
      return <Film className={className} />;
  }
}
