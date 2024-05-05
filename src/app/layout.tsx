import type { Metadata } from "next"
import "./styles.css"
import "leaflet/dist/leaflet.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

export const metadata: Metadata = {
  title: "Hösseli - HSL Open Data Visualizer",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
