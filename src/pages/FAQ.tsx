import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

const faqItems = [
  {
    question: 'How do I create an account?',
    answer:
      "To create an account, click the 'Sign Up' button on the homepage. You will need a valid university email address (e.g., ending in .edu) to register. Fill out the required information, and you'll receive a confirmation email to verify your account.",
  },
  {
    question: 'I’m not a student, can I join?',
    answer:
      'Currently, our platform is exclusively for university students, faculty, and staff with a valid academic email address. This helps us maintain a focused community for student creators.',
  },
  {
    question: 'What kind of films are accepted?',
    answer:
      'We accept all genres of short films, including but not limited to drama, comedy, documentary, animation, experimental, and horror. The primary requirement is that the film was created by a student while they were enrolled in a university program.',
  },
  {
    question: 'How do I submit a film?',
    answer:
      "Once your account is approved, you will see an 'Upload Film' option in your user profile. You'll be guided through a form to provide details like the title, synopsis, category, and the video file itself.",
  },
  {
    question: 'Who approves the submissions?',
    answer:
      'All film submissions are reviewed by our curation team to ensure they meet our community guidelines and technical standards. This process helps maintain the quality of the content on our platform.',
  },
  {
    question: 'How can I report inappropriate content?',
    answer:
      "If you come across any content that violates our community guidelines, you can use the 'Report a Problem' link in the footer of any page. Please provide as much detail as possible so our moderation team can investigate.",
  },
  {
    question: 'What if I forget my password?',
    answer:
      "If you forget your password, go to the 'Login' page and click the 'Forgot your password?' link. You'll be prompted to enter your email address, and a password reset link will be sent to you.",
  },
];

const FAQ = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-muted-foreground">
              Can't find the answer you're looking for? Feel free to{' '}
              <Link to="/contact" className="text-primary underline">
                contact us
              </Link>
              .
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;