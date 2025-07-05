import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const teamMembers = [
  {
    name: 'Laabidate',
    role: 'Founder & CEO',
    bio: 'The visionary behind the platform, passionate about empowering the next generation of filmmakers.',
    avatar: 'https://github.com/shadcn.png',
    initials: 'LA'
  },
  {
    name: 'Jane Doe',
    role: 'Lead Developer',
    bio: 'Building the technology that brings student films to the world.',
    avatar: '/placeholder.svg',
    initials: 'JD'
  },
  {
    name: 'John Smith',
    role: 'Community Manager',
    bio: 'Fostering a vibrant and supportive community for creators.',
    avatar: '/placeholder.svg',
    initials: 'JS'
  },
];

const About = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              About Laabidate Films
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              The stage for the next generation of storytellers.
            </p>
          </div>
        </section>

        <section id="mission" className="w-full py-12 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                To empower student filmmakers by providing a dedicated platform to showcase their work, connect with peers, and gain visibility in a competitive industry. We believe every story matters and every creator deserves a chance to be seen.
              </p>
            </div>
            <div className="flex justify-center">
              <img src="https://images.unsplash.com/photo-1574717519105-6203e9615904?q=80&w=2070&auto=format&fit=crop" alt="Mission" className="rounded-lg object-cover aspect-video" />
            </div>
          </div>
        </section>

        <section id="story" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center order-last md:order-first">
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop" alt="Story" className="rounded-lg object-cover aspect-video" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Story</h2>
              <p className="text-muted-foreground text-lg">
                Laabidate Films was born from a simple observation: countless brilliant short films are created in university programs every year, but they often remain unseen outside of classroom critiques. We wanted to change that. We built this platform to solve the discovery problem for student creators and film enthusiasts alike.
              </p>
            </div>
          </div>
        </section>

        <section id="team" className="w-full py-12 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet the Team</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed">
                We are a small, dedicated team of film lovers, tech enthusiasts, and community builders.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader className="items-center">
                    <Avatar className="w-24 h-24 mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle>{member.name}</CardTitle>
                    <p className="text-primary font-semibold">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="w-full py-12 md:py-24">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join Our Community</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl mt-4">
              Whether you're a creator, a film enthusiast, or a potential partner, we'd love to hear from you.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;