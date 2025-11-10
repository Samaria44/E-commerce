import { Outlet } from "react-router-dom";
import Footer from "./footer";
import Header from "./header";

export default function AppLayout() {
  return (
<> <Header/>
<Outlet/>
  <Footer />
</>
  );
}