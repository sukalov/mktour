import { LoadingSpinner } from '@/app/loading';
import FormattedMessage from '@/components/formatted-message';
import useEditPlayerMutation from '@/components/hooks/mutation-hooks/use-player-edit';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { FC } from 'react';
import { ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form';

const EditPlayerForm: FC<{
  userId: string;
  player: Pick<DatabasePlayer, 'id' | 'nickname' | 'realname' | 'rating'>;
}> = ({ player: { id, nickname, realname, rating }, userId }) => {
  const queryClient = useQueryClient();
  const editPlayerMutation = useEditPlayerMutation(queryClient);
  const form = useForm({
    defaultValues: {
      id,
      nickname,
      realname,
      rating,
    },
  });

  const onSubmit = (
    values: Pick<DatabasePlayer, 'id' | 'nickname' | 'realname' | 'rating'>,
  ) => {
    editPlayerMutation.mutate({ userId, values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Field name="nickname" placeholder={nickname} form={form} />
        <Field name="realname" placeholder={realname || ''} form={form} />
        <div className="mt-4 flex w-full justify-end">
          <Button
            type="submit"
            className="w-full md:w-fit"
            disabled={editPlayerMutation.isPending}
          >
            {editPlayerMutation.isPending ? <LoadingSpinner /> : <Save />}
            &nbsp;
            <FormattedMessage id="Common.save" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Field: FC<FieldProps> = ({ name, CustomInput, form, placeholder }) => (
  <FormField
    name={name}
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-muted-foreground pl-3 font-light">
          <FormattedMessage id={`Player.${name}` as any /*FIXME any*/} />
        </FormLabel>
        <FormControl>
          {CustomInput ? (
            <CustomInput {...field} />
          ) : (
            <Input placeholder={placeholder} {...field} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

type FieldProps = {
  name: string;
  CustomInput?: FC<ControllerRenderProps<any, any>>;
  form: UseFormReturn<any>;
  placeholder?: string | undefined;
};

export default EditPlayerForm;
