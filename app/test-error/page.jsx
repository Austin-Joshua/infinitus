'use client';

import { useState, useEffect } from 'react';

export default function TestErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false);

  useEffect(() => {
    // Only throw on client mount to allow static build compilation
    setShouldThrow(true);
  }, []);

  if (shouldThrow) {
    throw new Error('Forced E2E error simulation for reporting verification');
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-400">
      Preparing simulated error scenario...
    </div>
  );
}
