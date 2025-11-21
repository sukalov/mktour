'use client';

import { useTRPC } from '@/components/trpc/client';
import { Button } from '@/components/ui/button';
import { Item, ItemActions } from '@/components/ui/item';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function ApiTokens() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.apiToken.list.queryOptions());
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    trpc.auth.apiToken.generate.mutationOptions({
      onSuccess: ({ token }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.apiToken.list.queryKey(),
        });
        setTimeout(
          () =>
            console.log(
              queryClient.getQueryData(trpc.auth.apiToken.list.queryKey()),
            ),
          1000,
        );
        navigator.clipboard.writeText(token);
      },
    }),
  );

  const { mutate: revoke } = useMutation(
    trpc.auth.apiToken.revoke.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.apiToken.list.queryKey(),
        });
        setTimeout(
          () =>
            console.log(
              queryClient.getQueryData(trpc.auth.apiToken.list.queryKey()),
            ),
          1000,
        );
      },
    }),
  );

  return (
    <div className="flex flex-col gap-2 p-8">
      {data?.map((token) => (
        <Item key={token.id}>
          {token.name}
          <ItemActions>
            <Button
              variant={'destructive'}
              onClick={() => revoke({ id: token.id })}
            >
              revoke
            </Button>
          </ItemActions>
        </Item>
      ))}
      <Button onClick={() => mutate({ name: 'test-token' })}>generate</Button>
    </div>
  );
}
