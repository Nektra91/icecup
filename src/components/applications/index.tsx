import {
  query,
  where,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Divider,
  Container,
  CircularProgress,
} from "@mui/material";
import { Application, Competition } from "../../models/interfaces";

const Applications = () => {
  const [loading, setLoading] = useState(true);
  const [activeCompetitions, setActiveCompetitions] = useState<Competition[]>(
    []
  );

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

  const deleteApplication = async (appid: string) => {
    const updatedCompetitions = activeCompetitions.map(async (competition) => {
      const competitionRef = doc(db, "competitions", competition.id);
      const compDoc = await getDoc(competitionRef);
      const applications =
        (compDoc?.data?.()?.applications as Application[]) || [];
      const applicationToRemove = applications.find((app) => app.id === appid);

      if (applicationToRemove) {
        await updateDoc(competitionRef, {
          applications: arrayRemove(applicationToRemove),
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatedCompetitions);

    // Fetch updated competitions from Firestore to refresh the local state
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
  };

  const deleteApplicationFromWaitingList = async (appid: string) => {
    const updatedCompetitions = activeCompetitions.map(async (competition) => {
      const competitionRef = doc(db, "competitions", competition.id);
      const compDoc = await getDoc(competitionRef);
      const waitingList =
        (compDoc?.data?.()?.waitingList as Application[]) || [];
      const applicationToRemove = waitingList.find((app) => app.id === appid);

      if (applicationToRemove) {
        await updateDoc(competitionRef, {
          waitingList: arrayRemove(applicationToRemove),
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatedCompetitions);

    // Fetch updated competitions from Firestore to refresh the local state
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
  };

  const approveApplication = async (appid: string) => {
    const updatedCompetitions = activeCompetitions.map(async (competition) => {
      const competitionRef = doc(db, "competitions", competition.id);
      const compDoc = await getDoc(competitionRef);
      const applications =
        (compDoc?.data?.()?.applications as Application[]) || [];
      const applicationToApprove = applications.find((app) => app.id === appid);

      if (applicationToApprove) {
        await updateDoc(competitionRef, {
          applications: applications.map((app) =>
            app.id === appid ? { ...app, accepted: true } : app
          ),
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatedCompetitions);

    // Fetch updated competitions from Firestore to refresh the local state
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
  };

  const moveApplicationToWaitingList = async (appid: string) => {
    const updatedCompetitions = activeCompetitions.map(async (competition) => {
      const competitionRef = doc(db, "competitions", competition.id);
      const compDoc = await getDoc(competitionRef);
      const applications =
        (compDoc?.data?.()?.applications as Application[]) || [];
      const applicationToMove = applications.find((app) => app.id === appid);

      if (applicationToMove) {
        // Assuming you have a 'waitingList' array in your Firestore document
        await updateDoc(competitionRef, {
          applications: arrayRemove(applicationToMove),
          waitingList: arrayUnion(applicationToMove),
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatedCompetitions);

    // Fetch updated competitions from Firestore to refresh the local state
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
  };

  const moveApplicationOffWaitingList = async (appid: string) => {
    const updatedCompetitions = activeCompetitions.map(async (competition) => {
      const competitionRef = doc(db, "competitions", competition.id);
      const compDoc = await getDoc(competitionRef);
      const waitingList =
        (compDoc?.data?.()?.waitingList as Application[]) || [];
      const applicationToMove = waitingList.find((app) => app.id === appid);

      if (applicationToMove) {
        // Assuming you have a 'waitingList' array in your Firestore document
        await updateDoc(competitionRef, {
          waitingList: arrayRemove(applicationToMove),
          applications: arrayUnion(applicationToMove),
        });
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatedCompetitions);

    // Fetch updated competitions from Firestore to refresh the local state
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
  };

  const ApplicationCard = ({ app, isWaitingList = false }: { app: Record<string, any>; isWaitingList?: boolean }) => (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {app.teamName}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Team Members:</Typography>
            {app.teamMembers.map((member: string, index: number) => (
              <Typography key={index} variant="body2">{member}</Typography>
            ))}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Curling Clubs:</Typography>
            {app.curlingsClubs.map((club: string, index: number) => (
              <Chip key={index} label={club} sx={{ mr: 1, mb: 1 }} />
            ))}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Nationalities:</Typography>
            {app.nationalities.map((nationality: string, index: number) => (
              <Chip key={index} label={nationality} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Responsible: {app.responsibleName}</Typography>
          <Typography variant="body2">Email: {app.responsibleEmail}</Typography>
          <Typography variant="body2">Applied on: {app.appliedOn}</Typography>
        </Box>
        {app.accepted && (
          <Chip label="Application accepted" color="success" sx={{ mt: 2 }} />
        )}
        {!app.accepted && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            {!isWaitingList ? (
              <>
                <Button variant="contained" color="success" onClick={() => approveApplication(app.id)}>
                  Confirm
                </Button>
                <Button variant="contained" color="primary" onClick={() => moveApplicationToWaitingList(app.id)}>
                  Move to waiting list
                </Button>
                <Button variant="contained" color="error" onClick={() => deleteApplication(app.id)}>
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" color="primary" onClick={() => moveApplicationOffWaitingList(app.id)}>
                  Move off waiting list
                </Button>
                <Button variant="contained" color="error" onClick={() => deleteApplicationFromWaitingList(app.id)}>
                  Delete
                </Button>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Applications
          </Typography>
          <Box sx={{ mb: 4 }}>
            {activeCompetitions[0].applications.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </Box>
          {activeCompetitions[0].waitingList.length > 0 && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Waiting List ({activeCompetitions[0].waitingList.length} teams)
              </Typography>
              <Box>
                {activeCompetitions[0].waitingList.map((app) => (
                  <ApplicationCard key={app.id} app={app} isWaitingList={true} />
                ))}
              </Box>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Applications;