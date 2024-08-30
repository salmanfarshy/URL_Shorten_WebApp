import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { UrlState } from "@/context";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();

  const { user, fetchUser } = UrlState();

  return (
    <>
      <nav className="py-8 flex justify-between items-center">
        <Link to="/">
          <p className="text-gray-200 md:text-3xl text-2xl font-bold">
            <span className="text-red-400 italic">Trim</span>URL
          </p>
        </Link>
        <div className="flex gap-4">
          {!user ? (
            location.pathname !== "/auth" && (
              <Button onClick={() => navigate("/auth")}>Login</Button>
            )
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 h-9 bg-gray-500 ring-2 ring-cyan-800 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage
                    className="scale-110"
                    src={user?.user_metadata?.profile_pic}
                  />
                  <AvatarFallback className="font-semibold">PA</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="me-5 mt-2 bg-gray-900">
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex font-medium">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/auth");
                    });
                  }}
                  className="text-red-400 font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;
