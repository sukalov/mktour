import SignInWithLichessButton from '@/components/auth/sign-in-with-lichess-button';
import { publicCaller } from '@/server/api';
import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const PageContent = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;

  const from =
    typeof searchParams.from === 'string' ? searchParams.from : undefined;
  const user = await publicCaller.user.auth.info();
  if (user) redirect('/');
  return (
    <main className="p-mk-2 mx-auto my-4 flex h-[calc(100svh-3.5rem)] w-full max-w-lg flex-auto items-center justify-center">
      <SignInWithLichessButton className="py-16" from={from} />
    </main>
  );
};

const Page = async (props: { searchParams: Promise<SearchParams> }) => {
  return (
    <Suspense
      fallback={
        <main className="mx-auto my-4 flex h-[calc(100svh-3.5rem)] w-full max-w-lg flex-auto items-center justify-center p-10">
          <SignInWithLichessButton className="p-10 py-16" />
        </main>
      }
    >
      <PageContent {...props} />
    </Suspense>
  );
};

export default Page;
