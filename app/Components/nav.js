import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { styled } from "@mui/material/styles"
import Link from "next/link";
import Image from "next/image"

import "../globals.css"
import logo from "../public/logo.jpg"

// color variables
const green_main = "#00ff00";
const green_dark = "#00be00";
const green_light = "#ccffbe";
const grey_dark = "#121212";

function NavButton(props) {
  const {children, sx_button, href} = props
  return (
    <Box sx={sx_button} borderRadius="13px" boxShadow={`0px 0px 10px ${green_main}`}>
      <Button
      color="inherit" 
      href={href}
      sx={{
        transition: "200ms",
        '&:hover': {
          borderRadius: "13px",
          boxShadow: `0px 0px 10px ${green_main}`,
        }
      }}
      >
        {children}
      </Button>
    </Box>
  )
}

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{bgcolor: grey_dark, boxShadow: `0px 0px 10px ${green_main}`}}>
        <Box display="flex" alignItems="center" flexGrow={1} >
          <a href="https://ai-flashcards-pi.vercel.app/"><Image src={logo} alt="Logo" width={50} height={50} /></a>
        </Box>
        <SignedOut>
          <NavButton href="/sign-in" sx_button={{mr: 2}}>Sign in</NavButton>
          <NavButton href="/sign-up">Sign Up</NavButton>
        </SignedOut>
        <SignedIn>
          <NavButton href="/flashcards" sx_button={{mr: 2}}>Saved Cards</NavButton>
          <NavButton href="/generate" sx_button={{mr: 2}}>Generate</NavButton>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  )
}

