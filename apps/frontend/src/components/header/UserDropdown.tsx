import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { FormattedMessage } from "react-intl";
import { UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

export function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-sm bg-white px-4 py-1 text-sm font-medium hover:bg-gray-50 transition-colors ring-gray-200 ring-1 hover:cursor-pointer"
          aria-label="User menu"
        >
          <div className="flex gap-2 items-center justify-start">
            <UserIcon className="w-4 h-4" strokeWidth={2} />
            <p className="truncate max-w-[120px]">{user.email}</p>
          </div>
          <p className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
            <FormattedMessage
              id="userDropdown.creditsLabel"
              defaultMessage="{credits} credits"
              values={{ credits: user.credits }}
            />
          </p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-bold">
          <FormattedMessage
            id="userDropdown.account"
            defaultMessage="My Account"
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
          <FormattedMessage
            id="userDropdown.dashboard"
            defaultMessage="Dashboard"
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/buy-credits")}>
          <FormattedMessage
            id="userDropdown.buyCredits"
            defaultMessage="Buy Credits"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <FormattedMessage id="userDropdown.logout" defaultMessage="Logout" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
