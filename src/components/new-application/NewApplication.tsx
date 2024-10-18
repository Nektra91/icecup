/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Competition } from "../../models/interfaces";
import { query, collection, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getDocs } from "firebase/firestore";
import ChooseCompetition from "./ChooseCompetition";
import { grey } from "@mui/material/colors";
import CreateApplication from "../forms/CreateApplication";

function NewApplication() {
  const [loading, setLoading] = useState(true);
  const [activeCompetitions, setActiveCompetitions] = useState<Competition[]>(
    []
  );
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
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
  function handleCompetitionSelection(competition: Competition) {
    setSelectedCompetition(competition);
  }

  const baseContent = !selectedCompetition ? (
    <Container
      maxWidth="sm"
      sx={{ height: "calc(100vh - 64px)" }}
      css={containerStyles}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" m={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <div css={headerStyles}>
            <Typography variant="h5">
              Please select an active competition to apply to
            </Typography>
          </div>
          <ChooseCompetition
            competitions={activeCompetitions}
            handleCompetitionSelection={handleCompetitionSelection}
          />
        </Box>
      )}
    </Container>
  ) : (
    <CreateApplication competition={selectedCompetition} />
  );
  return baseContent;
}

const containerStyles = css`
  background-color: ${grey[50]};
  min-height: calc(100vh - 64px);
  width: 100%;
  padding: 24px;
  border-radius: 8px;
`;

const headerStyles = css`
  margin-bottom: 24px;
  text-align: center;
  width: 100%;
  padding: 16px 0;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

export default NewApplication;
