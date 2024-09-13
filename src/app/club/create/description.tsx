import { NewClubForm } from '@/app/club/create/new-club-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';

export default function ClubDescription({ form }: ClubDescriptionProps) {
  const t = useTranslations('NewClubForm');
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('description')}</FormLabel>
          <FormControl>
            <Textarea placeholder={t('description placeholder')} {...field} />
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
