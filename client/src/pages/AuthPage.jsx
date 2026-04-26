import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import styles from '../styles/AuthPage.module.css'

function AuthPage() {
    const navigate = useNavigate();
    let token = localStorage.getItem('token')

    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);

    const [authBtn, setAuthBtn] = useState('Submit')
    const headerTxt = isRegistration ? 'Sign Up' : 'Log In';
    const registerQuestionTxt = isRegistration ? 'Already have an account?' : "Don't have an account?";
    const registerBtn = isRegistration ? 'Sign In' : 'Sign Up';

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");



    // AUTH LOGIC

    function toggleIsRegister() {
        setIsRegistration(prev => !prev);
    }

    async function authenticate() {

        const emailVal = email
        const passVal = password

        if (
            isLoading ||
            isAuthenticating ||
            !emailVal ||
            !passVal ||
            passVal.length < 6 ||
            !emailVal.includes('@')
        ) {
            setError("Email or Password is not sufficient!")
            return
        }

        setError(" ")
        setIsAuthenticating(true)

        setAuthBtn('Authenticating...')

        try {
            let data
            if (isRegistration) {

                const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + '/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal, password: passVal })
                })
                data = await response.json()
            } else {
                // login
                const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + '/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal, password: passVal })
                })
                data = await response.json();
                console.log(data)
            }

            if (data.token) {
                token = data.token
                localStorage.setItem('token', token)

                setAuthBtn('Loading...')

                navigate("/home")

            } else {
                throw Error('❌ Failed to authenticate...')
            }

        } catch (err) {
            console.log(err.message)
            setError(err.message)
            console.log("\n")
            console.log(data)
        } finally {
            setAuthBtn('Submit')
            setIsAuthenticating(false)
        }


    }

    function logout() {
        // wipe states and clear cached token
    }

    return (
        <>
            <div className={styles.topBar}>
                <h2 className={styles.logo}>Privacy Cloud</h2>
            </div>
            <form id={styles.auth} onSubmit={(e) => { e.preventDefault(); authenticate(); }}>
                <div>
                    <h2 className={styles["sign-up-text"]}>{headerTxt}</h2>
                    <p></p>
                </div>

                <p id={styles.error} >{error}</p>

                <input id={styles.emailInput} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input id={styles.passwordInput} placeholder="********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button id={styles.authBtn} type="submit">
                    {authBtn}
                </button>
                <hr />
                <div className={styles["register-content"]}>
                    <p>{registerQuestionTxt}</p>
                    <button onClick={toggleIsRegister} id={styles.registerBtn} type="button">{registerBtn}</button>
                </div>
            </form>
            <header style={{ display: 'none' }}>
                <h1 className={styles['text-gradient']}>You have 0 open tasks.</h1>
            </header>
            <nav style={{ display: 'none' }} className={styles['tab-container']}>
                <button onClick={() => changeTab('All')} className={[styles['tab-button'], styles['selected-tab']].join(' ')}>
                    <h4>All <span>(0)</span></h4>
                </button>
                <button onClick={() => changeTab('Open')} className={styles['tab-button']}>
                    <h4>Open <span>(0)</span></h4>
                </button>
                <button onClick={() => changeTab('Complete')} className={styles['tab-button']}>
                    <h4>Complete <span>(0)</span></h4>
                </button>
                <hr />
            </nav>

        </>
    )
}

export default AuthPage;