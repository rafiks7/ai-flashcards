import { Toolbar, Box, AppBar, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import "./signup.css";

export default function SignUpPage() {
  return (
    <Container maxWidth="100vw">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h4" gutterBottom>
            Sign Up
        </Typography>
        <SignUp />
      </Box>
    </Container>
  );
}
