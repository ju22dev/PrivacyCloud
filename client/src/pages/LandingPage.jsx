import { Link } from 'react-router-dom'

function LandingPage() {

    return (
        <>
            <nav>
                <li id='home'><Link to="/">Privacy Cloud</Link></li>
                <li className='sign'><Link to="/auth"><button>Log In</button></Link></li>
                <li className='sign' id='signup'><Link to="/auth"><button>Sign Up</button></Link></li>

            </nav>
            <br /><br /><br />
            <div className="showcase">
                <p id="motto">A Cloud Storage That Respects Your Privacy.</p>
                <img src="/cloud_lock.svg" alt="s" />
            </div>

        </>

    )
}

export default LandingPage