"use client";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  authGuard: boolean;
};

const AuthGuard = (props: Props) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);

  const handleCheckAuth = () => {
    const token = sessionStorage.getItem("token"); // or Redux or Cookie or Other
    if (!token && props.authGuard) {
      router.push("/"); // Path Login
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCheckAuth();
  }, [router.asPath]);

  if (isLoading) {
    return null; // Or you can return a loading
  } else {
    return props.children;
  }
};

export default AuthGuard;
