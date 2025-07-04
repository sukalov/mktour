import { LoadingSpinner } from '@/app/loading';
import Fab from '@/components/fab';
import { useUser } from '@/components/hooks/query-hooks/use-user';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SideDrawer from '@/components/ui/side-drawer';
import { Slider } from '@/components/ui/slider';
import {
  newPlayerFormSchema,
  NewPlayerFormType,
} from '@/lib/zod/new-player-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, UserPlus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHotkeys } from 'react-hotkeys-hook';

const AddPlayerDrawer = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useHotkeys(
    'shift+equal',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );
  useHotkeys(
    'control+shift+equal',
    (e) => {
      e.preventDefault();
      setOpen((prev) => !prev);
    },
    { enableOnFormTags: true },
  );

  const handleChange = (state: boolean) => {
    if (!isAnimating) {
      setOpen(state);
      setValue('');
    }
  };

  return (
    <>
      <Fab
        className={`${(open || isAnimating) && 'z-60'}`}
        onClick={() => handleChange(!open)}
        icon={open ? X : UserPlus}
      />
      <SideDrawer
        open={open}
        setOpen={handleChange}
        setIsAnimating={setIsAnimating}
      >
        <AddNewPlayer value={value} setValue={setValue} />
      </SideDrawer>
    </>
  );
};

const AddNewPlayer = ({ value, setValue }: DrawerProps) => {
  // const { id } = useParams<{ id: string }>();
  const user = useUser();
  // const { mutate } = { mutate: () => console.log() };
  const t = useTranslations('Tournament.AddPlayer');
  // useHotkeys('escape', handleClose, { enableOnFormTags: true });

  const form = useForm<NewPlayerFormType>({
    resolver: zodResolver(newPlayerFormSchema),
    defaultValues: {
      name: value,
      rating: 1500,
      club_id: user.data?.selected_club,
    },
    reValidateMode: 'onSubmit',
  });

  const name = form.getValues('name');

  useEffect(() => {
    setValue(name);
  }, [name, setValue]);

  // function onSubmit(data: NewPlayerFormType) {
  //   if (!userId) {
  //     console.log('not found user id in context');
  //     return;
  //   }
  //   const newPlayer: DatabasePlayer = {
  //     id: newid(),
  //     club_id: data.club_id,
  //     nickname: data.name,
  //     realname: data.name,
  //     rating: data.rating,
  //     user_id: null,
  //     last_seen: 0,
  //   };
  //   mutate({ tournamentId: id, player: newPlayer, userId });
  //   handleClose();
  // }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(console.log)}
        className="h-svh space-y-8"
      >
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
              <legend>
                {t('estimated raiting')}: {value}
              </legend>
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
              <LoadingSpinner />
              &nbsp;{t('save')}
            </>
          ) : (
            <>
              <Save />
              &nbsp;{t('save')}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export type DrawerProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export default AddPlayerDrawer;
