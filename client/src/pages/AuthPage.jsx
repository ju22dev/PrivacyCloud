import { useState } from 'react'
import { useNavigate } from "react-router-dom";

function AuthPage() {
    const navigate = useNavigate();
    let token = localStorage.getItem('token')

    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);

    const [registerBtn, setRegisterBtn] = useState('Sign up')
    const [headerTxt, setHeaderTxt] = useState('Log In')
    const [registerQuestionTxt, setRegisterQuestionTxt] = useState('Don\'t have an account?')
    const [authBtn, setAuthBtn] = useState('Submit')

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");



    // AUTH LOGIC

    async function toggleIsRegister() {
        setIsRegistration(prev => !prev)

        setRegisterBtn(prev => (prev === 'Sign in' ? 'Sign up' : 'Sign in'));
        setHeaderTxt(prev => (prev === 'Log In' ? 'Sign up' : 'Log In'));
        setRegisterQuestionTxt(prev => (prev === 'Don\'t have an account?' ? 'Already have an account?' : 'Don\'t have an account?'));
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
                
                const response = await fetch(import.meta.env.VITE_BACKEND_BASEURL + '/auth/register', {
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
            <section id="auth">
                <div>
                    <h2 className="sign-up-text">{headerTxt}</h2>
                    <p></p>
                </div>

                <p id="error" >{error}</p>
                <input id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input id="passwordInput" placeholder="********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button id="authBtn" onClick={() => authenticate()}>
                    {authBtn}
                </button>
                <hr />
                <div className="register-content">
                    <p>{registerQuestionTxt}</p>
                    <button onClick={() => toggleIsRegister()} id="registerBtn">{registerBtn}</button>
                </div>
            </section>
            <header style={{ display: 'none' }}>
                <h1 className="text-gradient">You have 0 open tasks.</h1>
            </header>
            <nav style={{ display: 'none' }} className="tab-container">
                <button onClick={() => changeTab('All')} className="tab-button  selected-tab">
                    <h4>All <span>(0)</span></h4>
                </button>
                <button onClick={() => changeTab('Open')} className="tab-button  ">
                    <h4>Open <span>(0)</span></h4>
                </button>
                <button onClick={() => changeTab('Complete')} className="tab-button  ">
                    <h4>Complete <span>(0)</span></h4>
                </button>
                <hr />
            </nav>

        </>
    )
}

export default AuthPage;