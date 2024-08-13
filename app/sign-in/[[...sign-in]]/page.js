import { Toolbar, Box, AppBar, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import "./signin.css";

export default function SignInPage() {
  return (
    <Container maxWidth="100vw">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h4" gutterBottom>
            Sign In
        </Typography>
        <SignIn />
      </Box>
    </Container>
  );
}
