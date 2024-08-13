import { Toolbar, Box, AppBar, Container, Typography, Button } from "@mui/material";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import "./signup.css";

export default function SignUpPage() {
  return (
    <Box bgcolor="#121212" height="100vh">
      <Container maxWidth="100vw">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Typography variant="h4" gutterBottom sx={{ mt: 4, color: "white", textShadow: "0px 0px 10px #00FF00", fontWeight: "bold"}}>
            Sign Up
          </Typography>
          <Box borderRadius="3%" sx={{ boxShadow: "0px 0px 20px #00FF00" }}>
            <SignUp />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
