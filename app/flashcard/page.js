"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
import {
  doc,
  getDoc,
  collection,
  setDoc,
  cardDocRef,
  writeBatch,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// color variables
const green_main = "#00ff00";
const green_dark = "#00be00";
const green_light = "#ccffbe";
const grey_dark = "#121212";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcards, setNewFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState();
  const [newBackContent, setNewBackContent] = useState(selectedFlashcard?.back);
  const [userInput, setUserInput] = useState("");

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFlashcards = async () => {
    if (!search || !user) return;
    const colRef = await collection(
      doc(collection(db, "users"), user.id),
      search
    );
    const docs = await getDocs(colRef);
    const flashcards = [];

    docs.forEach((doc) => {
      flashcards.push({ id: doc.id, ...doc.data() });
    });

    await setFlashcards(flashcards);
  };

  useEffect(() => {
    getFlashcards();
  }, [user, search]);

  useEffect(() => {
    if (selectedFlashcard) {
      setNewBackContent(selectedFlashcard.back);
    }
  }, [selectedFlashcard]);

  const updateFlashcards = async () => {
    const colRef = collection(doc(collection(db, "users"), user.id), search);
    const batch = writeBatch(db);

    newFlashcards.forEach((flashcard) => {
      const docRef = doc(colRef); // This targets the specific document within the existing collection
      batch.set(docRef, flashcard, { merge: true }); // Use merge: true to add to existing documents
    });

    await batch.commit();
  };

  const handleSubmit = async () => {
    fetch("/api/generate", {
      method: "POST",
      body: userInput,
    })
      .then((res) => res.json())
      .then((data) => {
        setNewFlashcards(data);
      });
  };

  // This useEffect will run whenever `newFlashcards` is updated
  useEffect(() => {
    if (newFlashcards.length > 0) {
      // Update flashcards in the database
      updateFlashcards().then(() => {
        // Fetch updated flashcards from the database
        getFlashcards();
      });
    }
  }, [newFlashcards]);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "users", user.id, search, id);
      await deleteDoc(docRef);
      setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleEditOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleAddOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
  };

  const handleEdit = async (id) => {
    try {
      const docRef = doc(db, "users", user.id, search, id);
      await updateDoc(docRef, {
        back: newBackContent,
      });
      setFlashcards((prev) =>
        prev.map((flashcard) =>
          flashcard.id === id
            ? { ...flashcard, back: newBackContent }
            : flashcard
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
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      backgroundColor={grey_dark}
    >
      <Container maxWidth="100vw">
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%", // Ensure the Card takes full height of the Grid item
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e0e0e0",
                cursor: "pointer",
                transition: "background-color 0.3s, transform 0.3s",
                "&:hover": {
                  backgroundColor: "#d5d5d5",
                  transform: "scale(1.02)",
                },
                "&:active": {
                  backgroundColor: "#c0c0c0",
                },
              }}
              onClick={handleAddOpen} // Replace with your actual function
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h2"
                  component="div"
                  sx={{ color: "#007bff" }}
                >
                  +
                </Typography>
                <Typography variant="h6" component="div" sx={{ marginTop: 1 }}>
                  Add Lightcards
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {flashcards.map((flashcard) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <Card
                sx={{
                  position: "relative",
                  boxShadow: `0px 0px 25px ${green_main}`,
                  transition: "500ms",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: `0px 0px 25px ${green_main}`,
                  },

                  
                }}
              >
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
                      setEditDialogOpen(true);
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
        <Dialog
          open={editDialogOpen}
          onClose={handleEditClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Lightcard</DialogTitle>
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
            <Button onClick={handleEditClose} color="success">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleEdit(selectedFlashcard.id);
                handleEditClose();
              }}
              color="success"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={addDialogOpen}
          onClose={handleAddClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Lightcards</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Add"
              placeholder="Tell our AI what kind of flashcards you want to add!"
              multiline
              rows={3}
              type="text"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} color="success">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
                handleAddClose();
              }}
              color="success"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
