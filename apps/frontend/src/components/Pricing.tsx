import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-amber-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
            <FormattedMessage id="pricing.title" />
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            <FormattedMessage id="pricing.description" />
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">
                <FormattedMessage id="pricing.starter.title" />
              </h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  <FormattedMessage id="pricing.starter.price" />
                </span>
                <span className="ml-2 text-neutral-600">
                  <FormattedMessage id="pricing.starter.credits" />
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                <FormattedMessage id="pricing.starter.description" />
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.starter.features.1" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.starter.features.2" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.starter.features.3" />
                </span>
              </li>
            </ul>
            <Link to="/buy-credits?plan=starter" className="w-full">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                <FormattedMessage id="pricing.starter.button" />
              </Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-amber-500 shadow-md flex flex-col relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <FormattedMessage id="pricing.professional.badge" />
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">
                <FormattedMessage id="pricing.professional.title" />
              </h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  <FormattedMessage id="pricing.professional.price" />
                </span>
                <span className="ml-2 text-neutral-600">
                  <FormattedMessage id="pricing.professional.credits" />
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                <FormattedMessage id="pricing.professional.description" />
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.professional.features.1" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.professional.features.2" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.professional.features.3" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.professional.features.4" />
                </span>
              </li>
            </ul>
            <Link to="/buy-credits?plan=professional" className="w-full">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                <FormattedMessage id="pricing.professional.button" />
              </Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">
                <FormattedMessage id="pricing.enterprise.title" />
              </h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  <FormattedMessage id="pricing.enterprise.price" />
                </span>
                <span className="ml-2 text-neutral-600">
                  <FormattedMessage id="pricing.enterprise.credits" />
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                <FormattedMessage id="pricing.enterprise.description" />
              </p>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.enterprise.features.1" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.enterprise.features.2" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.enterprise.features.3" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.enterprise.features.4" />
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.enterprise.features.5" />
                </span>
              </li>
            </ul>
            <Link to="/buy-credits?plan=enterprise" className="w-full">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                <FormattedMessage id="pricing.enterprise.button" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-600 mb-4">
            <FormattedMessage id="pricing.custom.title" />
          </p>
          <Link to="/contact">
            <Button variant="outline">
              <FormattedMessage id="pricing.custom.button" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
