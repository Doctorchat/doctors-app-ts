import { cn } from "@/utils";

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn("flex min-h-screen w-full flex-col justify-center bg-neutral-50", className)}
      {...props}
    >
      <main className="flex items-center justify-center px-4">{children}</main>
    </div>
  );
};
