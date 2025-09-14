import { useEffect } from 'react'
import {ResponsiveContainer, BarChart, Legend, Tooltip, CartesianGrid, Bar, XAxis, YAxis} from 'recharts'
import styles from './DashboardCFO.module.css'

const chart3Data = [
    {
        "title": "Passivo",
        "circulante": 1000000,
        "n-circulante": 50000000
    },
    {
        "title" : "PL",
        "value": 99000000000
    }
]

const chart2Data = [
    {
        "title": "Passivo",
        "circulante": 1000000,
        "n-circulante": 50000000
    },
    {
        "title" : "PL",
        "value": 99000000000
    }
]

const chart1Data = [
    { "name": "Circulante", "Ativo Circulante": 100000000},
    { "name": "Não Circulante", "Ativo Ñ Circulante": 50000000}
]

function DashboardCFO(){
    useEffect(()=>{
        document.documentElement.style.setProperty("--bg-color", "rgba(255, 255, 255, 1)");
        document.documentElement.style.setProperty("--container-background-color", "rgba(228, 228, 228, 1)");
    },[]);
    function formatter(value){
        if(value >= 1000000){
            return "R$ "+ value/1000000 + "mi"
        }
        return "R$ " + value
    }
    return(
        <div className={styles.container}>
            <div className={styles.containerTitle}>
                Balanço Patrimonial
            </div>
            <div style={{display: "flex"}}>
                <div className={styles.containerBigDataBalance}>
                    Ativo
                    <div>
                        R$ 100.000.000,00
                    </div>
                </div>
                <div className={styles.containerBigDataBalance}>
                    Passivo
                    <div style={{backgroundColor: "red"}}>
                        R$ 100.000.000,00
                    </div>
                </div>
                <div className={styles.containerBigDataBalance}>
                    Patrimônio Líquido
                    <div style={{backgroundColor: "rgba(61, 139, 255, 1)"}}>
                        R$ 100.000.000,00
                    </div>
                </div>
                <div className={styles.containerBigDataBalance}>
                    Status
                    <div>
                        EQUILIBRADO
                    </div>
                </div>
            </div>
            <div className={styles.containerChart}>
                <ResponsiveContainer width="33%" aspect={2}>
                    <BarChart title="Ativo" data={chart1Data} 
                    barCategoryGap = "0%"
                    barSize={100}
                    margin={{
                        top: 30,
                        left: 40,
                        right: 30,
                        bottom: 10
                    }}>
                        <CartesianGrid strokeDasharray="4 1 2"></CartesianGrid>
                        <xAxis dataKey="name"></xAxis>
                        <YAxis tickFormatter={formatter}></YAxis>
                        <Legend></Legend>
                        <Tooltip formatter={(v) => formatter(v)}></Tooltip>
                        <Bar dataKey="Ativo Circulante" fill="green"></Bar>
                        <Bar dataKey="Ativo Ñ Circulante" fill="rgba(186, 255, 158, 1)"></Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default DashboardCFO