import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cn } from '@/utils/cn'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import * as React from 'react'

export const ProfileSettings = () => {
  const session = useSession()

  return (
    <NavigationMenu delayDuration={0}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Image
              className='cursor-pointer rounded-full border-2'
              src={session.data?.user.image || 'images/user.svg'}
              width={32}
              height={32}
              alt='user pic'
            />
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <ul className='flex flex-col p-6'>
              {session.status === 'authenticated' ? (
                <ListItem onClick={() => signOut()}>Sign out</ListItem>
              ) : (
                <ListItem
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                >
                  Sign in
                </ListItem>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors dark:hover:bg-slate-700 dark:focus:bg-slate-700',
            className,
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-slate-500 dark:text-slate-400'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = 'ListItem'
