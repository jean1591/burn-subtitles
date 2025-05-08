import { FormattedMessage } from "react-intl";

export function TermsOfService() {
  return (
    <div className="bg-[#FDF8F3]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">
          <FormattedMessage
            id="terms.title"
            defaultMessage="Terms of Service"
          />
        </h1>

        <div className="space-y-8">
          {/* Introduction Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.intro.title"
                defaultMessage="Welcome"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.intro.content"
                defaultMessage="Welcome to our subtitle translation platform. By accessing or using this service, you agree to be bound by the following Terms of Service. Please read them carefully."
              />
            </p>
          </section>

          {/* Acceptance Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.acceptance.title"
                defaultMessage="1. Acceptance of Terms"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.acceptance.content"
                defaultMessage="By using this website, you confirm that you understand and agree to these Terms of Service. If you do not agree, please do not use the platform."
              />
            </p>
          </section>

          {/* Service Description Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.service.title"
                defaultMessage="2. Description of the Service"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.service.content"
                defaultMessage="This service provides tools for translating and localizing subtitles and other user-provided text. It is designed to support multiple languages through a user-friendly interface, with language switching and internationalization powered by react-intl."
              />
            </p>
          </section>

          {/* User Responsibilities Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.responsibilities.title"
                defaultMessage="3. User Responsibilities"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.responsibilities.content"
                defaultMessage="You agree to use the platform in a lawful and respectful manner. You must not upload or use content that is illegal, harmful, or infringes on the rights of others. You are responsible for any content you submit for translation or display through the platform."
              />
            </p>
          </section>

          {/* Intellectual Property Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.intellectualProperty.title"
                defaultMessage="4. Intellectual Property"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.intellectualProperty.content"
                defaultMessage="All original content, design, and functionality of the site are the property of the platform owner. Any user-submitted content remains the property of the original author. By submitting content, you grant us a non-exclusive license to process and display that content within the context of the translation features."
              />
            </p>
          </section>

          {/* No Warranty Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.warranty.title"
                defaultMessage="5. No Warranty"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.warranty.content"
                defaultMessage="The service is provided 'as is' and 'as available' without warranties of any kind. While we aim for accuracy and stability, we make no guarantees that translations are error-free or that the service will be uninterrupted or secure."
              />
            </p>
          </section>

          {/* Limitation of Liability Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.liability.title"
                defaultMessage="6. Limitation of Liability"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.liability.content"
                defaultMessage="To the maximum extent permitted by law, we are not liable for any damages or losses arising from your use of the platform. This includes indirect or consequential damages, lost profits, or lost data."
              />
            </p>
          </section>

          {/* Modifications Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.modifications.title"
                defaultMessage="7. Modifications to the Terms"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.modifications.content"
                defaultMessage="We may update these Terms of Service from time to time. When we do, the new version will be posted on this page with the updated effective date. Continued use of the service means you accept the updated terms."
              />
            </p>
          </section>

          {/* Governing Law Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.governingLaw.title"
                defaultMessage="8. Governing Law"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.governingLaw.content"
                defaultMessage="These Terms are governed by the laws of [Insert Jurisdiction], without regard to conflict of law principles."
              />
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="terms.contact.title"
                defaultMessage="9. Contact"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="terms.contact.content"
                defaultMessage="If you have any questions about these Terms of Service, please contact us through our official support channel or contact form."
              />
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
