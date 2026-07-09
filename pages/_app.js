import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body`}>
      <Component {...pageProps} />
    </main>
  );
}
