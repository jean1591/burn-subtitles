import { Button } from "../ui/button";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@/contexts/authContext";

export const UserOrLogin = () => {
  const { user } = useAuth();

  return (
    <div>
      {user ? (
        <UserDropdown />
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="hover:cursor-pointer">
              <FormattedMessage id="header.login" defaultMessage="Login" />
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="hover:cursor-pointer">
              <FormattedMessage
                id="header.register"
                defaultMessage="Register"
              />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
