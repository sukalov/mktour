import Navigation from '@/components/navigation';
import { getQueryClient, trpc } from '@/components/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function NavWrapper() {
  const queryClient = getQueryClient();
  const fetches = await Promise.all([
    queryClient.fetchQuery(trpc.auth.info.queryOptions()),
    queryClient.prefetchQuery(trpc.auth.notifications.counter.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Navigation user={fetches[0]} />
    </HydrationBoundary>
  );
}
