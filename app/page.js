'use client';

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import Head from "next/head";
import "./globals.css";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSessionJson.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });


    if (error) {
      console.warn(error.message);
    }
  };

  return (
    <Box bgcolor="#121212">
      <Container maxWidth="100vw">
        <Head>
          <title>Flashcard SaaS</title>
          <meta
            name="description"
            content="AI-generated educational flashcards"
          />
        </Head>

        {/* <AppBar position="static">
          <Toolbar sx={{ bgcolor: "#5A5A5A"}}>
            <Typography variant="h6" style={{ flexGrow: 1, fontWeight: "bold"}}>
              Flashcard Factory
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Log in
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </Toolbar>
        </AppBar> */}
        <Box sx={{ textAlign: "center", my:0 }}>
          <Typography variant="h2" gutterBottom sx={{ p:4, textShadow: "0px 0px 10px #00FF00 ", color: "#FFFFFF"}}>
            Welcome to Flashcard Factory
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, textShadow: "0px 0px 10px #00FF00 ", color: "#FFFFFF"}}>
            text → flashcards
          </Typography>
          <SignedIn>
            <Button 
              sx={{
                mt: 2, 
                border: "1px solid white",
                bgcolor: "#98ff98",
                color: "black",
                fontSize: "large",
                p: "10px",
                textShadow: "0px 0px 10px #00FF00",
                boxShadow: "0px 0px 10px #00FF00",
                '&:hover': {
                  color: "#98ff98",
                  boxShadow: "0px 0px 30px #00FF00",
                }
              }} 
              href="/generate"
            >
              Get Started
            </Button>
          </SignedIn>
          <SignedOut>
            <Button 
              sx={{
                mt: 2, 
                border: "1px solid white",
                bgcolor: "#98ff98",
                color: "black",
                fontSize: "large",
                p: "10px",
                textShadow: "0px 0px 10px #00FF00",
                boxShadow: "0px 0px 10px #00FF00",
                '&:hover': {
                  color: "#98ff98",
                  boxShadow: "0px 0px 30px #00FF00",
                }
              }} 
              href="/sign-up">
              Get Started
            </Button>
          </SignedOut>
        </Box>
        <Box sx={{ textAlign: "center", my: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 8, fontWeight: "bold", textShadow: "0px 0px 10px #00FF00", color: "#FFFFFF"}}
            gutterBottom
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3, color: "#FFFFFF"}} gutterBottom>
                Simple Text Input
              </Typography>
              <Typography color="#FFFFFF">
                {" "}
                Instantly convert text into interactive flashcards with our AI.
                Save time and enhance your study sessions effortlessly!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3, color: "#FFFFFF"}} gutterBottom>
                Smart Flashcards
              </Typography>
              <Typography color="#FFFFFF">
                {" "}
                Our AI generates flashcards that adapt to your learning style. The
                more you study, the smarter the flashcards become!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3, color: "#FFFFFF"}} gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography color="#FFFFFF">
                {" "}
                Study on the go with our mobile-friendly web app. Access your
                flashcards anytime, anywhere, and on any device!
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ textAlign: "center", my: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 8, fontWeight: "bold", textShadow: "0px 0px 10px #00FF00", color: "#FFFFFF" }}
          >
            Pricing
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  mb: 10,
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  boxShadow: "0px 0px 10px #00FF00"
                }}
              >
                <Typography variant="h4" gutterBottom color="#FFFFFF">
                  Basic
                </Typography>
                <Typography variant="h5" gutterBottom color="#FFFFFF">
                  $5 / month
                </Typography>
                <Typography gutterBottom color="#FFFFFF">
                  {" "}
                  Access to basic flashcard features and limited storage
                </Typography>
                <Button
                  sx={{
                    mt: 2, 
                    border: "1px solid white",
                    color: "#98FF98",
                    fontSize: "medium",
                    p: "10px",
                    textShadow: "0px 0px 10px #00FF00",
                    boxShadow: "0px 0px 10px #00FF00",
                    ':hover': {
                      transform: "scale(1.1)",
                      boxShadow: "0px 0px 20px #00FF00"
                    }
                  }} 
                >
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  mb: 10,
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  boxShadow: "0px 0px 10px #00FF00"
                }}
              >
                <Typography variant="h4" gutterBottom color="#FFFFFF">
                  Pro
                </Typography>
                <Typography variant="h5" gutterBottom color="#FFFFFF">
                  $10 / month
                </Typography>
                <Typography gutterBottom color="#FFFFFF">
                  {" "}
                  Unlimited flashcards and storage, with priority support
                </Typography>
                <Button
                  sx={{
                    mt: 2, 
                    border: "1px solid white",
                    color: "#98FF98",
                    fontSize: "medium",
                    p: "10px",
                    textShadow: "0px 0px 10px #00FF00",
                    boxShadow: "0px 0px 10px #00FF00",
                    ':hover': {
                      transform: "scale(1.1)",
                      boxShadow: "0px 0px 20px #00FF00"
                    }
                  }} 
                  onClick={handleSubmit}
                >
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}