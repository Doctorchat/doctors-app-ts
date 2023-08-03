import { ChatBubbleBottomCenterTextIcon, HomeIcon } from "@heroicons/react/24/outline";

export const NAVIGATION_SIDENAV_WIDTH = 275;
export const NAVIGATION_SIDENAV_COLLAPSED_WIDTH = 75;

export interface NavigationLink {
  key: string;
  translation: string;
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
    translation: "common:home",
    icon: HomeIcon,
  },
  {
    key: "conversations",
    href: "/conversations",
    translation: "conversations:conversations",
    icon: ChatBubbleBottomCenterTextIcon,
  },
];
