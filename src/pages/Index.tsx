import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Clapperboard, Share2, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  The Stage for Student Filmmakers
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover, share, and showcase short films from the next generation of creators. Exclusively for university students.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/signup">Join Now</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/explore">Explore Films</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  For Creators, By Creators
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We provide the tools and the stage for student filmmakers to shine.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Watch</CardTitle>
                  <Clapperboard className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore a library of short films from talented students.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Share</CardTitle>
                  <Share2 className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with other creators and share your favorite films.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-transparent border-0 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Submit</CardTitle>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get your film seen by a community of your peers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;