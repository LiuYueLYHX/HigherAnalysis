import {Link} from 'react-router-dom'
import styles from './Header.module.css'

function Header(){
    return (
        <header className={styles.containerHeader}>
            <h2 className={styles.titleHeader}>
                Higher<strong style={{color: "black"}}>Analysis</strong>
            </h2>
            <div className={styles.containerLinkMain}>
                <Link className={styles.link} to="/">Home</Link>
                <Link className={styles.link} to="/about-us">About Us</Link>
                <Link className={styles.link} to="/project">The Project</Link>
                <Link className={styles.link} to="/gallery">Gallery</Link>
            </div>
            <div>
                <Link className={styles.link} to="/sign-in">Sign In</Link>
                <Link className={styles.link} to="/sign-up">Sign Up</Link> 
            </div>
        </header>
    )
}

export default Header