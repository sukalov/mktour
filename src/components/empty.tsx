import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const Empty = () => {
  const pathname = usePathname().split('/').at(-1)
  const t = useTranslations('Empty')
  console.log(usePathname().split('/'))
  
  return (
    <div className="mt-8 px-4 flex w-full justify-center text-sm text-muted-foreground">
      <p>{t(`${pathname}`)}</p>
    </div>
  );
};

export default Empty
