import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

export function HomePricingSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanClick = () => {
    if (user) {
      navigate("/buy-credits");
    } else {
      navigate("/register");
    }
  };

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
          {/* Starter Plan */}
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
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage id="pricing.enterprise.features.4" />
                </span>
              </li>
            </ul>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handlePlanClick}
            >
              <FormattedMessage id="pricing.starter.button" />
            </Button>
          </div>

          {/* Professional Plan */}
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
                  <FormattedMessage id="pricing.enterprise.features.4" />
                </span>
              </li>
            </ul>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handlePlanClick}
            >
              <FormattedMessage id="pricing.professional.button" />
            </Button>
          </div>

          {/* Enterprise Plan */}
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
            </ul>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handlePlanClick}
            >
              <FormattedMessage id="pricing.enterprise.button" />
            </Button>
          </div>
        </div>

        {/* Free Plan */}
        <div className="mt-12 border border-neutral-200 shadow-sm bg-white rounded-xl grid grid-cols-5 items-stretch p-6 py-12 gap-8">
          <div className="col-span-3 flex flex-col justify-center">
            <h3 className="text-xl font-medium mb-2">
              <FormattedMessage id="pricing.free.title" defaultMessage="Free" />
            </h3>
            <p className="mb-4 text-neutral-700">
              <FormattedMessage
                id="pricing.free.description.long"
                defaultMessage="Try our subtitle translation service with no commitment. Perfect for testing the quality and features before upgrading to a paid plan."
              />
            </p>
            <div className="mb-2 font-semibold text-amber-600">
              <FormattedMessage
                id="pricing.free.whatsIncluded"
                defaultMessage="What's included"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage
                    id="pricing.free.features.file"
                    defaultMessage="1 file at a time"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm">
                  <FormattedMessage
                    id="pricing.free.features.language"
                    defaultMessage="1 target language at a time"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span className="text-sm text-gray-500">
                  <FormattedMessage
                    id="pricing.free.features.storage"
                    defaultMessage="7 days file storage"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span className="text-sm text-gray-500">
                  <FormattedMessage
                    id="pricing.free.features.dashboard"
                    defaultMessage="Dashboard"
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col justify-center items-center bg-gray-50 rounded-xl  p-8 min-w-[260px] max-w-full space-y-4">
            <div className="text-gray-700">
              <FormattedMessage
                id="pricing.free.ctaTitle"
                defaultMessage="Start translating for free"
              />
            </div>
            <div className="flex items-baseline">
              <span className="text-6xl font-bold">0€</span>
              <span className="ml-2 text-neutral-600">
                <FormattedMessage
                  id="pricing.free.credits"
                  defaultMessage="free credits"
                />
              </span>
            </div>
            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white mb-2"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <FormattedMessage
                id="pricing.free.button"
                defaultMessage="Get Started"
              />
            </Button>
            <div className="text-xs text-neutral-500 text-center">
              <FormattedMessage
                id="pricing.free.note"
                defaultMessage="No credit card required. Upgrade anytime."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
