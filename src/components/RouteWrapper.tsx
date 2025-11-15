"use client";

import React from "react";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function RouteWrapper({ children }: Props) {
  const pathname = usePathname();
  const isHome = !pathname || pathname === "/" || pathname === "";
  return <div className={isHome ? "home-page" : "non-home"}>{children}</div>;
}


