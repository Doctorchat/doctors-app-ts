import { ChatBubbleBottomCenterTextIcon, HomeIcon } from "@heroicons/react/24/outline";

export const NAVIGATION_SIDENAV_WIDTH = 275;
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
    title: "common:home",
    icon: HomeIcon,
  },
  {
    key: "conversations",
    href: "/conversations",
    title: "conversations:conversations",
    icon: ChatBubbleBottomCenterTextIcon,
  },
];
