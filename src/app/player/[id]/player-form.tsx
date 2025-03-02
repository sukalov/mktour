import FormattedMessage from '@/components/formatted-message';
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
  const onSubmit = (values: any) => console.log(values);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Field name="username" placeholder={nickname} form={form} />
        <Field name="realname" placeholder={realname || ''} form={form} />
        <div className="flex w-full justify-end mt-4">
          <Button type="submit" className="w-full md:w-fit">
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
