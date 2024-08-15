"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import {
  CardActionArea,
  CardContent,
  Card,
  Container,
  Grid,
  Typography,
  Box
} from "@mui/material";

// color variables
const green_main = "#00ff00";
const green_dark = "#00be00";
const green_light = "#ccffbe";
const grey_dark = "#121212";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);
          
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];

        setFlashcards(docSnap.data().flashcards);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }

    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" backgroundColor={grey_dark}>
      <Typography variant="h4" color='white' textAlign="center" my={6} sx={{textShadow: `0px 0px 10px ${green_main}`}}>Saved Flashcards</Typography>
      <Container maxWidth="100vw">
        <Grid container display='flex' justifyContent="center" spacing={3} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{
                  boxShadow: `0px 0px 25px ${green_main}`,
                  transition: '500ms',
                  '&:hover': {
                    transform: "scale(1.02)",
                    boxShadow: `0px 0px 25px ${green_main}`,
                  }
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h6" overflow='auto' minHeight='50px'>{flashcard.name}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
