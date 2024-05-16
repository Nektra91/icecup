import React, {useEffect, useState}from "react";
import {db} from '../../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Competitions = () => {
    const [competitionName, setCompetition] = useState('');
    const [competitions, setCompetitions] = useState([]);
    const navigate = useNavigate(); // Initialize navigate function

    useEffect(() => {
        getDocs(collection(db, 'competitions')).then((snapshot) => {
            setCompetitions(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'competitions'), {
                name: competitionName,
                isActive: true,
                maxTeams: 28,
                applications: [],
                waitingList: []
            });
            navigate('/'); 
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <div className="page-container">
            {competitions.length === 0 && <form onSubmit={handleSubmit}>
                <input type="text" value={competitionName} onChange={(e) => setCompetition(e.target.value)} />
                <button type="submit">Add Competition</button>
            </form>}
            <div>
                {competitions.map((competition) => (
                    <p key={competition.id}>There exists an active competition with the name {competition.name}</p>
                ))}
            </div>
        </div>
    )
}

export default Competitions;

