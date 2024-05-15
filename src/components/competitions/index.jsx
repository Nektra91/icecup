import React, {useEffect, useState}from "react";
import {db} from '../../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Competitions = () => {
    const [competitionName, setCompetition] = useState('');
    const [competitions, setCompetitions] = useState([]);

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
                isActive: true
            });
            setCompetition('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    return (
        <div className="page-container">
            <form onSubmit={handleSubmit}>
                <input type="text" value={competitionName} onChange={(e) => setCompetition(e.target.value)} />
                <button type="submit">Add Competition</button>
            </form>
            <div>
                {competitions.map((competition) => (
                    <p key={competition.id}>{competition.name}</p>
                ))}
            </div>
        </div>
    )
}

export default Competitions;

