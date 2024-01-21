'use client';

import { useRouter } from 'next/navigation';

interface SignOutBtnProps {
  className: string;
}

export default function SignOutBtn({ className }: SignOutBtnProps) {
  const router = useRouter();
  const handleSignOut = async () => {
    const response = await fetch('/api/sign-out', {
      method: 'POST',
      redirect: 'manual',
    });

    if (response.status === 0) {
      // redirected
      // when using `redirect: "manual"`, response status 0 is returned
      return router.refresh();
    }
  };
  return (
    <button onClick={handleSignOut} className={className}>
      Sign out
    </button>
  );
}
