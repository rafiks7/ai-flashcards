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
import LanguageIcon from '@mui/icons-material/Language';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PsychologyIcon from '@mui/icons-material/Psychology';

// color variables
const green_main = "#00ff00"
const green_dark = "#00be00"
const green_light = "#ccffbe"
const dark_grey = "#121212"

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
    <Box bgcolor="#121212" minHeight="100vh" display="flex">
      <Container maxWidth="100vw">
        <Head>
          <title>Flashcard SaaS</title>
          <meta
            name="description"
            content="AI-generated educational flashcards"
          />
        </Head>
        <Box
          height="100vh"
          display="flex" 
          flexDirection="column"
          alignItems="center"
          sx={{
            textAlign:"center", 
            mt:10 
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ p:0, textShadow: `0px 0px 10px ${green_main}`, color: "white"}}>
            Welcome To
          </Typography>
          <Box 
            sx = {{
              position: "relative",
              width: "50vw",
              height: "20vh",
              border: `2px solid ${green_main}`,
              mb: 5
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ p:4, textShadow: `0px 0px 10px ${green_main}`, color: "white"}}>
              Flashcard Factory
            </Typography>
            <Box
              sx = {{
                position: "absolute",
                top: 5,
                left: 5,
                width: "50vw",
                height: "20vh",
                border: `2px solid ${green_main}`

              }}
            >
            </Box>
          </Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, textShadow: `0px 0px 10px ${green_main}`, color: "white"}}>
            text → flashcards
          </Typography>
          <SignedIn>
            <Button 
              sx={{
                mt: 2, 
                border: "1px solid white",
                bgcolor: green_light,
                p: "10px",
                boxShadow: `0px 0px 10px ${green_main}`,
                '&:hover': {
                  bgcolor: green_main,
                  transform: "scale(1.1)",
                  boxShadow: `0px 0px 30px ${green_main}`,
                  transition: '200ms',
                }
              }} 
              href="/generate"
            >
              <Typography color="black" sx={{ fontSize: "large", textShadow: `0px 0px 10px ${green_main}` }}>Get Started</Typography>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              sx={{
                mt: 2, 
                border: "1px solid white",
                bgcolor: green_light,
                p: "10px",
                boxShadow: `0px 0px 10px ${green_main}`,
                '&:hover': {
                  bgcolor: green_light,
                  transform: "scale(1.1)",
                  boxShadow: `0px 0px 30px ${green_main}`,
                  transition: '200ms',
                }
              }} 
                href="/sign-up"
            >
              <Typography color="black" sx={{ fontSize: "large", textShadow: `0px 0px 10px ${green_main}` }}>Get Started</Typography>
            </Button>
          </SignedOut>
        </Box>
        <Box sx={{ textAlign: "center", mb: 25 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mb: 8,
              textShadow: `0px 0px 10px ${green_main}`,
              color: "white",
            }}
            gutterBottom
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <AutoFixHighIcon sx={{ fontSize: 60, color: "white", mb:2}}/>
              <Typography variant="h5" sx={{ mb: 3, color: "white"}} gutterBottom>
                Simple Text Input
              </Typography>
              <Typography color="white">
                {" "}
                Instantly convert text into interactive flashcards with our AI.
                Save time and enhance your study sessions effortlessly!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <PsychologyIcon sx={{ fontSize: 60, color: "white", mb:2}}/>
              <Typography variant="h5" sx={{ mb: 3, color: "white"}} gutterBottom>
                Smart Flashcards
              </Typography>
              <Typography color="white">
                {" "}
                Our AI generates flashcards that adapt to your learning style. The
                more you study, the smarter the flashcards become!
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <LanguageIcon sx={{ fontSize: 60, color: "white", mb:2}}/>
              <Typography variant="h5" sx={{ mb: 3, color: "white"}} gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography color="white">
                {" "}
                Study on the go with our mobile-friendly web app. Access your
                flashcards anytime, anywhere, and on any device!
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ textAlign: "center", my: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ mb: 8, textShadow: `0px 0px 10px ${green_main}`, color: "white" }}
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
                  boxShadow: `0px 0px 10px ${green_main}`
                }}
              >
                <Typography variant="h4" gutterBottom color="white">
                  Basic
                </Typography>
                <Typography variant="h5" gutterBottom color="white">
                  $5 / month
                </Typography>
                <Typography gutterBottom color="white">
                  {" "}
                  Access to basic flashcard features and limited storage
                </Typography>
                <Button
                  sx={{
                    mt: 2, 
                    border: "1px solid white",
                    color: green_light,
                    fontSize: "medium",
                    p: "10px",
                    textShadow: "0px 0px 10px white",
                    boxShadow: `0px 0px 10px ${green_main}`,
                    transition: '200ms',
                    ':hover': {
                      transform: "scale(1.1)",
                      boxShadow: `0px 0px 20px ${green_main}`
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
                  boxShadow: `0px 0px 10px ${green_main}`
                }}
              >
                <Typography variant="h4" gutterBottom color="white">
                  Pro
                </Typography>
                <Typography variant="h5" gutterBottom color="white">
                  $10 / month
                </Typography>
                <Typography gutterBottom color="white">
                  {" "}
                  Unlimited flashcards and storage, with priority support
                </Typography>
                <Button
                  sx={{
                    mt: 2, 
                    border: "1px solid white",
                    color: green_light,
                    fontSize: "medium",
                    p: "10px",
                    textShadow: `0px 0px 10px ${green_main}`,
                    boxShadow: `0px 0px 10px ${green_main}`,
                    transition: '200ms',
                    ':hover': {
                      transform: "scale(1.1)",
                      boxShadow: `0px 0px 20px ${green_main}`
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