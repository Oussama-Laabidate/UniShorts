import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Supporter',
    price: '3€',
    description: 'For the casual film lover who wants to help out.',
    features: ['Access to supporter-only updates', 'Your name in our supporters list'],
  },
  {
    name: 'Patron',
    price: '5€',
    description: 'For those who want to be more involved in our community.',
    features: ['All Supporter perks', 'Early access to selected films', 'A special badge on your profile'],
    popular: true,
  },
  {
    name: 'Producer',
    price: '10€',
    description: 'For dedicated supporters who want to make a real impact.',
    features: ['All Patron perks', 'Priority for your film submissions', 'Vote on community choice awards'],
  },
];

const Donation = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 text-center">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Support Student Filmmaking
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Your contribution helps us maintain the platform, support student creators, and foster a vibrant community for the next generation of storytellers.
            </p>
          </div>
        </section>

        {/* Subscription Tiers */}
        <section id="tiers" className="w-full py-12 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Become a Monthly Supporter</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Choose a tier that works for you and get exclusive perks as a thank you.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier) => (
                <Card key={tier.name} className={tier.popular ? 'border-primary' : ''}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div className="text-4xl font-bold pt-4">{tier.price}<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full">Choose {tier.name}</Button>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* One-time Donation */}
        <section id="one-time-donation" className="w-full py-12 md:py-24">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Make a One-Time Donation</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
              Every little bit helps. Use one of our secure payment methods to make a single contribution.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button size="lg" variant="outline">Donate with PayPal</Button>
              <Button size="lg">Donate with Stripe</Button>
            </div>
          </div>
        </section>
        
        {/* Transparency */}
        <section id="transparency" className="w-full py-12 md:py-24 bg-card/50">
            <div className="container text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Transparency</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
                    We believe in being open about how we use your contributions.
                </p>
                <div className="mt-6">
                    <Button asChild variant="link">
                        <a href="#">Learn more about how donations are used</a>
                    </Button>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Donation;