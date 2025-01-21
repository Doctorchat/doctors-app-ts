import {
  ChatBubbleBottomCenterTextIcon,
  HomeIcon,
  WalletIcon,
  UserIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  SparklesIcon,
  VideoCameraIcon,
  SunIcon,
  QuestionMarkCircleIcon,
  BuildingOffice2Icon
} from "@heroicons/react/24/outline";

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
  {
    key: "wallet",
    href: "/wallet",
    translation: "wallet:wallet",
    icon: WalletIcon,
  },
  {
    key: "profile",
    href: "/profile",
    translation: "profile:profile",
    icon: UserIcon,
  },
  {
    key: "repeated-consultations",
    href: "/repeated-consultations",
    translation: "consultation:repeated_consultations.title",
    icon: DocumentPlusIcon,
  },
  {
    key: "partners",
    href: "/partners",
    translation: "partners:title",
    icon: UserGroupIcon,
  },
  {
    key: "custom-surveys",
    href: "/custom-surveys",
    translation: "survey:title",
    icon: QuestionMarkCircleIcon,
  },
  {
    key: "vacantion",
    href: "/vacantion",
    translation: "common:vacation",
    icon: SunIcon,
  },
  {
    key: "reviews",
    href: "/reviews",
    translation: "common:reviews",
    icon: SparklesIcon,
  },
  {
    key: "video-appointment",
    href: "/video-appointment",
    translation: "video:video_appointments",
    icon: VideoCameraIcon,
  },
  {
    key: "medical-centre-appointments",
    href: "/medical-centre-appointments",
    translation: "medical_centre:medical_centre_appointments",
    icon: BuildingOffice2Icon,
  },
];
