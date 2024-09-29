import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { DrawerProps } from '@/app/tournaments/[id]/dashboard/tabs/table/add-player';
import { useTournamentAddNewPlayer } from '@/components/hooks/mutation-hooks/use-tournament-add-new-player';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { newid } from '@/lib/utils';
import {
  NewPlayerFormType,
  newPlayerFormSchema,
} from '@/lib/zod/new-player-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';

const AddNewPlayer = ({
  value,
  setValue,
  returnToNewPlayer,
  handleClose,
}: AddNewPlayerProps) => {
  const id = usePathname().split('/').at(-1) as string;
  const tournament = useTournamentInfo(id);
  const queryClient = useQueryClient();
  const { sendJsonMessage, userId } = useContext(DashboardContext);
  const { mutate } = useTournamentAddNewPlayer(
    id,
    queryClient,
    sendJsonMessage,
    returnToNewPlayer,
  );
  const t = useTranslations('Tournament.AddPlayer')
  useHotkeys('escape', handleClose, { enableOnFormTags: true });

  const form = useForm<NewPlayerFormType>({
    resolver: zodResolver(newPlayerFormSchema),
    defaultValues: {
      name: value,
      rating: 1500,
      club_id: tournament.data?.club?.id,
    },
    reValidateMode: 'onSubmit',
  });

  const name = form.getValues('name');

  useEffect(() => {
    setValue(name);
  }, [name, setValue]);

  function onSubmit(data: NewPlayerFormType) {
    if (!userId) {
      console.log('not found user id in context');
      return;
    }
    const newPlayer: DatabasePlayer = {
      id: newid(),
      club_id: data.club_id,
      nickname: data.name,
      realname: data.name,
      rating: data.rating ?? null,
      user_id: null,
      last_seen: 0,
    };
    mutate({ tournamentId: id, player: newPlayer, userId });
    handleClose();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="drop-shadow-md"
                  placeholder={t('name')}
                  {...field}
                  autoComplete="off"
                  autoFocus
                  onKeyUp={() => {
                    form.clearErrors();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <legend>{t('estimated raiting')}: {value}</legend>
              <FormControl>
                <Slider
                  data-vaul-no-drag
                  step={50}
                  min={0}
                  max={3000}
                  className="w-full"
                  defaultValue={[value]}
                  onValueChange={(vals) => {
                    onChange(vals[0]);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormMessage />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || form.formState.isValidating}
        >
          {form.formState.isSubmitting || form.formState.isValidating ? (
            <>
              <Loader2 className="animate-spin" />
              &nbsp;{t("save")}
            </>
          ) : (
            <>
              <Save />
              &nbsp;{t("save")}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

interface AddNewPlayerProps extends DrawerProps {
  returnToNewPlayer: (_player: DatabasePlayer) => void;
  handleClose: () => void;
}

export default AddNewPlayer;
