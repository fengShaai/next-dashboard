import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import Link from 'next/link';
 
export default function LoginPage() {
  return (
    <div className='flex flex-col items-center min-h-screen bg-gray-100'>  
      <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 ">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
    <p className="text-sm text-gray-500">
    Or go back to the{' '}
    <Link href="/" className="text-blue-600 hover:underline">
      Home Page
    </Link>
  </p>
    </div>
  );
}