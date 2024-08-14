"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Card,
  Button,
  Typography,
  Grid,
  CardActionArea,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState();
  const [newBackContent, setNewBackContent] = useState(selectedFlashcard?.back);

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, "users"), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];

      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });

      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [user, search]);

  useEffect( () => {
    if (selectedFlashcard) {
      setNewBackContent(selectedFlashcard.back);
    }
  }, [selectedFlashcard])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "users", user.id, search, id);
      await deleteDoc(docRef);
      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleEdit = async (id) => {
    console.log(newBackContent);
    try {
      const docRef = doc(db, "users", user.id, search, id);
      await updateDoc(docRef, {
        back: newBackContent,
      });
      setFlashcards((prev) =>
        prev.map((flashcard) =>
          flashcard.id === id ? { ...flashcard, back: newBackContent } : flashcard
        )
      );
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card sx={{ position: "relative" }}>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      width: "100%",
                      height: "200px",
                      position: "relative",
                      overflow: "hidden",
                      "& > div": {
                        transition: "transform 0.6s",
                        transformStyle: "preserve-3d",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        transform: flipped[flashcard.id]
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
              <Tooltip
                title="Edit"
                arrow
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => {
                    setDialogOpen(true);
                    setSelectedFlashcard(flashcard);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
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
                  onClick={() => handleDelete(flashcard.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Answer"
            multiline
            rows={4}
            type="text"
            fullWidth
            value={newBackContent}
            onChange={(e) => setNewBackContent(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEdit(selectedFlashcard.id);
              handleClose();
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
