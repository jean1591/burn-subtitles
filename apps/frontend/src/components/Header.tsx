import { Link, useLocation, useNavigate } from "react-router-dom";

import { FileText } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // If we're not on the home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      // Use setTimeout to ensure the navigation has completed
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }

    // If we're already on home page, just scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-amber-50/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-amber-500" />
          <span className="text-xl font-bold">
            <FormattedMessage id="header.appName" defaultMessage="Titro" />
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/#features"
            onClick={(e) => handleScrollToSection(e, "features")}
            className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition-colors"
          >
            <FormattedMessage
              id="header.nav.features"
              defaultMessage="Features"
            />
          </Link>
          <Link
            to="/#how-it-works"
            onClick={(e) => handleScrollToSection(e, "how-it-works")}
            className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition-colors"
          >
            <FormattedMessage
              id="header.nav.howItWorks"
              defaultMessage="How It Works"
            />
          </Link>
          <Link
            to="/#testimonials"
            onClick={(e) => handleScrollToSection(e, "testimonials")}
            className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition-colors"
          >
            <FormattedMessage
              id="header.nav.testimonials"
              defaultMessage="Testimonials"
            />
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
