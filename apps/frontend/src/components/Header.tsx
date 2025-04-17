import { FormattedMessage } from "react-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Link } from "react-router-dom";
import { Subtitles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-100 bg-amber-50/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Subtitles className="h-6 w-6 text-amber-600" />
          <span className="text-xl font-semibold text-gray-800">
            <FormattedMessage id="app.name" defaultMessage="SubtitlePro" />
          </span>
        </Link>
        <nav className="flex gap-6 items-center">
          <Link
            to="#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FormattedMessage id="nav.features" defaultMessage="Features" />
          </Link>
          <Link
            to="#how-it-works"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FormattedMessage
              id="nav.howItWorks"
              defaultMessage="How It Works"
            />
          </Link>
          <Link
            to="#testimonials"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FormattedMessage
              id="nav.testimonials"
              defaultMessage="Testimonials"
            />
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
