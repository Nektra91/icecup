import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Competition } from "../../models/interfaces";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Competitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [competitionName, setCompetitionName] = useState("");
  const [maxTeams, setMaxTeams] = useState<number>(28);
  const [creating, setCreating] = useState(false);

  const fetchCompetitions = async () => {
    const snapshot = await getDocs(collection(db, "competitions"));
    setCompetitions(
      snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          applications: data.applications || [],
          curlingsClubs: data.curlingsClubs || [],
          waitingList: data.waitingList || [],
        } as Competition;
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!competitionName.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, "competitions"), {
        name: competitionName.trim(),
        isActive: true,
        maxTeams,
        applications: [],
        waitingList: [],
        curlingsClubs: [],
      });
      setCompetitionName("");
      setMaxTeams(28);
      await fetchCompetitions();
    } catch (error) {
      console.error("Error creating competition:", error);
      alert("Failed to create competition.");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (competition: Competition) => {
    await updateDoc(doc(db, "competitions", competition.id), {
      isActive: !competition.isActive,
    });
    await fetchCompetitions();
  };

  const handleDelete = async (competition: Competition) => {
    if (!window.confirm(`Delete "${competition.name}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "competitions", competition.id));
    await fetchCompetitions();
  };

  const active = competitions.filter((c) => c.isActive);
  const inactive = competitions.filter((c) => !c.isActive);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
        Competitions
      </Typography>

      {/* ── Create form ── */}
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            New Competition
          </Typography>
          <form onSubmit={handleCreate}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <TextField
                label="Competition Name"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                required
                size="small"
                sx={{ flex: 1, minWidth: 220 }}
              />
              <TextField
                label="Max Teams"
                type="number"
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                required
                size="small"
                sx={{ width: 130 }}
                inputProps={{ min: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={creating || !competitionName.trim()}
              >
                Create
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* ── Competition list ── */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : competitions.length === 0 ? (
        <Typography color="text.secondary">No competitions yet. Create one above.</Typography>
      ) : (
        <>
          {/* Active */}
          {active.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Active ({active.length})
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {active.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                    onToggle={toggleActive}
                    onDelete={handleDelete}
                  />
                ))}
              </Grid>
            </>
          )}

          {/* Inactive */}
          {inactive.length > 0 && (
            <>
              {active.length > 0 && <Divider sx={{ mb: 3 }} />}
              <Typography variant="h6" sx={{ mb: 2 }} color="text.secondary">
                Inactive ({inactive.length})
              </Typography>
              <Grid container spacing={2}>
                {inactive.map((competition) => (
                  <CompetitionCard
                    key={competition.id}
                    competition={competition}
                    onToggle={toggleActive}
                    onDelete={handleDelete}
                  />
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
};

/* ── Competition card ── */
interface CompetitionCardProps {
  competition: Competition;
  onToggle: (c: Competition) => void;
  onDelete: (c: Competition) => void;
}

const CompetitionCard = ({ competition, onToggle, onDelete }: CompetitionCardProps) => {
  const total = competition.applications.length;
  const accepted = competition.applications.filter((a) => a.accepted).length;
  const waiting = competition.waitingList.length;
  const spotsLeft = competition.maxTeams - total;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ boxShadow: 3, height: "100%", display: "flex", flexDirection: "column", opacity: competition.isActive ? 1 : 0.7 }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.3 }}>
              {competition.name}
            </Typography>
            <Chip
              label={competition.isActive ? "Active" : "Inactive"}
              color={competition.isActive ? "success" : "default"}
              size="small"
              sx={{ ml: 1, flexShrink: 0 }}
            />
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">Applications</Typography>
              <Typography variant="body2" fontWeight={600}>{total} / {competition.maxTeams}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">Accepted</Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">{accepted}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">Spots left</Typography>
              <Typography variant="body2" fontWeight={600} color={spotsLeft <= 3 ? "error.main" : "text.primary"}>
                {spotsLeft}
              </Typography>
            </Box>
            {waiting > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Waiting list</Typography>
                <Typography variant="body2" fontWeight={600}>{waiting}</Typography>
              </Box>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            color={competition.isActive ? "warning" : "success"}
            onClick={() => onToggle(competition)}
          >
            {competition.isActive ? "Set Inactive" : "Set Active"}
          </Button>
          <Tooltip title="Delete competition">
            <IconButton color="error" size="small" onClick={() => onDelete(competition)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Competitions;
