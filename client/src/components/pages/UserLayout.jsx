import { Outlet } from "react-router";
import { Navbar } from "../pages/Navbar";
import { Footer } from "../pages/Footer";

const UserLayout = () => {
  return (
    <div className="bg-slate-50 font-sans">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default UserLayout;
