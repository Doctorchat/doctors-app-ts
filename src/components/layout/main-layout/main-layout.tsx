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
      <main className="flex flex-auto flex-col">
        <MainLayoutHeader />
        <div className="flex-auto overflow-y-auto p-px">
          <ScrollArea vertical className="h-full">
            <div className="p-6">{children}</div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
};
