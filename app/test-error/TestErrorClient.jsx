'use client';

import { useState, useEffect } from 'react';

export default function TestErrorClient() {
  const [shouldThrow, setShouldThrow] = useState(false);

  useEffect(() => {
    // Only throw on client mount in active E2E sessions
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
