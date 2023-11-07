import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";
import { persist, createJSONStorage } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { Button, ScrollArea, Sheet, SheetClose, SheetContent, Spinner } from "@/components/ui";
import {
  NAVIGATION_SIDENAV_COLLAPSED_WIDTH,
  NAVIGATION_SIDENAV_WIDTH,
  navigationLinks,
} from "@/config";
import { cn } from "@/utils";

export interface MainLayoutSidenavStore {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isOverlay: boolean;
  setIsOverlay: (isOverlay: boolean) => void;
}

export const useMainLayoutSidenavStore = createWithEqualityFn<
  MainLayoutSidenavStore,
  [["zustand/persist", MainLayoutSidenavStore]]
>(
  persist(
    (set) => ({
      isCollapsed: false,
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      isOverlay: false,
      setIsOverlay: (isOverlay) => set({ isOverlay }),
    }),
    {
      name: "main-layout-sidenav",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        state.isOverlay = false;
      },
    }
  ),
  shallow
);

const SidenavContent = React.memo(() => {
  const { t } = useTranslation();

  const isCollapsed = useMainLayoutSidenavStore((store) => store.isCollapsed);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCollapsedImpl = isCollapsed && isMobile === false;
  const navigate = useNavigate();
  return (
    <>
      <header
        className={cn("flex h-16 flex-shrink-0 cursor-pointer items-center px-5", {
          "px-[19px]": isCollapsedImpl,
        })}
        onClick={() => navigate("/")}
      >
        <div className="flex items-center">
          <img
            src="/assets/logo.svg"
            width="36"
            height="36"
            alt="Doctorchat"
            className="h-9 w-9 flex-shrink-0 object-contain"
          />
          <span
            className={cn("ml-3 text-xl font-semibold text-typography-primary", {
              hidden: isCollapsedImpl,
            })}
          >
            Doctorchat
          </span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-px">
        <ScrollArea vertical type={isCollapsedImpl ? "scroll" : "hover"} className="h-full">
          <nav className="px-3.5 py-2">
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.key}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        "flex h-10 items-center overflow-hidden rounded-md px-3 text-neutral-700",
                        "transition-colors md:hover:bg-neutral-200 md:hover:text-typography-primary",
                        "active:bg-neutral-200 active:text-typography-primary",
                        { "px-2.5": isCollapsedImpl },
                        { "bg-neutral-200 text-typography-primary": isActive }
                      )
                    }
                  >
                    {({ isPending }) => (
                      <>
                        {isPending ? (
                          <Spinner className="h-6 w-6 flex-shrink-0" />
                        ) : (
                          <link.icon className="h-6 w-6 flex-shrink-0" />
                        )}
                        <span
                          className={cn("ml-3 truncate font-medium", { hidden: isCollapsedImpl })}
                        >
                          {t(link.translation)}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </main>
    </>
  );
});
SidenavContent.displayName = "SidenavContent";

export interface MainLayoutSidenavProps extends React.HTMLAttributes<HTMLElement> {}

export const MainLayoutSidenav: React.FC<MainLayoutSidenavProps> = ({
  style,
  className,
  ...props
}) => {
  const { isCollapsed, isOverlay, setIsOverlay } = useMainLayoutSidenavStore(
    (store) => ({
      isCollapsed: store.isCollapsed,
      isOverlay: store.isOverlay,
      setIsOverlay: store.setIsOverlay,
    }),
    shallow
  );
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isCollapsedImpl = isCollapsed && isMobile === false;

  React.useEffect(() => {
    setIsOverlay(false);
  }, [location.key, setIsOverlay]);

  if (isMobile) {
    return (
      <Sheet open={isOverlay} onOpenChange={setIsOverlay}>
        <SheetContent
          side="left"
          style={{
            width: NAVIGATION_SIDENAV_WIDTH,
          }}
          className="p-0"
        >
          <SidenavContent />
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-3 top-8 -translate-y-1/2">
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      style={{
        width: isCollapsedImpl ? NAVIGATION_SIDENAV_COLLAPSED_WIDTH : NAVIGATION_SIDENAV_WIDTH,
        ...style,
      }}
      className={cn(
        "flex flex-shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-neutral-100 transition-[width]",
        className
      )}
      {...props}
    >
      <SidenavContent />
    </aside>
  );
};
