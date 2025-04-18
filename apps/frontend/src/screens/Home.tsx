import { Features } from "@/components/Features";
import { FormattedMessage } from "react-intl";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Upload } from "@/components/Upload";

export const HomePage = () => (
  <>
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium">
              <FormattedMessage
                id="hero.tagline"
                defaultMessage="Automatic Subtitles"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-800">
              <FormattedMessage
                id="hero.title"
                defaultMessage="Add Subtitles to Your Videos Automatically"
              />
            </h1>
            <p className="max-w-[600px] text-gray-600 md:text-xl">
              <FormattedMessage
                id="hero.description"
                defaultMessage="Upload your video and get accurate subtitles in multiple languages in minutes. No manual transcription needed. No login required."
              />
            </p>
            <div className="bg-amber-100 p-3 rounded-lg">
              <p className="text-amber-800 font-medium">
                <FormattedMessage
                  id="hero.queueNotice"
                  defaultMessage="Note: Your video will be processed in order of submission. You'll be able to track your position in the queue."
                />
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
            <div className="relative bg-white p-6 rounded-xl shadow-sm border border-amber-100">
              <Upload />
            </div>
          </div>
        </div>
      </div>
    </section>
    <Features />
    <HowItWorks />
    <Testimonials />
  </>
);
