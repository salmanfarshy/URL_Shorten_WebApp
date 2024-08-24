import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen max-w-7xl container relative md:px-12 px-5">
        <Header />
        <Outlet />
        <Toaster />
      </main>
      <div className="px-10 md:py-5 py-3 text-center font-medium md:text-lg bg-gray-800 mt-10">
        Made with <span className="md:text-xl">✌</span> by Salman Farshi.
      </div>
    </div>
  );
};

export default AppLayout;
