import {Routes} from 'react-router-dom'
import styles from './Container.module.css'

function Container(props){
    return(
        <div className={styles.container}>
            <Routes>
                {props.children}
            </Routes>
        </div>
    )
}

export default Container