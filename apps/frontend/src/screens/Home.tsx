import { Features } from "@/components/Features";
import { FormattedMessage } from "react-intl";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingSection } from "@/components/Pricing";
import { Upload } from "@/components/Upload";

export const HomePage = () => {
  return (
    <div className="px-4 sm:px-0 flex min-h-screen flex-col bg-[#FDF8F3]">
      <main className="flex-1">
        <section className="mx-auto container py-12 md:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                <FormattedMessage
                  id="home.automaticTranslation"
                  defaultMessage="Automatic Translation"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-neutral-900">
                <FormattedMessage
                  id="home.title"
                  defaultMessage="Translate Subtitles in Multiple Languages"
                />
              </h1>
              <p className="text-lg text-neutral-600 md:text-xl">
                <FormattedMessage
                  id="home.description"
                  defaultMessage="Upload your subtitle files and get accurate translations in minutes. No manual work needed. No login required."
                />
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
                <p className="text-sm">
                  <FormattedMessage
                    id="home.queueNote"
                    defaultMessage="Note: Your files will be processed in order of submission. You'll be able to track your position in the queue."
                  />
                </p>
              </div>
            </div>

            <Upload />
          </div>
        </section>

        <Features />
        <HowItWorks />
        <PricingSection />
      </main>
    </div>
  );
};
