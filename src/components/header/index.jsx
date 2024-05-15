import React from 'react'
import './header.css';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <div className='header-container'>
            <nav>
                {
                    userLoggedIn
                        ?
                        <>
                            
                            <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
                        </>
                        :
                        <>
                        <div className='container'>
                            <div className='link'>
                                <Link to={'/home'}>Home</Link>
                            </div>
                            <div className='link'>
                                <Link to={'/apply'}>Apply</Link>
                            </div>
                            <div className='link'>
                                <Link to={'/applications'}>Applications</Link>
                            </div>
                            <div className='link'>
                                <Link to={'/competitions'}>Competitions</Link>
                            </div>
                        </div>
                        </>
                }

            </nav>
        </div>
        
    )
}

export default Header