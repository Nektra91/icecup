import React, { useEffect, useState } from 'react';
import './apply.css';
import {db} from '../../firebase/firebase';
import { query, where, getDocs, collection, addDoc } from 'firebase/firestore';
import Spinner from '../common/spinner';

const Apply = () => {
    const [loading, setLoading] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [memberName, setMemberName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [nationality, setNationality] = useState('');
    const [nationalities, setNationalities] = useState([]);
    const [responsibleName, setResponsibleName] = useState('');
    const [responsibleEmail, setResponsibleEmail] = useState('');
    const [activeCompetitions, setActiveCompetitions] = useState([]);

    useEffect(() => {
        const fetchActiveCompetitions = async () => {
            setLoading(true);
            const q = query(collection(db, "competitions"), where("isActive", "==", true));
            const querySnapshot = await getDocs(q);
            const competitions = [];
            querySnapshot.forEach((doc) => {
                competitions.push({ id: doc.id, ...doc.data() });
            });
            setActiveCompetitions(competitions);
            setLoading(false);
        };
 
        fetchActiveCompetitions();
    }, []);

    const handleAddMember = (e) => {
        e.preventDefault();
        if (memberName) {
            setTeamMembers([...teamMembers, memberName]);
            setMemberName('');
        }
    };

    const handleAddNationality = (e) => {
        e.preventDefault();
        if (nationality) {
            setNationalities([...nationalities, nationality]);
            setNationality('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "applications"), {
                teamName: teamName,
                teamMembers: teamMembers,
                nationalities: nationalities,
                responsibleName: responsibleName,
                responsibleEmail: responsibleEmail,
                competitionId: activeCompetitions[0].id

            });
            alert('Application submitted successfully!');
            setTeamName('');
            setTeamMembers([]);
            setNationalities([]);
            setResponsibleName('');
            setResponsibleEmail('');
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application.');
        }
    };

    return (
        <div className='page-container'>
            {
                loading ?
                <>
                    <Spinner isLoading={loading}/>
                </>
                :
                <>
                    {
                        activeCompetitions.length === 1 ? (
                            <>
                                <div>
                                    <h3>Active Competitions</h3>
                                    <ul>
                                        {activeCompetitions.map(comp => (
                                            <li key={comp.id}>{comp.name}</li> // Assuming 'name' is a field in the competitions documents
                                        ))}
                                    </ul>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label>Team Name:</label>
                                        <input
                                            type="text"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                        />
                                    </div>
                                    <div className='flex-column'>
                                        <label>Team Member Name:</label>
                                        <input
                                            type="text"
                                            value={memberName}
                                            onChange={(e) => setMemberName(e.target.value)}
                                        />
                                        <button onClick={handleAddMember}>Add Member</button>
                                        <ul>
                                            {teamMembers.map((member, index) => (
                                                <li key={index}>{member}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='flex-column'>
                                        <label>Nationality:</label>
                                        <input
                                            type="text"
                                            value={nationality}
                                            onChange={(e) => setNationality(e.target.value)}
                                        />
                                        <button onClick={handleAddNationality}>Add Nationality</button>
                                        <ul>
                                            {nationalities.map((nat, index) => (
                                                <li key={index}>{nat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <label>Responsible Person's Name:</label>
                                        <input
                                            type="text"
                                            value={responsibleName}
                                            onChange={(e) => setResponsibleName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Responsible Person's Email:</label>
                                        <input
                                            type="email"
                                            value={responsibleEmail}
                                            onChange={(e) => setResponsibleEmail(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit">Submit Application</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h3>No active competitions</h3>
                            </>
                        )
                    }
                </>
            }
        </div>
    );
};

export default Apply;