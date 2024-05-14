"use client"
import Paper from "@mui/material/Paper"
import StopRouteSelector from "./StopRouteSelector"
import Search from "./Search"

const Sidebar = ({ isWaltti }: { isWaltti: boolean }) => {
  return (
    <Paper elevation={2} className="sidebar p-2">
      <Search isWaltti={isWaltti} />
      <StopRouteSelector />
    </Paper>
  )
}

export default Sidebar
