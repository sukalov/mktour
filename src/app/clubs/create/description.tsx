import { NewClubForm } from '@/app/clubs/create/new-club-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function ClubDescription({ form }: ClubDescriptionProps) {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="tell something about your club..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface ClubDescriptionProps {
  form: NewClubForm;
}
