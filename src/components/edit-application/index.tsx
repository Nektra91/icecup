import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Application } from "../../models/interfaces";

const EditApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const application = location.state?.app;
  const competitionId = location.state.competitionId;

  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState(application?.teamName || "");
  const [memberName, setMemberName] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>(application?.teamMembers || []);
  const [nationality, setNationality] = useState("");
  const [nationalities, setNationalities] = useState<string[]>(application?.nationalities || []);
  const [curlingClub, setCurlingClub] = useState("");
  const [curlingsClubs, setCurlingsClubs] = useState<string[]>(application?.curlingsClubs || []);

  const handleAddMember = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (memberName) {
      setTeamMembers([...teamMembers, memberName]);
      setMemberName("");
    }
  };

  const handleRemoveMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleAddNationality = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (nationality) {
      setNationalities([...nationalities, nationality]);
      setNationality("");
    }
  };

  const handleRemoveNationality = (index: number) => {
    setNationalities(nationalities.filter((_, i) => i !== index));
  };

  const handleAddCurlingClub = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (curlingClub) {
      setCurlingsClubs([...curlingsClubs, curlingClub]);
      setCurlingClub("");
    }
  };

  const handleRemoveCurlingClub = (index: number) => {
    setCurlingsClubs(curlingsClubs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const competitionRef = doc(db, "competitions", competitionId);
      const compDoc = await getDoc(competitionRef);
      const applications =
        (compDoc?.data?.()?.applications as Application[]) || [];
      const applicationToUpdate = applications.find((app) => app.id === application.id);

      if (applicationToUpdate) {
        await updateDoc(competitionRef, {
          applications: applications.map((updatedApp) =>
            updatedApp.id === application.id ? { ...updatedApp, accepted: true, curlingsClubs: curlingsClubs, nationalities: nationalities, teamMembers: teamMembers, teamName: teamName } : updatedApp
          ),
        });
      }
      navigate("/applications");
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {loading ? (
        <Box display="flex" justifyContent="center" m={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Edit Application
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                margin="normal"
              />
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Team Member Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
                <Button onClick={handleAddMember} variant="contained" sx={{ mt: 1 }}>
                  Add Member
                </Button>
                <List>
                  {teamMembers.map((member, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(index)}>
                          <ClearIcon color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={member} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
                <Button onClick={handleAddNationality} variant="contained" sx={{ mt: 1 }}>
                  Add Nationality
                </Button>
                <List>
                  {nationalities.map((nat, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveNationality(index)}>
                          <ClearIcon color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={nat} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Curling Club"
                  value={curlingClub}
                  onChange={(e) => setCurlingClub(e.target.value)}
                />
                <Button onClick={handleAddCurlingClub} variant="contained" sx={{ mt: 1 }}>
                  Add Curling Club
                </Button>
                <List>
                  {curlingsClubs.map((club, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveCurlingClub(index)}>
                          <ClearIcon color="error" />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={club} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb: 2 }}>
                Update Application
              </Button>
            </form>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default EditApplication;