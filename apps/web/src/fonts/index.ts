import localFont from "next/font/local";

export const fraunces = localFont({
  src: "../fonts/Fraunces-Variable.ttf",
  variable: "--font-fraunces",
  display: "swap",
});

export const cantarell = localFont({
  src: [
    { path: "../fonts/Cantarell-Regular.ttf", weight: "400" },
    { path: "../fonts/Cantarell-Bold.ttf", weight: "700" },
  ],
  variable: "--font-cantarell",
  display: "swap",
});

export const amarante = localFont({
  src: "../fonts/Amarante-Regular.ttf",
  variable: "--font-amarante",
  display: "swap",
});
