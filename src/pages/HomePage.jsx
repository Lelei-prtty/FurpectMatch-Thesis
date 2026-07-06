import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WhyChoose from "../components/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="bg-gradient-to-br from-white via-white to-[#CACACA]/20 overflow-hidden">
        <Hero />
        <WhyChoose />
      </main>

      <Footer />
    </>
  );
}