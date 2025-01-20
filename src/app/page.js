"use client"

import Home from "./homepage/page"
import SignUp from "./signuppage/page";
import Login from "./loginpage/page";
import SearchResults from "./searchresults/page";
import './fontawesome.js';
import { WebProvider } from "./WebsiteContext";


export default function HomePage() {
  return (
    <WebProvider>
      <Home />
      <SignUp />
      <Login />
      <SearchResults />
    </WebProvider>
  );
}
