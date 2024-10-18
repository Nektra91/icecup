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
  Typography,
  Box,
  Divider,
  Container,
  CircularProgress,
} from "@mui/material";
import { Application, Competition } from "../../models/interfaces";
import { ApplicationCard } from "../common/UI";

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

  return (
    <Container maxWidth="lg">
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ mt: 4, mb: 2 }}
          >
            Applications
          </Typography>
          <Box sx={{ mb: 4 }}>
            {activeCompetitions[0].applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                canEdit={true}
                competitionId={activeCompetitions[0].id}
                approveApplication={approveApplication}
                moveApplicationToWaitingList={moveApplicationToWaitingList}
                deleteApplication={deleteApplication}
                moveApplicationOffWaitingList={moveApplicationOffWaitingList}
                deleteApplicationFromWaitingList={
                  deleteApplicationFromWaitingList
                }
              />
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
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    isWaitingList={true}
                    competitionId={activeCompetitions[0].id}
                    canEdit={true}
                    approveApplication={approveApplication}
                    moveApplicationToWaitingList={moveApplicationToWaitingList}
                    deleteApplication={deleteApplication}
                    moveApplicationOffWaitingList={
                      moveApplicationOffWaitingList
                    }
                    deleteApplicationFromWaitingList={
                      deleteApplicationFromWaitingList
                    }
                  />
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
