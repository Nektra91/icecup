import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  query,
  where,
  getDocs,
  collection,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Competition } from "../../models/interfaces";
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
} from "@mui/material";

const Apply = () => {
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [nationality, setNationality] = useState("");
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [curlingClub, setCurlingClub] = useState("");
  const [curlingsClubs, setCurlingsClubs] = useState<string[]>([]);
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");
  const [activeCompetitions, setActiveCompetitions] = useState<Competition[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveCompetitions = async () => {
      setLoading(true);
      const q = query(
        collection(db, "competitions"),
        where("isActive", "==", true)
      );
      const querySnapshot = await getDocs(q);
      const competitions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          applications: data.applications || [],
          curlingsClubs: data.curlingsClubs || [],
          waitingList: data.waitingList || [],
        } as Competition;
      });
      setActiveCompetitions(competitions.length > 0 ? [competitions[0]] : []);
      setLoading(false);
    };

    fetchActiveCompetitions();
  }, []);

  const handleAddMember = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (memberName) {
      setTeamMembers([...teamMembers, memberName]);
      setMemberName("");
    }
  };

  const handleAddNationality = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (nationality) {
      setNationalities([...nationalities, nationality]);
      setNationality("");
    }
  };

  const handleAddCurlingClub = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (curlingClub) {
      setCurlingsClubs([...curlingsClubs, curlingClub]);
      setCurlingClub("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeCompetitions.length === 0) {
      alert("No active competition available.");
      return;
    }

    const competitionId = activeCompetitions[0].id;
    const competitionRef = doc(db, "competitions", competitionId);

    const applicationData = {
      teamName,
      teamMembers,
      nationalities,
      curlingsClubs,
      responsibleName,
      responsibleEmail,
      appliedOn: new Date(Date.now()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      accepted: false,
      id: uuidv4(),
    };

    try {
      await updateDoc(competitionRef, {
        applications: arrayUnion(applicationData),
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application.");
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
          {activeCompetitions.length === 1 ? (
            <>
              <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Active Competitions
                </Typography>
                {activeCompetitions.map((comp) => (
                  <Box key={comp.id}>
                    <Typography variant="subtitle1">{comp.name}</Typography>
                    <Typography variant="body2">
                      {comp.maxTeams - comp.applications.length} spots open
                    </Typography>
                  </Box>
                ))}
              </Paper>
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
                      <ListItem key={index}>
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
                      <ListItem key={index}>
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
                      <ListItem key={index}>
                        <ListItemText primary={club} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <TextField
                  fullWidth
                  label="Responsible Person's Name"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Responsible Person's Email"
                  type="email"
                  value={responsibleEmail}
                  onChange={(e) => setResponsibleEmail(e.target.value)}
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Submit Application
                </Button>
              </form>
            </>
          ) : (
            <Typography variant="h5" sx={{ mt: 4 }}>
              No active competitions
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default Apply;