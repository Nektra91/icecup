import { useEffect, useState } from "react";
import { query, where, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Competition } from "../../models/interfaces";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";

const Nationalities = () => {
  const [loading, setLoading] = useState(true);
  const [nationalityCounts, setNationalityCounts] = useState<Record<string, number>>({});

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

      if (competitions.length > 0) {
        const competition = competitions[0];
        const counts: Record<string, number> = {};
        [...competition.applications, ...competition.waitingList].forEach((app) => {
          app.nationalities.forEach((nat: string) => {
            counts[nat] = (counts[nat] || 0) + 1;
          });
        });
        setNationalityCounts(counts);
      }
      setLoading(false);
    };

    fetchActiveCompetitions();
  }, []);

  const sorted = Object.entries(nationalityCounts).sort((a, b) => b[1] - a[1]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 1 }}>
        Nationalities
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : sorted.length === 0 ? (
        <Typography color="text.secondary">No nationalities found.</Typography>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ mb: 3 }} color="text.secondary">
            {sorted.length} {sorted.length === 1 ? "nationality" : "nationalities"} represented
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {sorted.map(([nat, count]) => (
              <Chip
                key={nat}
                label={`${nat} (${count})`}
                variant="outlined"
                size="medium"
              />
            ))}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Nationalities;
