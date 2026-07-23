/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

export interface BreadcrumbContextType {
  customBreadcrumbs: BreadcrumbItem[] | null;
  setBreadcrumbs: (crumbs: BreadcrumbItem[] | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const [customBreadcrumbs, setCustomBreadcrumbsState] = useState<BreadcrumbItem[] | null>(null);

  const setBreadcrumbs = useCallback((crumbs: BreadcrumbItem[] | null) => {
    setCustomBreadcrumbsState(crumbs);
  }, []);

  const value = useMemo(() => ({
    customBreadcrumbs,
    setBreadcrumbs,
  }), [customBreadcrumbs, setBreadcrumbs]);

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbs() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
}
