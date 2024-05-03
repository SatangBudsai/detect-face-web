"use client";

import { StateType } from "@/store";
import Head from "next/head";
import React, { Fragment, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Image } from "@nextui-org/react";
import LoadingScreen from "@/components/loading-screen";

type Props = {
  children: ReactNode;
  title?: string;
  desc?: string;
  keyword?: string;
};

const RootLayout = (props: Props) => {
  const loaderState = useSelector((state: StateType) => state.loaderState);

  return (
    <Fragment>
      <Head>
        <title>{props.title || process.env.NEXT_PUBLIC_PROJECT_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={props.desc} />
        <meta name="keyword" content={props.keyword} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <main>
        <Image
          src="/images/background-full.svg"
          removeWrapper
          radius="none"
          className="fixed object-cover w-screen h-screen -z-10"
          alt="background"
        />
        <LoadingScreen isLoading={loaderState.loader > 0} />
        {props.children}
      </main>
    </Fragment>
  );
};

export default RootLayout;
