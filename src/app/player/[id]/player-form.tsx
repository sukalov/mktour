import { LoadingSpinner } from '@/app/loading';
import DeletePlayer from '@/app/player/[id]/delete-button';
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
import { DatabasePlayer } from '@/server/db/schema/players';
import { StatusInClub } from '@/server/db/zod/enums';
import { Save } from 'lucide-react';
import { MessageKeys, NestedKeyOf } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction } from 'react';
import { ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form';

const EditPlayerForm: FC<{
  userId: string;
  clubId: string;
  player: EditPlayerFormValues;
  status: StatusInClub | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({
  player: { id, nickname, realname, rating },
  clubId,
  userId,
  status,
  setOpen,
}) => {
  const editPlayerMutation = useEditPlayerMutation();
  const router = useRouter();
  const form = useForm<EditPlayerFormValues>({
    defaultValues: {
      id,
      nickname,
      realname,
      rating,
    },
  });

  const onSubmit = (values: EditPlayerFormValues) => {
    editPlayerMutation.mutate(
      { clubId, values },
      {
        onSuccess: () => {
          setOpen(false);
          router.refresh();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-mk pb-mk flex flex-col"
      >
        <Field name="nickname" placeholder={nickname} form={form} />
        <Field name="realname" placeholder={realname || ''} form={form} />
        <div className="gap-mk mt-mk flex flex-col">
          <Button
            type="submit"
            className="w-full"
            disabled={editPlayerMutation.isPending}
          >
            {editPlayerMutation.isPending ? <LoadingSpinner /> : <Save />}
            <FormattedMessage id="Common.save" />
          </Button>
          {status && <DeletePlayer clubId={clubId} />}
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
          {/* FIXME this is dirty as hell: */}
          <FormattedMessage
            id={
              `Player.${name}` as MessageKeys<
                IntlMessages,
                NestedKeyOf<IntlMessages>
              >
            }
          />
        </FormLabel>
        <FormControl>
          {CustomInput ? (
            <CustomInput {...field} />
          ) : (
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value ?? ''}
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

type EditPlayerFormValues = Pick<
  DatabasePlayer,
  'id' | 'nickname' | 'realname' | 'rating'
>;

type FieldProps = {
  name: keyof EditPlayerFormValues;
  CustomInput?: FC<
    ControllerRenderProps<EditPlayerFormValues, keyof EditPlayerFormValues>
  >;
  form: UseFormReturn<EditPlayerFormValues>;
  placeholder?: string | undefined;
};

export default EditPlayerForm;
