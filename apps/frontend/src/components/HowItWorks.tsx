import { FormattedMessage } from "react-intl";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-neutral-900">
            <FormattedMessage
              id="howItWorks.title"
              defaultMessage="How It Works"
            />
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            <FormattedMessage
              id="howItWorks.subtitle"
              defaultMessage="Translate your subtitle files in just a few simple steps"
            />
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-neutral-200 -translate-x-1/2" />

          <div className="space-y-12 relative">
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right mb-8 md:mb-0 md:pr-12">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold mb-4 md:ml-auto">
                  1
                </div>
                <h3 className="text-xl font-medium mb-2">
                  <FormattedMessage
                    id="howItWorks.step1.title"
                    defaultMessage="Upload Your Files"
                  />
                </h3>
                <p className="text-neutral-600">
                  <FormattedMessage
                    id="howItWorks.step1.description"
                    defaultMessage="Drag and drop your subtitle files or browse to select them. We support .srt format."
                  />
                </p>
              </div>
              <div className="bg-neutral-100 h-48 rounded-lg flex items-center justify-center md:pl-12">
                <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm w-full max-w-xs">
                  <div className="border-2 border-dashed border-neutral-200 rounded p-4 text-center">
                    <p className="text-sm text-neutral-500">
                      <FormattedMessage
                        id="howItWorks.step1.dropzone"
                        defaultMessage="Drop your subtitle files here"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="bg-neutral-100 h-48 rounded-lg flex items-center justify-center order-1 md:order-none md:pr-12 mb-8 md:mb-0">
                <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm w-full max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-amber-500"></div>
                      <span className="text-sm">English</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-amber-500"></div>
                      <span className="text-sm">French</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-amber-500"></div>
                      <span className="text-sm">Spanish</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:text-left md:pl-12">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-medium mb-2">
                  <FormattedMessage
                    id="howItWorks.step2.title"
                    defaultMessage="Select Languages"
                  />
                </h3>
                <p className="text-neutral-600">
                  <FormattedMessage
                    id="howItWorks.step2.description"
                    defaultMessage="Choose the languages you want your subtitles translated into. You can select multiple languages at once."
                  />
                </p>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right mb-8 md:mb-0 md:pr-12">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold mb-4 md:ml-auto">
                  3
                </div>
                <h3 className="text-xl font-medium mb-2">
                  <FormattedMessage
                    id="howItWorks.step3.title"
                    defaultMessage="Track Progress"
                  />
                </h3>
                <p className="text-neutral-600">
                  <FormattedMessage
                    id="howItWorks.step3.description"
                    defaultMessage="Monitor your translation status with a unique link. You'll see your position in the queue and when processing begins."
                  />
                </p>
              </div>
              <div className="bg-neutral-100 h-48 rounded-lg flex items-center justify-center md:pl-12">
                <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm w-full max-w-xs">
                  <div className="space-y-3">
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-1/2 rounded-full"></div>
                    </div>
                    <p className="text-sm text-center">
                      <FormattedMessage
                        id="howItWorks.step3.progress"
                        defaultMessage="Processing: 50% complete"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="bg-neutral-100 h-48 rounded-lg flex items-center justify-center order-1 md:order-none md:pr-12 mb-8 md:mb-0">
                <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm w-full max-w-xs">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">
                      <FormattedMessage
                        id="howItWorks.step4.downloadText"
                        defaultMessage="Download results.zip"
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:text-left md:pl-12">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-medium mb-2">
                  <FormattedMessage
                    id="howItWorks.step4.title"
                    defaultMessage="Download Results"
                  />
                </h3>
                <p className="text-neutral-600">
                  <FormattedMessage
                    id="howItWorks.step4.description"
                    defaultMessage="Once processing is complete, download a zip file containing all your translated subtitle files. Files are available for 7 days."
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
