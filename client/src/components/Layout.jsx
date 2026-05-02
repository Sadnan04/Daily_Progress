import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#111c33] to-slate-950 pb-24 lg:pb-8">
      <div className="mx-auto grid min-h-0 w-full max-w-[1400px] grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(220px,260px)_minmax(0,1fr)] lg:gap-6 lg:p-6">
        <Sidebar />
        <div className="flex min-w-0 flex-col gap-4">
          <Navbar />
          <main className="min-h-0 min-w-0 flex-1" id="main-content">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
