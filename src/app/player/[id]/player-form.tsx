import FormattedMessage from '@/components/formatted-message';
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
import { FC } from 'react';
import { ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form';

const EditPlayerForm: FC<DatabasePlayer> = ({ nickname, rating, realname }) => {
  const form = useForm({
    defaultValues: {
      username: nickname,
      realname,
      rating,
    },
  });
  return (
    <Form {...form}>
      <Field name="username" placeholder={nickname} form={form} />
      <Field name="realname" placeholder={realname || ''} form={form} />
    </Form>
  );
};

const Field: FC<FieldProps> = ({ name, CustomInput, form, placeholder }) => (
  <FormField
    name={name}
    control={form.control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="pl-3">
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
