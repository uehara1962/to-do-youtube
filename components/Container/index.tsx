import { clsx } from "clsx";

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div
      className={clsx(
        "min-h-screen bg-slate-100 text-slate-900",
        "dark:bg-slate-900 dark:text-slate-100"
      )}
    >
      <div
        className={clsx(
          "min-h-screen bg-slate-800 max-w-5xl mx-auto px-8",
          "flex flex-col items-center gap-4"
        )}
      >
        {children}
      </div>
    </div>
  );
}
