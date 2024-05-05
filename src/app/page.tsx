"use client"
import dynamic from "next/dynamic"
import Sidebar from "./Sidebar"
const Map = dynamic(() => import("./Map"), { ssr: false })

const Page = () => {
  return (
    <main>
      <div className="layout">
        <Map />
        <Sidebar />
      </div>
    </main>
  )
}

export default Page
