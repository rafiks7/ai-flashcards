"use client";

import { useUser } from "@clerk/nextjs";
import {
  Box,
  Container,
  Card,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  cardDocRef,
  writeBatch,
} from "firebase/firestore";

export default function Generate() {
  const { isLoaded, isSignedin, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    fetch("/api/generate", {
      method: "POST",
      body: text,
    })
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data);
      });
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashCards = async () => {
    if (!name) {
      alert("Please enter a name for your flashcards");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("You already have a collection with this name");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Generate Flashcards</Typography>
        <Paper sx={{ p: 4, width: "100%" }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter Text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
            placeholder="Enter text to generate flashcards. (Press ctrl + enter to submit)"
            onKeyDown={(event) => {
              if (event.key === "Enter" && event.ctrlKey) {
                handleSubmit();
              }
            }} // Listen for Enter key
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            {" "}
            Submit
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box
          sx={{
            mt: 4,
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            height: "100%", // Ensure parent has enough height to center vertically
            textAlign: "center", // Center text if needed
          }}
        >
          <Typography variant="h5" sx={{ mb: 4 }}>
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          width: "100%",
                          height: "200px",
                          position: "relative",
                          overflow: "hidden", // To prevent overflow of flipped content
                          "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                            
                          },
                          "& > div > div": {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                          },
                          "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: " center" }}>
            <Button variant="contained" color="secondary" onClick={handleOpen}>
              Save
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="collection name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashCards}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
