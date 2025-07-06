import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            Terms of Service
          </h1>
          
          <div className="space-y-8 prose prose-invert max-w-none">
            <section>
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Laabidate Films (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Platform. We may modify these Terms at any time, and such modifications shall be effective immediately upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">2. User Responsibilities</h2>
              <p>
                You are solely responsible for the content you upload, post, or otherwise transmit via the Platform. You agree to:
              </p>
              <ul>
                <li>Only upload films and other content for which you own the copyright or have obtained all necessary permissions and licenses.</li>
                <li>Not post content that is illegal, obscene, defamatory, threatening, infringing of intellectual property rights, invasive of privacy, or otherwise injurious to third parties.</li>
                <li>Ensure that your content does not contain software viruses, political campaigning, commercial solicitation, or any form of "spam."</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">3. Account Conduct</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. You must not misuse the Platform by knowingly introducing viruses, trojans, worms, or other material that is malicious or technologically harmful.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">4. Content Ownership and Licenses</h2>
              <p>
                You retain all of your ownership rights in the content you submit to the Platform. However, by submitting content to the Platform, you grant Laabidate Films a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with the service provided by the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">5. Platform Rights</h2>
              <p>
                Laabidate Films reserves the right, but not the obligation, to:
              </p>
              <ul>
                <li>Remove or refuse to post any user content for any or no reason in our sole discretion.</li>
                <li>Take any action with respect to any user content that we deem necessary or appropriate in our sole discretion, including if we believe that such content violates the Terms of Service.</li>
                <li>Terminate or suspend your access to all or part of the Platform for any or no reason, including without limitation, any violation of these Terms of Service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
              <p>
                In no event will Laabidate Films, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Platform, any websites linked to it, any content on the Platform, or such other websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">7. Changes to Terms</h2>
              <p>
                We reserve the right to revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the Platform following the posting of revised Terms of Service means that you accept and agree to the changes.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;