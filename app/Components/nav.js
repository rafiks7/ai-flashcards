import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { styled } from "@mui/material/styles"
import Link from "next/link";

import "../globals.css"

// color variables
const green_main = "#00ff00";
const green_dark = "#00be00";
const green_light = "#ccffbe";
const grey_dark = "#121212";

function NavButton(props) {
  const {children, sx_button, href} = props
  return (
    <Box sx={sx_button} borderRadius='13px' boxShadow={`0px 0px 10px ${green_main}`}>
      <Button
      color="inherit" 
      href={href}
      sx={{
        transition: '200ms',
        '&:hover': {
          borderRadius: '13px',
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
        <Typography 
          variant="h6" 
          sx={{
            flexGrow: 1, 
            textShadow: `0px 0px 10px ${green_main}`,
            transition: "200ms",
            '&:hover': {
              textShadow: `0px 0px 30px ${green_main}`,
            }
          }}>
          <a href="http://localhost:3000">Flashcard Factory</a>
        </Typography>
        <SignedOut>
          <NavButton href='/sign-in' sx_button={{mr: 2}}>Sign in</NavButton>
          <NavButton href='/sign-up'>Sign Up</NavButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  )
}

