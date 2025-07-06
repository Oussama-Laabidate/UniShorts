import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            Privacy Policy
          </h1>
          
          <div className="space-y-8 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-semibold">Introduction</h2>
              <p>
                Welcome to Laabidate Films. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy sets out how we collect, use, store, and protect your personal information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
              <p>
                We collect various types of information in connection with the services we provide, including:
              </p>
              <ul>
                <li><strong>Personal Identification Information:</strong> Name, email address, and university affiliation provided during registration.</li>
                <li><strong>User-Generated Content:</strong> Short films, comments, ratings, and other content you upload or post.</li>
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, and location, operating system and platform, and other technology on the devices you use to access this platform.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website, products, and services, such as your viewing behavior and history.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              <p>
                We use the information we collect in the following ways:
              </p>
              <ul>
                <li>To create and manage your account.</li>
                <li>To provide, operate, and maintain our services, including displaying films and personalizing recommendations.</li>
                <li>To moderate content and ensure compliance with our terms of service.</li>
                <li>To communicate with you, including responding to your inquiries and sending important platform announcements.</li>
                <li>To improve our platform, services, and user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Data Sharing and Disclosure</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Your Data Rights</h2>
              <p>
                You have the right to access, modify, or delete your personal data. You can manage most of your information through your profile and settings pages. For complete data deletion or for requests you cannot fulfill yourself, please contact us at the email address provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Security Measures</h2>
              <p>
                The security of your data is important to us. We use a variety of security measures to maintain the safety of your personal information, including SSL encryption for data in transit and internal protocols for handling sensitive data. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at: <a href="mailto:privacy@laabidatefilms.com" className="text-primary hover:underline">privacy@laabidatefilms.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;