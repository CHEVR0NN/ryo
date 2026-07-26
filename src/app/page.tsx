import Scene3DCanvas from "@/components/Scene3DCanvas";
import PolaroidPrinter from "@/components/PolaroidPrinter";

// Hero, ReasonsGrid, DatePicker temporarily left out of the page while we
// focus on the polaroid camera feature and the 3D background mood together.
export default function Home() {
  return (
    <div className="relative flex flex-col">
      <Scene3DCanvas />
      <PolaroidPrinter />
    </div>
  );
}
