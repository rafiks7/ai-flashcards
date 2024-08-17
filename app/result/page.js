"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getStripe from "@/utils/get-stripe";
import { CircularProgress, Container, Typography, Box, Button } from "@mui/material";

// color variables
const green_main = "#00ff00";
const green_dark = "#00be00";
const green_light = "#ccffbe";
const grey_dark = "#121212";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) {
        return;
      }
      try {
        const res = await fetch(
          `/api/checkout_session?session_id=${session_id}`
        );
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error);
        }
      } catch (err) {
        setError("An error occurred while fetching the session");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <Box bgcolor={grey_dark} minHeight="100vh" display="flex">
        <Container maxwidth="100vw" sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ textShadow: `0px 0px 10px ${green_main}`, color: "white" }}>Loading...</Typography>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bgcolor={grey_dark} minHeight="100vh" display="flex">
        <Container maxwidth="100vw" sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant="h6" sx={{ textShadow: `0px 0px 10px ${green_main}`, color: "white" }}>{error}</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box bgcolor={grey_dark} minHeight="100vh" display="flex">
      <Container maxwidth="100vw" sx={{ textAlign: "center", mt: 4 }}>
        {session.payment_status === "paid" ? (
          <>
            <Typography variant="h4" mt={10} p={0} sx={{ textShadow: `0px 0px 10px ${green_main}`, color: "white" }}>Thank you for brightening our day!</Typography>
            <Box sx={{ mt: 10 }}>
              <Typography variant="h6" sx={{ textShadow: `0px 0px 10px ${green_main}`, color: "white" }}>Session ID: {session_id}</Typography>
              <Typography variant="h6" sx={{ textShadow: `0px 0px 10px ${green_main}`, color: "white" }}>We have received your payment!</Typography>
              <Button
                  href="/generate"
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
                >
                  Generate Cards Now
                </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4">Payment Failed</Typography>
            <Box sx={{ mt: 22 }}>
              <Typography variant="body1">
                Your payment was not successful. Please try again.
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ResultPage;
