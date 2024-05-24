import { DrawerProps } from '@/components/dashboard/tabs/table/add-player';
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
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import {
  NewPlayerFormType,
  newPlayerFormSchema,
} from '@/lib/zod/new-player-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save } from 'lucide-react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

const AddNewPlayer: FC<DrawerProps> = ({ handleAddPlayer }) => {
  const form = useForm<NewPlayerFormType>({
    resolver: zodResolver(newPlayerFormSchema),
    defaultValues: {
      name: '',
      rating: 1500,
      club_id: useTournamentStore.getState().organizer.id,
    },
    reValidateMode: 'onSubmit',
  });

  function onSubmit({ name, rating }: NewPlayerFormType) {
    handleAddPlayer({ type: 'new', name, rating });
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
                  placeholder="name"
                  {...field}
                  autoComplete="off"
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
              <legend>estimated rating: {value}</legend>
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
              &nbsp;save
            </>
          ) : (
            <>
              <Save />
              &nbsp;save
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddNewPlayer;
