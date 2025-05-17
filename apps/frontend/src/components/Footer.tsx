import { Link, useLocation, useNavigate } from "react-router-dom";

import { FormattedMessage } from "react-intl";
import { Subtitles } from "lucide-react";

export function Footer() {
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
    <footer className="mx-auto bg-white border-t border-amber-100">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Subtitles className="h-6 w-6 text-amber-600" />
              <span className="text-xl font-semibold text-gray-800">
                <FormattedMessage id="footer.appName" defaultMessage="Titro" />
              </span>
            </div>
            <p className="text-gray-600">
              <FormattedMessage
                id="footer.description"
                defaultMessage="Automatically add subtitles to your videos in multiple languages."
              />
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-4">
              <FormattedMessage
                id="footer.resources.title"
                defaultMessage="Resources"
              />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#features"
                  onClick={(e) => handleScrollToSection(e, "features")}
                  className="text-gray-600 hover:text-amber-600"
                >
                  <FormattedMessage
                    id="footer.resources.features"
                    defaultMessage="Features"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to="#how-it-works"
                  onClick={(e) => handleScrollToSection(e, "how-it-works")}
                  className="text-gray-600 hover:text-amber-600"
                >
                  <FormattedMessage
                    id="footer.resources.howItWorks"
                    defaultMessage="How It Works"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to="#pricing"
                  onClick={(e) => handleScrollToSection(e, "pricing")}
                  className="text-gray-600 hover:text-amber-600"
                >
                  <FormattedMessage
                    id="footer.resources.pricing"
                    defaultMessage="Pricing"
                  />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-4">
              <FormattedMessage
                id="footer.legal.title"
                defaultMessage="Legal"
              />
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-600 hover:text-amber-600"
                >
                  <FormattedMessage
                    id="footer.legal.privacyPolicy"
                    defaultMessage="Privacy Policy"
                  />
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-600 hover:text-amber-600"
                >
                  <FormattedMessage
                    id="footer.legal.termsOfService"
                    defaultMessage="Terms of Service"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-12 pt-8 border-t border-amber-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            <FormattedMessage
              id="footer.copyright"
              defaultMessage="© {year} Titro. All rights reserved."
              values={{ year: new Date().getFullYear() }}
            />
          </p>
          <div className="flex gap-1 items-center justify-end">
            <p>Made from Biarritz with ❤️ by </p>
            <a
              href="https://jeanrobertou.com"
              target="_blank"
              className="font-bold hover:text-gray-500"
            >
              Jean Robertou
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
