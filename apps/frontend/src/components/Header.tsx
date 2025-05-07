import { FileText } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "react-router-dom";

export function Header() {
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
            to="#features"
            className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition-colors"
          >
            <FormattedMessage
              id="header.nav.features"
              defaultMessage="Features"
            />
          </Link>
          <Link
            to="#how-it-works"
            className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition-colors"
          >
            <FormattedMessage
              id="header.nav.howItWorks"
              defaultMessage="How It Works"
            />
          </Link>
          <Link
            to="#testimonials"
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
