"use client";

import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/navigation";
import { Landing } from "./components/landing";

export default function App() {
  const router = useRouter();
  if (window.localStorage.getItem("aiconnectworld-landing")) {
    router.replace("/chat");
  }
  return (
    <>
      <Landing />
      <Analytics />
    </>
  );
}
