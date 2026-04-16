import { useEffect, useState } from "react";
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Competition } from "../../models/interfaces";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";

const Teams = () => {
  const [loading, setLoading] = useState(true);
  const [activeCompetitions, setActiveCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchActiveCompetitions = async () => {
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (activeCompetitions.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mt: 4 }}>
          No active competitions
        </Typography>
      </Container>
    );
  }

  const competition = activeCompetitions[0];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 1 }}>
        Teams
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }} color="text.secondary">
        {competition.applications.length} / {competition.maxTeams} spots filled
      </Typography>

      {competition.applications.map((app, index) => (
        <Card key={app.id} sx={{ mb: 2, boxShadow: 3 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6">
              {index + 1}. {app.teamName}
            </Typography>
            {app.accepted && (
              <Chip label="Accepted" color="success" size="small" />
            )}
          </CardContent>
        </Card>
      ))}

      {competition.waitingList.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>
            Waiting List ({competition.waitingList.length} teams)
          </Typography>
          {competition.waitingList.map((app, index) => (
            <Card key={app.id} sx={{ mb: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant="h6">
                  {index + 1}. {app.teamName}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Container>
  );
};

export default Teams;
