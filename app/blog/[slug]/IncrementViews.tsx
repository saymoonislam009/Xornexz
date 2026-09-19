'use client';

import { useEffect } from 'react';

interface IncrementViewsProps {
  slug: string;
}

export default function IncrementViews({ slug }: IncrementViewsProps) {
  useEffect(() => {
    // Fire-and-forget view count increment
    fetch(`/api/blog/${slug}/views`, { method: 'POST' }).catch(() => {
      // Silently fail — view counting is non-critical
    });
  }, [slug]);

  return null;
}
