import { NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import { navigationMenuTriggerStyle } from './ui/navigation-menu'
import { ComponentProps } from 'react'
import { LucideIcon } from 'lucide-react'

interface NavLinkProps extends ComponentProps<'a'> {
  children: string
  href: string
  icon?: LucideIcon | undefined
}

export function NavLink(props: NavLinkProps) {
  return (
    <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
      <a {...props} href={props.href} className="flex gap-2">
        {props.icon !== undefined ? <props.icon width={'20px'} /> : <></>}
        {props.children}
      </a>
    </NavigationMenuLink>
  )
}
