import "@/styles/globals.css";
import "@/styles/fonts.css";
import "@/utils/i18n";

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/Redux/store";
import { Toaster } from "react-hot-toast";
import GlobalLoader from "@/components/GlobalMessage/GLobalLoader";
import GlobalErrorMessage from "@/components/GlobalMessage/GlobalErrorMessage";
import GlobalMessage from "@/components/GlobalMessage/GlobalMessage";
import SeoHead from "@/components/Seo/SeoHead";
import ConfirmDialogProvider from "@/components/ConfirmDialogProvider";
import { DashboardLayout } from "../dashboard/Layout";

import ThemeProvider, { useThemeContext } from "@/context/ThemeProvider";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { makeTheme } from "@/theme";

import { appWithTranslation } from "next-i18next";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NavProvider } from "@/context/navigationContext";
import Head from "next/head";

import { getToken } from "@/utils/auth";
import { getUserInfo } from "@/Redux/auth/UserInfoSlice";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-S7DQ4FTK93";

function ThemeAwareMui({ children }) {
  const { isDark } = useThemeContext();
  const theme = makeTheme(isDark ? "dark" : "light");
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

// ✅ Fetch profile once here
function AppWithRedux({ Component, pageProps }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const getLayout =
    Component.getLayout || ((page) => <DashboardLayout>{page}</DashboardLayout>);
  const { i18n } = useTranslation();

  // 🔑 Fetch user profile once when app mounts
  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch(getUserInfo(token));
    } else {
      dispatch(getUserInfo(null)); // ensure state is cleared
    }
  }, [dispatch]);

  // Devtools detection (your logic kept)
  // useEffect(() => {
  //   const detectDevTools = () => {
  //     const threshold = 160;
  //     const isOpen =
  //       window.outerWidth - window.innerWidth > threshold ||
  //       window.outerHeight - window.innerHeight > threshold;
  //     setDevtoolsOpen(isOpen);
  //   };
  //   const interval = setInterval(detectDevTools, 500);
  //   return () => clearInterval(interval);
  // }, []);

  const language = i18n?.language || "en";
  const fontClass = language === "bn" ? "font-bangla" : "font-english";

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      {devtoolsOpen ? (
        <div className="devtools-blocked">Please close DevTools to continue.</div>
      ) : (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){ window.dataLayer.push(arguments); }
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `}
          </Script>

          <SeoHead />

          <div className={fontClass}>
            {getLayout(<Component {...pageProps} />)}
            <GlobalLoader />
            <GlobalErrorMessage />
            <GlobalMessage />
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </>
      )}
    </>
  );
}

function MyApp(props) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ThemeProvider>
          <ThemeAwareMui>
            <NavProvider>
              <ConfirmDialogProvider>
                <AppWithRedux {...props} />
              </ConfirmDialogProvider>
            </NavProvider>
          </ThemeAwareMui>
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default appWithTranslation(MyApp);
