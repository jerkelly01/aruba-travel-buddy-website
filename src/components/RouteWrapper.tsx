"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function RouteWrapper({ children }: Props) {
  const pathname = usePathname();
  const isHome = !pathname || pathname === "/" || pathname === "";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <div className={isHome ? "home-page" : "non-home"}>{children}</div>;
}


