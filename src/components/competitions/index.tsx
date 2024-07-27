import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Competition } from "../../models/interfaces";

const Competitions = () => {
  const [competitionName, setCompetition] = useState("");
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    getDocs(collection(db, "competitions")).then((snapshot) => {
      setCompetitions(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            applications: data.applications || [],
            curlingsClubs: data.curlingsClubs || [],
            waitingList: data.waitingList || [],
          } as Competition;
        })
      );
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "competitions"), {
        name: competitionName,
        isActive: true,
        maxTeams: 28,
        applications: [],
        waitingList: [],
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="page-container">
      {competitions.length === 0 && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={competitionName}
            onChange={(e) => setCompetition(e.target.value)}
          />
          <button type="submit">Add Competition</button>
        </form>
      )}
      <div>
        {competitions.map((competition) => (
          <p key={competition.id}>
            There exists an active competition with the name {competition.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Competitions;
