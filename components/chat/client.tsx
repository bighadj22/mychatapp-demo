// app/chat/client.tsx
'use client';

import React from 'react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface ChatClientProps {
  user: User | null;
}

export function ChatClient({ user }: ChatClientProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold mb-2">
            Protected Chat Route
          </h2>
          <p className="text-gray-600">
            Welcome, {user?.name || 'User'}! This is a protected route.
          </p>
        </div>
      </div>
    </div>
  );
}