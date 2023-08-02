import { MainLayoutHeader } from "./main-layout-header";
import { MainLayoutSidenav } from "./main-layout-sidenav";

import { ScrollArea } from "@/components/ui";
import { cn } from "@/utils";

export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex h-full", className)} {...props}>
      <MainLayoutSidenav />
      <main className="flex w-full flex-col overflow-hidden">
        <MainLayoutHeader />
        {children}
      </main>
    </div>
  );
};

export interface MainLayoutContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayoutContent: React.FC<MainLayoutContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex-auto overflow-hidden p-px", className)} {...props}>
      <ScrollArea vertical className="h-full">
        <div className="p-5">{children}</div>
      </ScrollArea>
    </div>
  );
};
