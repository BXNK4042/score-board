'use client';

import { useState } from 'react';

export function useEditableTitle(
  title: string,
  onSave: (title: string) => void,
): {
  tempTitle: string;
  isEditing: boolean;
  setTempTitle: (value: string) => void;
  start: () => void;
  save: () => void;
} {
  const [prevTitle, setPrevTitle] = useState(title);
  const [tempTitle, setTempTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  if (title !== prevTitle) {
    setPrevTitle(title);
    setTempTitle(title);
  }

  const start = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  const save = () => {
    const trimmed = tempTitle.trim();
    if (trimmed) {
      onSave(trimmed);
    } else {
      setTempTitle(title);
    }
    setIsEditing(false);
  };

  return { tempTitle, isEditing, setTempTitle, start, save };
}
