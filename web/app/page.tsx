import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Partners from "@/components/Partners";
import GallerySection from "@/components/home/GallerySection";
import SmartFeatures from "@/components/SmartFeatures";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <Hero />
      <Partners />
      <About />
      <SmartFeatures />
      <Services />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <FAQ />
      <Process />
      <GallerySection />
      <Newsletter />
    </main>
  );
}
