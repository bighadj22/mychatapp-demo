// components/chat/welcome-chat.tsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { handleSignIn, handleSignOut } from '@/app/actions/auth';

interface WelcomeChatProps {
  userId?: string;
  userName?: string;
}

export function WelcomeChat({ userId, userName }: WelcomeChatProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to MyChat App
      </h1>
      
      {userId ? (
        <>
          <p className="text-lg text-gray-600 mb-4">
            Hello, {userName || 'User'}! Start chatting with your AI assistant
          </p>
          <div className="flex gap-4">
            <form action={handleSignOut}>
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
            <Button
              onClick={() => window.location.href = '/chat'}
              variant="default"
            >
              Go to Chat
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-600 mb-4">
            Please sign in to start chatting
          </p>
          <form action={handleSignIn}>
            <Button type="submit">
              Sign In
            </Button>
          </form>
        </>
      )}
    </div>
  );
}