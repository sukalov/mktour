import {
  NAVMENU_ITEMS,
  SubNavItem,
} from '@/components/navigation/nav-menu-items';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function NavigationMenuContainer() {
  const pathname = usePathname();
  const t = useTranslations('Menu');

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAVMENU_ITEMS.map((tab) => {
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
                        className="flex w-full select-none flex-col gap-2 rounded-md bg-linear-to-b from-muted/50 to-muted p-4 px-6 no-underline outline-hidden focus:shadow-md"
                        href={tab.path}
                      >
                        <div className="text-lg font-medium">
                          {t(`Subheadings.${tab.title}`)}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {t(`Descriptions.${tab.title}`)}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {tab.subMenuItems &&
                    tab.subMenuItems.map((subTab: SubNavItem) => (
                      <ListItem
                        key={subTab.path}
                        href={subTab.path}
                        title={t(`Subs.${subTab.title}`)}
                      >
                        {subTab.description &&
                          t(`Subs.Descriptions.${subTab.title}`)}
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
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
