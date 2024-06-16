import React, { useEffect, useState } from 'react';
import './apply.css';
import {db} from '../../firebase/firebase';
import { query, where, getDocs, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Spinner from '../common/spinner';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActiveCompetitions = async () => {
            setLoading(true);
            const q = query(collection(db, "competitions"), where("isActive", "==", true));
            const querySnapshot = await getDocs(q);
            const competitions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActiveCompetitions(competitions.length > 0 ? [competitions[0]] : []);
            setLoading(false);
        };
 
        fetchActiveCompetitions();
    }, []);
    const handleAddMember = (e) => {
        if (memberName) {
            setTeamMembers([...teamMembers, memberName]);
            setMemberName('');
        }
        e.preventDefault();
    };

    const handleAddNationality = (e) => {
        if (nationality) {
            setNationalities([...nationalities, nationality]);
            setNationality('');
        }
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeCompetitions.length === 0) {
            alert('No active competition available.');
            return;
        }
    
        const competitionId = activeCompetitions[0].id; // Assuming there's always one active competition
        const competitionRef = doc(db, "competitions", competitionId);
    
        const applicationData = {
            teamName,
            teamMembers,
            nationalities,
            responsibleName,
            responsibleEmail,
            appliedOn: new Date(Date.now()).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
            accepted: false,
            id: uuidv4()
        };
    
        try {
            await updateDoc(competitionRef, {
                applications: arrayUnion(applicationData)
            });
            navigate('/');
    
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
                                    {activeCompetitions.map(comp => (
                                        <>
                                        <div>{comp.name}</div>
                                        <div>{comp.maxTeams - comp.applications.length} spots open</div>
                                        </>
                                    ))}
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