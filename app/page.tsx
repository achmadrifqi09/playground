import HeroSection from "@/components/landing/HeroSection";
import ToolShowcaseGrid from "@/components/landing/ToolShowcaseGrid";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <HeroSection />
      <ToolShowcaseGrid />
    </div>
  );
}
