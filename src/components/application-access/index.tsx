import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Application } from "../../models/interfaces";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const ApplicationAccess = () => {
  const { token } = useParams<{ token: string }>();

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [nationalities, setNationalities] = useState<string[]>([]);
  const [curlingsClubs, setCurlingsClubs] = useState<string[]>([]);
  const [responsibleName, setResponsibleName] = useState("");
  const [responsibleEmail, setResponsibleEmail] = useState("");

  const [newMember, setNewMember] = useState("");
  const [newNationality, setNewNationality] = useState("");
  const [newClub, setNewClub] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [docId, setDocId] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      if (!token) return;
      try {
        const q = query(collection(db, "applications"), where("token", "==", token));
        const snap = await getDocs(q);
        if (snap.empty) {
          setNotFound(true);
        } else {
          const docSnap = snap.docs[0];
          const data = docSnap.data() as Application;
          setDocId(docSnap.id);
          setApplication(data);
          setTeamName(data.teamName);
          setTeamMembers(data.teamMembers);
          setNationalities(data.nationalities);
          setCurlingsClubs(data.curlingsClubs);
          setResponsibleName(data.responsibleName);
          setResponsibleEmail(data.responsibleEmail);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [token]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === application?.pin) {
      setUnlocked(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Please check your confirmation email.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId || !application) return;
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    const updated: Partial<Application> = {
      teamName,
      teamMembers,
      nationalities,
      curlingsClubs,
      responsibleName,
      responsibleEmail,
    };

    try {
      await updateDoc(doc(db, "applications", docId), updated);
      setApplication({ ...application, ...updated });
      setSaveSuccess(true);
    } catch {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Alert severity="error">Application not found. Please check your link.</Alert>
      </Box>
    );
  }

  if (!unlocked) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e3f0ff 0%, #f5f5f5 100%)",
          px: 2,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 380, borderRadius: 3, boxShadow: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={1}>Enter your PIN</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Check your confirmation email for the 6-digit PIN.
            </Typography>
            {pinError && <Alert severity="error" sx={{ mb: 2 }}>{pinError}</Alert>}
            <Box component="form" onSubmit={handlePinSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                inputProps={{ maxLength: 6, inputMode: "numeric" }}
                required
                fullWidth
                autoFocus
              />
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}>
                Access Application
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Your Application</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Applied on {application?.appliedOn} ·{" "}
        <Chip
          label={application?.accepted ? "Accepted" : "Pending review"}
          color={application?.accepted ? "success" : "default"}
          size="small"
        />
      </Typography>

      {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>Changes saved successfully.</Alert>}
      {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}

      <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField label="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} fullWidth required />

        <Box>
          <Typography variant="subtitle2" mb={1}>Team Members</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Add member"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              size="small"
              fullWidth
            />
            <Button variant="outlined" onClick={() => { if (newMember) { setTeamMembers([...teamMembers, newMember]); setNewMember(""); } }}>
              Add
            </Button>
          </Box>
          <List dense>
            {teamMembers.map((m, i) => (
              <ListItem key={i} secondaryAction={
                <IconButton size="small" onClick={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))}>
                  <ClearIcon fontSize="small" color="error" />
                </IconButton>
              }>
                <ListItemText primary={m} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1}>Nationalities</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Add nationality"
              value={newNationality}
              onChange={(e) => setNewNationality(e.target.value)}
              size="small"
              fullWidth
            />
            <Button variant="outlined" onClick={() => { if (newNationality) { setNationalities([...nationalities, newNationality]); setNewNationality(""); } }}>
              Add
            </Button>
          </Box>
          <List dense>
            {nationalities.map((n, i) => (
              <ListItem key={i} secondaryAction={
                <IconButton size="small" onClick={() => setNationalities(nationalities.filter((_, j) => j !== i))}>
                  <ClearIcon fontSize="small" color="error" />
                </IconButton>
              }>
                <ListItemText primary={n} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1}>Curling Clubs</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              label="Add curling club"
              value={newClub}
              onChange={(e) => setNewClub(e.target.value)}
              size="small"
              fullWidth
            />
            <Button variant="outlined" onClick={() => { if (newClub) { setCurlingsClubs([...curlingsClubs, newClub]); setNewClub(""); } }}>
              Add
            </Button>
          </Box>
          <List dense>
            {curlingsClubs.map((c, i) => (
              <ListItem key={i} secondaryAction={
                <IconButton size="small" onClick={() => setCurlingsClubs(curlingsClubs.filter((_, j) => j !== i))}>
                  <ClearIcon fontSize="small" color="error" />
                </IconButton>
              }>
                <ListItemText primary={c} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        <TextField label="Responsible Person's Name" value={responsibleName} onChange={(e) => setResponsibleName(e.target.value)} fullWidth required />
        <TextField label="Responsible Person's Email" type="email" value={responsibleEmail} onChange={(e) => setResponsibleEmail(e.target.value)} fullWidth required />

        <Button type="submit" variant="contained" size="large" disabled={saving} sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </Box>
    </Box>
  );
};

export default ApplicationAccess;
