import { CheckCircle, Clock, Download, Globe, Zap } from "lucide-react";

import { FormattedMessage } from "react-intl";

export function Features() {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium">
            <FormattedMessage id="features.title" defaultMessage="Features" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800">
            <FormattedMessage
              id="features.heading"
              defaultMessage="Why Choose SubtitlePro?"
            />
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-lg">
            <FormattedMessage
              id="features.description"
              defaultMessage="Our advanced AI technology makes adding subtitles to your videos quick, accurate, and hassle-free."
            />
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <Globe className="h-10 w-10 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="features.multipleLanguages.title"
                defaultMessage="Multiple Languages"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="features.multipleLanguages.description"
                defaultMessage="Generate subtitles in 5 different languages with a single upload. Perfect for reaching a global audience."
              />
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <Zap className="h-10 w-10 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="features.fastProcessing.title"
                defaultMessage="Fast Processing"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="features.fastProcessing.description"
                defaultMessage="Our advanced AI processes your videos quickly, so you don't have to wait long for your subtitled content."
              />
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <CheckCircle className="h-10 w-10 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="features.highAccuracy.title"
                defaultMessage="High Accuracy"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="features.highAccuracy.description"
                defaultMessage="State-of-the-art speech recognition ensures your subtitles are accurate and properly synchronized."
              />
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <Clock className="h-10 w-10 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="features.realTimeStatus.title"
                defaultMessage="Real-time Status"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="features.realTimeStatus.description"
                defaultMessage="Track the progress of your subtitle generation in real-time with our intuitive status page."
              />
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <Download className="h-10 w-10 text-amber-600 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="features.easyDownload.title"
                defaultMessage="Easy Download"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="features.easyDownload.description"
                defaultMessage="Download your subtitled video with one click once processing is complete."
              />
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold mb-4">
              F
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="features.freeService.title"
                defaultMessage="Free Service"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="features.freeService.description"
                defaultMessage="Our service is completely free to use with no login required. Videos are processed in order of submission."
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
