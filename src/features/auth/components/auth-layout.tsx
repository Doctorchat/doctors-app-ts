import { cn } from "@/utils";

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-full w-full flex-col justify-center bg-neutral-50",
        className,
      )}
      {...props}
    >
      <main className="flex items-center justify-center px-5">{children}</main>
    </div>
  );
};
