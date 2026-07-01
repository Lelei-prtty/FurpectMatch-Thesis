import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import WhyChoose from "../components/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="bg-gradient-to-br from-white via-purple-50 to-purple-100 overflow-hidden">
        <Hero />
        <WhyChoose />
      </main>

      <Footer />
    </>
  );
}