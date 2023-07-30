import { ChatBubbleBottomCenterIcon, HomeIcon, UsersIcon } from "@heroicons/react/24/outline";

export const NAVIGATION_SIDENAV_WIDTH = 290;
export const NAVIGATION_SIDENAV_COLLAPSED_WIDTH = 75;

export interface NavigationLink {
  key: string;
  title: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

export const navigationLinks: NavigationLink[] = [
  {
    key: "home",
    href: "/",
    title: "Home",
    icon: HomeIcon,
  },
  {
    key: "users",
    href: "/users",
    title: "Users",
    icon: UsersIcon,
  },
  {
    key: "conversations",
    href: "/conversations",
    title: "Conversations",
    icon: ChatBubbleBottomCenterIcon,
  },
];
