import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ChoosePath from "@/components/ChoosePath";
import WhatWeDo from "@/components/WhatWeDo";
import Outcomes from "@/components/Outcomes";
import TransformationLab from "@/components/TransformationLab";
import TransformationStudio from "@/components/TransformationStudio";
import About from "@/components/About";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <ChoosePath />
        <WhatWeDo />
        <Outcomes />
        <TransformationLab />
        <TransformationStudio />
        <About />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
