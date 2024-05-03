import { Fragment, ReactElement } from "react";
import "@/styles/globals.css";
import dynamic from "next/dynamic";

//SetUp Store redux
import { Provider as ReduxProvider } from "react-redux";
import store from "@/store";

import { AppPropsWithLayoutType } from "@/types/layout/AppPropsWithLayout";
import NprogressProvider from "@/providers/nprogress";
import ReactQueryProvider from "@/providers/react-query";
import DateJSProvider from "@/providers/date";
import NextUIProvider from "@/providers/next-ui/index";
import AuthGuard from "@/providers/auth";

export default function App({ Component, pageProps }: AppPropsWithLayoutType) {
  const getLayout = Component.getLayout || ((page: ReactElement) => page);
  const auth = Component.authGuard ?? false;

  return (
    <Fragment>
      <ReactQueryProvider>
        <ReduxProvider store={store}>
          <NprogressProvider>
            <NextUIProvider>
              <DateJSProvider>
                <AuthGuard authGuard={auth}>
                  {getLayout(<Component {...pageProps} />)}
                </AuthGuard>
              </DateJSProvider>
            </NextUIProvider>
          </NprogressProvider>
        </ReduxProvider>
      </ReactQueryProvider>
    </Fragment>
  );
}
