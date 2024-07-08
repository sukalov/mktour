import { NAVMENU_ITEMS } from '@/components/navbars/nav-menu-items';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { User } from 'lucia';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DesktopNavbar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const t = useTranslations('Menu');
  const tSub = useTranslations('Menu_Subitems');
  const tSubDescription = useTranslations('Menu_Descriptions');

  return (
    <NavigationMenu className="hidden pr-2 md:block">
      <NavigationMenuList>
        {NAVMENU_ITEMS.map((tab) => {
          /* if (!tab.subMenuItems) {
         }
         if (!user && tab.userOnly) return <></>; */
          return (
            <NavigationMenuItem key={tab.path}>
              <NavigationMenuTrigger
                className={
                  pathname.includes(tab.path.split('/')[1]) ? 'font-bold' : ''
                }
              >
                {t(tab.title)}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end gap-2 rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 px-6 no-underline outline-none focus:shadow-md"
                        href={tab.path}
                      >
                        <div className="text-lg font-medium">
                          {t(tab.title)}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {t(`${tab.title} description`)}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {tab.subMenuItems!.map((subTab: NavbarItem) => (
                    <ListItem
                      key={subTab.path}
                      href={subTab.path}
                      title={tSub(subTab.title)}
                    >
                      {subTab.description && tSubDescription(subTab.title)}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
