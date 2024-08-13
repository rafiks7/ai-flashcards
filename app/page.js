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
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcard SaaS</title>
        <meta
          name="description"
          content="AI-generated educational flashcards"
        />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
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
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box className="background">
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h2" gutterBottom>
            Welcome to Flashcard Factory
          </Typography>
          <Typography variant="h4" sx={{ mb: 4 }} gutterBottom>
            text → flashcards
          </Typography>
          <SignedIn>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/generate">
              Get Started
            </Button>
          </SignedIn>
          <SignedOut>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/sign-up">
              Get Started
            </Button>
          </SignedOut>
        </Box>
        <Box sx={{ textAlign: "center", my: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 8, fontWeight: "bold" }}
            gutterBottom
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3 }} gutterBottom>
                Simple Text Input
              </Typography>
              <Typography>
                {" "}
                Instantly convert text into interactive flashcards with our AI.
                Save time and enhance your study sessions effortlessly!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3 }} gutterBottom>
                Smart Flashcards
              </Typography>
              <Typography>
                {" "}
                Our AI generates flashcards that adapt to your learning style. The
                more you study, the smarter the flashcards become!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3 }} gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography>
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
            sx={{ mb: 8, fontWeight: "bold" }}
          >
            Pricing
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h5" gutterBottom>
                  $5 / month
                </Typography>
                <Typography gutterBottom>
                  {" "}
                  Access to basic flashcard features and limited storage
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Choose Basic
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h5" gutterBottom>
                  $10 / month
                </Typography>
                <Typography gutterBottom>
                  {" "}
                  Unlimited flashcards and storage, with priority support
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                  Choose Pro
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
