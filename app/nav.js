import { AppBar, Toolbar, Typography, Button } from "@mui/material"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
  return (
    <AppBar position="static" sx={{ mb : 4 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <a href="http://localhost:3000" >Flashcard SaaS</a>
        </Typography>
        <SignedOut>
          <Button color="inherit" href="/sign-in" passHref>Log in</Button>
          <Button color="inherit" href="/sign-up" passHref>Sign up</Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>
  )
}

