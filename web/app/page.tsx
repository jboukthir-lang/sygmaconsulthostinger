import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Partners from "@/components/Partners";
import GallerySection from "@/components/home/GallerySection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <Hero />
      <Partners />
      <About />
      <Stats />
      <Services />
      <WhyChooseUs />
      <Process />
      <GallerySection />
    </main>
  );
}
