import { Link } from 'react-router-dom'
import styles from '../styles/LandingPage.module.css'

function LandingPage() {

    return (
        <>
            <nav>
                <li id={styles.home}><Link to="/">Privacy Cloud</Link></li>
                <li className={styles.sign}><Link to="/auth"><button>Log In</button></Link></li>
                <li className={styles.sign} id={styles.signup}><Link to="/auth"><button>Sign Up</button></Link></li>

            </nav>
            <br /><br /><br />
            <div className={styles.showcase}>
                <p id={styles.motto}>A Cloud Storage That Respects Your Privacy.</p>
                <img src="/cloud_lock.svg" alt="s" />
            </div>

        </>

    )
}

export default LandingPage