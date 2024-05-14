"use client"
import dynamic from "next/dynamic"
import Sidebar from "../../components/Sidebar"
const Map = dynamic(() => import("../../components/Map"), { ssr: false })

const Page = () => {
  return (
    <main>
      <div className="layout">
        <Map />
        <Sidebar isWaltti={true} />
      </div>
    </main>
  )
}

export default Page
