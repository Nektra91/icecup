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
  addDoc,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Competition } from "../../models/interfaces";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Stack,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const generatePin = () => Math.floor(100000 + Math.random() * 900000).toString();

const Apply = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchActiveCompetitions = async () => {
      setLoading(true);
      const q = query(collection(db, "competitions"), where("isActive", "==", true));
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

  const addItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    clearInput: () => void
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
      clearInput();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    clearInput: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(value, setter, list, clearInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeCompetitions.length === 0) return;

    if (!teamName.trim()) {
      setError("Team name is required.");
      return;
    }
    if (!responsibleName.trim()) {
      setError("Responsible person's name is required.");
      return;
    }
    if (!responsibleEmail.trim()) {
      setError("Responsible person's email is required.");
      return;
    }

    setError("");
    setSubmitting(true);

    const competitionId = activeCompetitions[0].id;
    const competitionRef = doc(db, "competitions", competitionId);
    const token = uuidv4();
    const pin = generatePin();

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
      token,
      pin,
      competitionId,
    };

    try {
      await updateDoc(competitionRef, { applications: arrayUnion(applicationData) });
      await setDoc(doc(db, "applications", token), { ...applicationData });
      await addDoc(collection(db, "applicationSubmissions"), {
        responsibleEmail,
        responsibleName,
        teamName,
        competitionName: activeCompetitions[0].name,
        token,
        pin,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (activeCompetitions.length === 0) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ mt: 4 }}>No active competitions</Typography>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 6, textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
          <Typography variant="h5" fontWeight={700} mb={1}>Application submitted!</Typography>
          <Typography variant="body1" color="text.secondary">
            A confirmation email has been sent to <strong>{responsibleEmail}</strong> with your application link and PIN.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const comp = activeCompetitions[0];

  return (
    <Container maxWidth="sm">
      <Paper elevation={2} sx={{ p: 2.5, mt: 4, mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>{comp.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {comp.maxTeams - comp.applications.length} of {comp.maxTeams} spots remaining
          </Typography>
        </Box>
        <Chip label="Open" color="success" size="small" />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>

        <TextField
          label="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
          fullWidth
        />

        <Box>
          <Typography variant="subtitle2" mb={1}>Team Members</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Member name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, memberName, setTeamMembers, teamMembers, () => setMemberName(""))}
              size="small"
              fullWidth
              helperText="Press Enter or click Add"
            />
            <Button variant="outlined" sx={{ height: 40, alignSelf: "flex-start", mt: 0.1 }}
              onClick={() => addItem(memberName, setTeamMembers, teamMembers, () => setMemberName(""))}>
              Add
            </Button>
          </Box>
          {teamMembers.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1.5}>
              {teamMembers.map((m, i) => (
                <Chip key={i} label={m} onDelete={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))} />
              ))}
            </Stack>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1}>Nationalities</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, nationality, setNationalities, nationalities, () => setNationality(""))}
              size="small"
              fullWidth
              helperText="Press Enter or click Add"
            />
            <Button variant="outlined" sx={{ height: 40, alignSelf: "flex-start", mt: 0.1 }}
              onClick={() => addItem(nationality, setNationalities, nationalities, () => setNationality(""))}>
              Add
            </Button>
          </Box>
          {nationalities.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1.5}>
              {nationalities.map((n, i) => (
                <Chip key={i} label={n} onDelete={() => setNationalities(nationalities.filter((_, j) => j !== i))} />
              ))}
            </Stack>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1}>Curling Clubs</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Curling club"
              value={curlingClub}
              onChange={(e) => setCurlingClub(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, curlingClub, setCurlingsClubs, curlingsClubs, () => setCurlingClub(""))}
              size="small"
              fullWidth
              helperText="Press Enter or click Add"
            />
            <Button variant="outlined" sx={{ height: 40, alignSelf: "flex-start", mt: 0.1 }}
              onClick={() => addItem(curlingClub, setCurlingsClubs, curlingsClubs, () => setCurlingClub(""))}>
              Add
            </Button>
          </Box>
          {curlingsClubs.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1.5}>
              {curlingsClubs.map((c, i) => (
                <Chip key={i} label={c} onDelete={() => setCurlingsClubs(curlingsClubs.filter((_, j) => j !== i))} />
              ))}
            </Stack>
          )}
        </Box>

        <Divider />

        <Typography variant="subtitle1" fontWeight={600} mt={-1}>Responsible Person</Typography>

        <TextField
          label="Full Name"
          value={responsibleName}
          onChange={(e) => setResponsibleName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={responsibleEmail}
          onChange={(e) => setResponsibleEmail(e.target.value)}
          required
          fullWidth
          helperText="Your confirmation email and application link will be sent here"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
        </Button>
      </Box>
    </Container>
  );
};

export default Apply;
