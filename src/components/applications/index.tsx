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
import "./applications.css";
import Button from "@mui/material/Button";
import Spinner from "../common/spinner";
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

  return (
    <div className="page-container">
      {loading ? (
        <>
          <Spinner isLoading={loading} />
        </>
      ) : (
        <>
          <div className="flex-column applications">
            {activeCompetitions[0].applications.map((app) => (
              <div className="flex-column application" key={app.id}>
                <div className="team-name">{app.teamName}</div>
                <div className="body-container flex-row">
                  <div className="body-div">
                    {app.teamMembers.map((member) => (
                      <div>{member}</div>
                    ))}
                  </div>
                  <div className="body-div">
                    {app.curlingsClubs.map((club) => (
                      <div className="bold">{club}</div>
                    ))}
                    {app.nationalities.map((nationality) => (
                      <div>{nationality}</div>
                    ))}
                  </div>
                  
                  <div className="flex-column body-div">
                    {app.accepted && (
                      <div>Application accepted</div>
                    )}
                    <div>{app.responsibleName}</div>
                    <div>{app.responsibleEmail}</div>
                    <div>{app.appliedOn}</div>
                  </div>
                  
                </div>
                {!app.accepted && (
                  <div className="flex-row">
                    <div
                      className="button"
                      onClick={() => approveApplication(app.id)}
                    >
                      <Button variant="contained" color="success">
                        Confirm
                      </Button>
                    </div>
                    <div
                      className="button"
                      onClick={() => moveApplicationToWaitingList(app.id)}
                    >
                      <Button variant="contained" color="success">
                        Move to waiting list
                      </Button>
                    </div>
                    <div
                      className="button"
                      onClick={() => deleteApplication(app.id)}
                    >
                      <Button variant="contained" color="error">
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {activeCompetitions[0].waitingList.length > 0 && (
            <div>
              <div>
                Teams on waiting list {activeCompetitions[0].waitingList.length}
              </div>
              {activeCompetitions[0].waitingList.map((app) => (
                <div className="flex-column application" key={app.id}>
                  <div className="team-name">{app.teamName}</div>
                  <div className="body-container flex-row">
                    <div className="body-div">
                      {app.teamMembers.map((member: string) => (
                        <div>{member}</div>
                      ))}
                    </div>
                    <div className="body-div">
                      {app.nationalities.map((nationality: string) => (
                        <div>{nationality}</div>
                      ))}
                    </div>
                    <div className="flex-column body-div">
                      <div>{app.responsibleName}</div>
                      <div>{app.responsibleEmail}</div>
                    </div>
                    <div className="body-div">{app.appliedOn}</div>
                    {app.accepted && (
                      <div className="body-div">Application accepted</div>
                    )}
                  </div>
                  {!app.accepted && (
                    <div className="flex-row">
                      <div
                        className="button"
                        onClick={() => moveApplicationOffWaitingList(app.id)}
                      >
                        <Button variant="contained" color="success">
                          Move off waiting list
                        </Button>
                      </div>
                      <div
                        className="button"
                        onClick={() => deleteApplicationFromWaitingList(app.id)}
                      >
                        <Button variant="contained" color="error">
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
