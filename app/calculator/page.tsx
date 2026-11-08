import App from "./src/App";
import "./src/App.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator",
};

export default function Page() {
  return <App />;
}
