'use client';
import { useRouter } from 'next/navigation';

export function SidebarHeader() {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-10 flex items-center justify-center dark:bg-gray-900 text-gray-900 pb-6 pt-3 cursor-pointer"
    >
      <h1  onClick={() => {
        router.push('/');
      }}
      className="text-base font-bold dark:text-white mt-3 text-center hover:underline text-primary">
        
      </h1>
    </div>
  );
}
