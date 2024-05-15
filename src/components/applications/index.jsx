import { getDocs, collection } from 'firebase/firestore';
import {db} from '../../firebase/firebase';
import React, { useEffect, useState } from 'react';
import './applications.css';

const Applications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getDocs(collection(db, 'applications')).then((querySnapshot) => {
            const apps = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(apps);
        }).catch(error => {
            console.error("Error fetching applications:", error);
        });
    }, []);

    return (
        <div className='page-container'>
            <div className='flex-column applications'>
                {applications.map(app => (
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
                            <div className='flex-column'>
                                <div>{app.responsibleName}</div>
                                <div>{app.responsibleEmail}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Applications;