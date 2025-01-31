// app/chat/layout.tsx
import { redirect } from 'next/navigation';
import { requireAuth } from "@/lib/auth";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Check authentication
    await requireAuth();
  } catch (error) {
    // Redirect to home if not authenticated
    redirect('/');
  }

  return (
    <div className="flex flex-col h-full">
      {children}
    </div>
  );
}