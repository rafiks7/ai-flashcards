"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
  FieldValue,
  query,
  orderBy,
  getDocs,
  writeBatch
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
  Box,
  Tooltip,
} from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// color variables
const green_main = "#00ff00";
const green_dark = "#00be00";
const green_light = "#ccffbe";
const grey_dark = "#121212";

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  async function deleteCollection(name) {
    const collectionRef = collection(db, 'users', user.id, name);
    const fcquery = query(collectionRef);

    return new Promise((resolve, reject) => {
      deleteQueryBatch(db, fcquery, resolve).catch(reject);
    });
  }

  async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await getDocs(query); // Use getDocs to execute the query

  if (snapshot.size === 0) {
      // When there are no documents left, we are done
      resolve();
      return;
    }
      
  
    // Delete documents in a batch
    const batch = writeBatch(db);
    console.log(snapshot.docs);
    snapshot.docs.forEach((doc) => {
      console.log(doc)
      batch.delete(doc.ref);
    });
    await batch.commit();
  
    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

  const handleDelete = async (name) => {
    
    const docRef = doc(collection(db, "users"), user.id);

    const docSnap = (await getDoc(docRef)).data();
    const fc = flashcards.filter((flashcard) => flashcard.name !== name);
    console.log(fc);

    await updateDoc(docRef, {
      flashcards: fc,
    });
    

    deleteCollection(name);
  };

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
  }, [user, handleDelete]);

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      backgroundColor={grey_dark}
    >
      <Typography
        variant="h4"
        color="white"
        textAlign="center"
        my={6}
        sx={{ textShadow: `0px 0px 10px ${green_main}` }}
      >
        Saved Lightsets
      </Typography>
      <Container maxWidth="100vw">
        <Grid
          container
          display="flex"
          justifyContent="center"
          spacing={3}
          sx={{ mt: 4 }}
        >
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  boxShadow: `0px 0px 25px ${green_main}`,
                  transition: "500ms",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: `0px 0px 25px ${green_main}`,
                  },
                }}
              >
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h6" overflow='auto' minHeight='50px'>{flashcard.name}</Typography>
                    <Tooltip
                      title="Delete"
                      arrow
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                      }}
                    >
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the card click event
                          handleDelete(flashcard.name);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
