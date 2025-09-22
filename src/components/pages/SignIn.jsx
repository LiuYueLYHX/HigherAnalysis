import styles from './SignIn.module.css'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'


function SignIn(){
    const [login, setLogin] = useState("")
    const[password, setPassword] = useState("")

    const navigate = useNavigate()

    const loginVerify = () => {
        if(login == "admin" && password=="12345"){
            navigate("/dashboardCFO/")
        }else{
            alert("Login inválido!")
        }
    }

    return(
        <>
            <div className={`${styles.title} ${styles.center}`}>Sign In</div>
            <p className={`${styles.center}`}>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            <h2>Login</h2>
            <input value={login} className={styles.field} type="text" placeholder='Enter your email or phone number' onChange={(e) => setLogin(e.target.value)}></input>
            <h2>Password</h2>
            <input value={password} className={styles.field} type="password" placeholder='Enter your email or phone number' onChange={(e) => setPassword(e.target.value)}></input>
            
            <button className={styles.button} onClick={loginVerify}>Continue</button>
        </>
    )
}

export default SignIn