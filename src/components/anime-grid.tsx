import { ReactNode } from "react";

interface AnimeGridProps {
  children: ReactNode;
}

export function AnimeGrid({ children }: AnimeGridProps) {
  return <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</section>;
}
