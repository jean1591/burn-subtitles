import { FormattedMessage } from "react-intl";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-amber-50/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium">
            <FormattedMessage id="howItWorks.title" defaultMessage="Process" />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800">
            <FormattedMessage
              id="howItWorks.heading"
              defaultMessage="How It Works"
            />
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-lg">
            <FormattedMessage
              id="howItWorks.description"
              defaultMessage="Adding subtitles to your videos has never been easier. Just follow these simple steps."
            />
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xl mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="howItWorks.step1.title"
                defaultMessage="Upload Your Video"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="howItWorks.step1.description"
                defaultMessage="Drag and drop your video file or browse to select it from your device."
              />
            </p>
            <div className="mt-6 h-48 w-full relative rounded-lg overflow-hidden border border-amber-100">
              <img
                src="/placeholder.svg?height=192&width=384"
                alt="Upload interface"
                width={384}
                height={192}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xl mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="howItWorks.step2.title"
                defaultMessage="Select Languages"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="howItWorks.step2.description"
                defaultMessage="Choose from 5 different languages for your subtitles."
              />
            </p>
            <div className="mt-6 h-48 w-full relative rounded-lg overflow-hidden border border-amber-100">
              <img
                src="/placeholder.svg?height=192&width=384"
                alt="Language selection"
                width={384}
                height={192}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xl mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="howItWorks.step3.title"
                defaultMessage="Wait in Queue"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="howItWorks.step3.description"
                defaultMessage="Your video will be processed in order. Track your position in the queue on the status page."
              />
            </p>
            <div className="mt-6 h-48 w-full relative rounded-lg overflow-hidden border border-amber-100">
              <img
                src="/placeholder.svg?height=192&width=384"
                alt="Queue status"
                width={384}
                height={192}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-xl mb-4">
              4
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              <FormattedMessage
                id="howItWorks.step4.title"
                defaultMessage="Download Result"
              />
            </h3>
            <p className="text-gray-600">
              <FormattedMessage
                id="howItWorks.step4.description"
                defaultMessage="Once processing is complete, download your video with embedded subtitles."
              />
            </p>
            <div className="mt-6 h-48 w-full relative rounded-lg overflow-hidden border border-amber-100">
              <img
                src="/placeholder.svg?height=192&width=384"
                alt="Download page"
                width={384}
                height={192}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
