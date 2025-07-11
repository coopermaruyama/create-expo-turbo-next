"use client";

import "@tamagui/polyfill-dev";

import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useServerInsertedHTML } from "next/navigation";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import { TamaguiProvider } from "tamagui";

import { config as tamaguiConfig } from "../../tamagui.config";

export const NextTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme({
    fallback: "light",
  });

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet();
    return (
      <>
        <style jsx global>{`
          html {
            font-family: "Inter";
          }
          body {
            background-color: var(--background);
            color: var(--color);
          }
        `}</style>
        {/* Link your CSS output for optimized themes */}
        {process.env.NODE_ENV === "production" && (
          <link rel="stylesheet" href="/tamagui.css" />
        )}
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: tamaguiConfig.getNewCSS({
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              exclude:
                process.env.NODE_ENV === "production" ? "design-system" : null,
            }),
          }}
        />
      </>
    );
  });

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      skipNextHead
      onChangeTheme={(next) => {
        console.log("NextTamaguiProvider onChangeTheme", next);
        setTheme(next as any);
      }}
    >
      <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  );
};
