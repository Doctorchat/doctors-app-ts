import { Provider } from "react-redux";
import { MainLayoutHeader } from "./main-layout-header";
import { MainLayoutSidenav } from "./main-layout-sidenav";

import { ScrollArea } from "@/components/ui";
import { cn } from "@/utils";
import { store } from "@/store";

export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex h-full", className)} {...props}>
      <MainLayoutSidenav />
      <Provider store={store}>
        <main className="flex w-full flex-col overflow-hidden">
          <MainLayoutHeader />
          {children}
        </main>
      </Provider>
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
    <div className={cn("flex-1 overflow-hidden p-px", className)} {...props}>
      <ScrollArea vertical className="h-full">
        <div className="p-5">{children}</div>
      </ScrollArea>
    </div>
  );
};
