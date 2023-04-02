"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from "next/navigation";
import { Landing } from "./components/landing";
import { Loading } from "./components/home";

const useHasHydrated = () => {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    if (window.localStorage.getItem("aiconnectworld-landing")) {
      router.replace("/chat");
    }
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export default function App() {
  const loading = !useHasHydrated();

  if (loading) {
    return (
      <>
        <Loading />
        <Analytics />
      </>
    );
  }
  return (
    <>
      <Landing />
      <Analytics />
    </>
  );
}
