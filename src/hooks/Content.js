import { useMemo } from 'react';
import { contents } from '../components/widgets';

export function useContentCatalog() {
  const contentKeys = useMemo(() => {
    return Object.keys(contents);
  });

  return { contents, contentKeys };
}

export function useContent(key) {
  const { contents } = useContentCatalog();

  return contents[key];
}
