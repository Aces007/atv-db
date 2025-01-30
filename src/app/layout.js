import { Cinzel, Montserrat, Red_Hat_Display } from "next/font/google";
import "./globals.css";
import './fontawesome.js';
import { WebProvider } from "./WebsiteContext";

const cinzel = Cinzel({
  variable: "--ff-cinzel",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--ff-montserrat",
  subsets: ["latin"],
});

const redHat = Red_Hat_Display({
  variable: "--ff-redHat",
  subsets: ["latin"],
});

export const metadata = {
  title: "PUP OUS: ArchiTech Vault",
  description: "Open Minds Open Access",
  
};

export default function RootLayout({ children }) {
  return (
    <WebProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body
          className={`${cinzel.variable} ${montserrat.variable} ${redHat.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </WebProvider>
  );
}
