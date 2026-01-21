import type { Metadata } from "next";
import { Inter, Manrope } from 'next/font/google'
import "./globals.css";
import Header from "../components/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ['latin'],      // required subset
  weight: ['400', '700'],  // choose font weights you need
  display: 'swap',         // prevents invisible text while loading
})

export const metadata: Metadata = {
  title: "Yuki",
  description: "Animebytes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <link rel="icon" href="/images/favicon.ico" sizes="any" />
      <body className={` ${inter.className} antialiased`}>
        <Header></Header>
        {children}
        <ToastContainer></ToastContainer>
      </body>
    </html>
  );
}
