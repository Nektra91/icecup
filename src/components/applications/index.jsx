import { query, where, getDocs, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import {db} from '../../firebase/firebase';
import React, { useEffect, useState } from 'react';
import './applications.css';
import Spinner from '../common/spinner';

const Applications = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCompetitions, setActiveCompetitions] = useState([]);

    useEffect(() => {
        const fetchActiveCompetitions = async () => {
            const q = query(collection(db, "competitions"), where("isActive", "==", true));
            const querySnapshot = await getDocs(q);
            const competitions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(competitions);
            setActiveCompetitions(competitions.length > 0 ? [competitions[0]] : []);
            setLoading(false);
        };
 
        fetchActiveCompetitions();
    }, []);

    return (
        <div className='page-container'>
            {
                loading ?
                <>
                    <Spinner isLoading={loading}/>
                </>
                :
                <>
                    <div className='flex-column applications'>
                        {activeCompetitions[0].applications.map(app => (
                            <div className='flex-column application' key={app.id}>
                                <div className='team-name'>
                                    {app.teamName}
                                </div>
                                <div className='body-container flex-row'>
                                    <div className='body-div'>
                                        {app.teamMembers.map(member => 
                                            (
                                                <div>
                                                    {member}
                                                </div>
                                            ))}
                                        </div>
                                    <div className='body-div'>
                                        {app.nationalities.map(nationality => 
                                            (
                                                <div>
                                                    {nationality}
                                                </div>
                                            ))}
                                    </div>
                                    <div className='flex-column body-div'>
                                        <div>{app.responsibleName}</div>
                                        <div>{app.responsibleEmail}</div>
                                    </div>
                                    <div>{app.appliedOn}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            }
            
        </div>
    );
}

export default Applications;