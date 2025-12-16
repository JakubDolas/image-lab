import Hero from "./Hero";
import Features from "./Features";
import EditorShowcase from "./EditorShowcase";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1300px] px-6 pb-32">
      <Hero />
      <Features />
      <EditorShowcase />
      <HowItWorks />
      <CTA />
    </div>
  );
}
