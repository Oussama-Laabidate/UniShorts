import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Explore = () => {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Explore Films</h1>
        <div className="text-center text-muted-foreground mt-16">
          <p className="text-lg">Film gallery coming soon!</p>
          <p>This is where all the submitted short films will be displayed.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;