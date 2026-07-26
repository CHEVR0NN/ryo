import Scene3DCanvas from "@/components/Scene3DCanvas";
import Hero from "@/components/Hero";
import MemoryGrid from "@/components/MemoryGrid";
import ReasonsGrid from "@/components/ReasonsGrid";
import DatePicker from "@/components/DatePicker";

export default function Home() {
  return (
    <div className="relative flex flex-col">
      <Scene3DCanvas />
      <Hero />
      <MemoryGrid />
      <ReasonsGrid />
      <DatePicker />
    </div>
  );
}
