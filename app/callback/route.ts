import { handleSignIn, getLogtoContext } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { logtoConfig } from '../logto';

export const runtime = 'edge'; 

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);

  // Get the user context to ensure authentication
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  // Redirect to  dashboard
  redirect('/');
}