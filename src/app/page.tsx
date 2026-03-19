import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { WhyAdMotion } from "@/components/sections/WhyAdMotion";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-w-0 overflow-x-hidden">
        <Hero />
        <Services />
        <Portfolio />
        <WhyAdMotion />
        <About />
        {/* Explicit band so About cards never sit flush on Let’s Talk (margin collapse safe) */}
        <div
          className="h-24 w-full bg-bg md:h-32 lg:h-40"
          aria-hidden
        />
        <Footer />
      </main>
    </>
  );
}
