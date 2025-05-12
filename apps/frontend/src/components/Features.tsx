import {
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Globe,
  Shield,
} from "lucide-react";

import { FormattedMessage } from "react-intl";

export function Features() {
  return (
    <section id="features" className="bg-amber-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
            <FormattedMessage
              id="features.title"
              defaultMessage="Why Choose Our Subtitle Translator"
            />
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            <FormattedMessage
              id="features.subtitle"
              defaultMessage="Fast, accurate, and easy-to-use subtitle translation for all your needs"
            />
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <Globe className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage
                id="features.multipleLanguages.title"
                defaultMessage="Multiple Languages"
              />
            </h3>
            <p className="text-neutral-600">
              <FormattedMessage
                id="features.multipleLanguages.description"
                defaultMessage="Translate your subtitles into 5 different languages with high accuracy and natural phrasing."
              />
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <Clock className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage
                id="features.fastProcessing.title"
                defaultMessage="Fast Processing"
              />
            </h3>
            <p className="text-neutral-600">
              <FormattedMessage
                id="features.fastProcessing.description"
                defaultMessage="Get your translated subtitles quickly with our efficient processing system."
              />
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <CheckCircle className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage
                id="features.highQuality.title"
                defaultMessage="High Quality"
              />
            </h3>
            <p className="text-neutral-600">
              <FormattedMessage
                id="features.highQuality.description"
                defaultMessage="Our translation engine ensures accurate and contextually appropriate translations."
              />
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <Download className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage
                id="features.easyDownload.title"
                defaultMessage="Easy Download"
              />
            </h3>
            <p className="text-neutral-600">
              <FormattedMessage
                id="features.easyDownload.description"
                defaultMessage="Download all your translated subtitle files in a convenient zip package."
              />
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <Shield className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage
                id="features.privacyFirst.title"
                defaultMessage="Privacy First"
              />
            </h3>
            <p className="text-neutral-600">
              <FormattedMessage
                id="features.privacyFirst.description"
                defaultMessage="Your subtitle files are processed securely and deleted after 7 days."
              />
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
            <CreditCard className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage
                id="features.pricing.title"
                defaultMessage="Flexible Pricing"
              />
            </h3>
            <p className="text-neutral-600">
              <FormattedMessage
                id="features.pricing.description"
                defaultMessage="Pay only for what you need with our credit-based system."
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
