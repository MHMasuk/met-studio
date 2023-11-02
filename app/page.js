import 'rsuite/dist/rsuite.min.css';

import Image from 'next/image'
import MainMap from "@/app/components/Maps/MainMap";
import LayerMap from "@/app/components/Maps/LayerMap";

export default function Home() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <main className="">
      <MainMap />
    </main>
  )
}
