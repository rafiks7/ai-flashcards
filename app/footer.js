import { Box, Typography, BottomNavigation } from "@mui/material"
import "./globals.css"

// color variables
const green_main = "#00ff00"
const green_dark = "#00be00"
const green_light = "#ccffbe"
const grey_dark = "#121212"

export default function Footer() {
  return (
    <BottomNavigation sx={{ width: "100%", backgroundColor: grey_dark, textAlign: 'center', boxShadow: `0px 0px 20px ${green_main}`}}>
      <Typography variant="h6" color='white' flexGrow={1} py={2} sx={{ textShadow: `0px 0px 10px ${green_main}` }}>
        <a href="http://localhost:3000" >Flashcard Factory</a>
      </Typography>
    </BottomNavigation>
  )
}

