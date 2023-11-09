export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full min-h-full w-full flex-col justify-center bg-neutral-50">
      <main className="flex items-center justify-center px-5">{children}</main>
    </div>
  );
};
