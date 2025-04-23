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
import { useForm } from 'react-hook-form';

const EditPlayerForm: FC<DatabasePlayer> = ({ nickname }) => {
  const form = useForm({
    defaultValues: {
      username: nickname,
    },
  });
  return (
    <Form {...form}>
      <FormField
        name="username"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
};

export default EditPlayerForm;
