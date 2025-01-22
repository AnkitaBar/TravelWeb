import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Home from "./component/Home";
import Portfolio from "./component/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Index() {
  return (
    <>
      <Home/>
      <Portfolio/>
      
     
    </>
  );
}
