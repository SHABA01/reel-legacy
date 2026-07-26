import { useState, useCallback } from 'react';

export interface DeleteConfirmationState<T = any> {
  isOpen: boolean;
  item: T | null;
  title: string;
  message: string;
}

export function useDeleteConfirmation<T = any>() {
  const [modalState, setModalState] = useState<DeleteConfirmationState<T>>({
    isOpen: false,
    item: null,
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
  });

  const requestDelete = useCallback((item: T, title?: string, message?: string) => {
    setModalState({
      isOpen: true,
      item,
      title: title || 'Confirm Delete',
      message: message || 'Are you sure you want to delete this item? This action cannot be undone.',
    });
  }, []);

  const closeDelete = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false, item: null }));
  }, []);

  return {
    isOpen: modalState.isOpen,
    item: modalState.item,
    title: modalState.title,
    message: modalState.message,
    requestDelete,
    closeDelete,
  };
}
