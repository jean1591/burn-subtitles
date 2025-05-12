import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Subtitles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto bg-white border-t border-amber-100">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Subtitles className="h-6 w-6 text-amber-600" />
              <span className="text-xl font-semibold text-gray-800">
                <FormattedMessage
                  id="footer.appName"
                  defaultMessage="SubtitlePro"
                />
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
                  to="#testimonials"
                  className="text-gray-600 hover:text-amber-600"
                >
                  <FormattedMessage
                    id="footer.resources.testimonials"
                    defaultMessage="Testimonials"
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

        <div className="mt-12 pt-8 border-t border-amber-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            <FormattedMessage
              id="footer.copyright"
              defaultMessage="© {year} SubtitlePro. All rights reserved."
              values={{ year: new Date().getFullYear() }}
            />
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-gray-600 hover:text-amber-600">
              <span className="sr-only">
                <FormattedMessage
                  id="footer.social.twitter"
                  defaultMessage="Twitter"
                />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-twitter"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-600 hover:text-amber-600">
              <span className="sr-only">
                <FormattedMessage
                  id="footer.social.facebook"
                  defaultMessage="Facebook"
                />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
            <Link to="#" className="text-gray-600 hover:text-amber-600">
              <span className="sr-only">
                <FormattedMessage
                  id="footer.social.instagram"
                  defaultMessage="Instagram"
                />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
