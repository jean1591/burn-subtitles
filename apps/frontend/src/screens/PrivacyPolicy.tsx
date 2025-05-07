import { FormattedMessage } from "react-intl";

export function PrivacyPolicy() {
  return (
    <div className="bg-[#FDF8F3]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">
          <FormattedMessage
            id="privacy.title"
            defaultMessage="Privacy Policy"
          />
        </h1>

        <div className="space-y-8">
          {/* Introduction Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="privacy.intro.title"
                defaultMessage="Introduction"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="privacy.intro.content"
                defaultMessage="This Privacy Policy outlines how we manage information in connection with your use of our subtitle translation service. Our goal is to provide a seamless, multilingual experience while respecting your privacy and minimizing data collection. This policy explains what limited information we do use, how it is handled, and your rights as a user of the platform."
              />
            </p>
          </section>

          {/* Cookies Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="privacy.cookies.title"
                defaultMessage="Cookies and Language Preferences"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="privacy.cookies.content"
                defaultMessage="We use a minimal number of essential cookies strictly to remember your selected language and interface preferences. These cookies ensure that your experience on the site remains consistent as you navigate between pages and return to the service. No cookies are used for tracking, advertising, or analytics purposes. You may disable cookies through your browser settings, but doing so may affect how the service performs, especially in maintaining your language settings."
              />
            </p>
          </section>

          {/* Third-Party Content Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="privacy.thirdParty.title"
                defaultMessage="Third-Party Content"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="privacy.thirdParty.content"
                defaultMessage="While our platform is self-contained, it may occasionally include links to third-party websites—for example, external documentation or open-source resources. These sites operate independently, and we are not responsible for their content, data policies, or practices. We recommend that users review the privacy policies of any third-party services they choose to visit through external links."
              />
            </p>
          </section>

          {/* Changes Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="privacy.changes.title"
                defaultMessage="Changes to This Policy"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="privacy.changes.content"
                defaultMessage="We may revise this Privacy Policy to reflect changes to the service or in compliance requirements. All updates will be clearly posted on this page with the most recent revision date. Continuing to use the service after changes are published constitutes your agreement to the updated policy."
              />
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              <FormattedMessage
                id="privacy.contact.title"
                defaultMessage="Contact"
              />
            </h2>
            <p className="text-gray-600">
              <FormattedMessage
                id="privacy.contact.content"
                defaultMessage="If you have any questions or concerns about this Privacy Policy, or if you need clarification on how we handle data and cookies, please reach out to us through our official support channels. We're committed to providing transparent and respectful communication."
              />
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
