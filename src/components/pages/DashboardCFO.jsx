import { useEffect } from 'react'
import {ResponsiveContainer, BarChart, Legend, Tooltip, CartesianGrid, Bar, XAxis, YAxis, PieChart, Pie, Cell} from 'recharts'
import styles from './DashboardCFO.module.css'

const chart3Data = [
    {
        "name": "Ativo",
        "value": 150000000
    },
    {
        "name": "Passivo",
        "value": 70000000
    },
    {
        "name": "PL",
        "value": 80000000
    }
]

const chart2Data = [
    {
        "name": "Passivo e PL",
        "Passivo Circulante": 20000000,
        "Passivo Não Circulante": 50000000,
        "PL": 80000000
    }
]

const chart1Data = [
    { "name": "Ativo","Ativo Circulante": 100000000, "Ativo Não Circulante" : 50000000}
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
            <div>
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
                <div className={styles.containerCharts}>
                    <div className={styles.containerChart}>
                        <div className={styles.containerChartTitle}>Ativo Circulante e Não Circulante</div>
                        <ResponsiveContainer height="300px" width="100%" aspect={2}>
                            <BarChart title="Ativo" data={chart1Data} 
                            barCategoryGap = "30%"
                            barSize={100}
                            barGap={50}
                            margin={{
                                top: 30,
                                left: 40,
                                right: 30,
                                bottom: 10
                            }}>
                                <CartesianGrid strokeDasharray="4 1 2"></CartesianGrid>
                                <xAxis dataKey="name"></xAxis>
                                <YAxis tickFormatter={formatter}></YAxis>
                                <Legend wrapperStyle={{top: "100%"}}></Legend>
                                <Tooltip formatter={(v) => formatter(v)}></Tooltip>
                                <Bar dataKey="Ativo Circulante" fill="green"></Bar>
                                <Bar dataKey="Ativo Não Circulante" fill="rgba(186, 255, 158, 1)"></Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.containerChart}>
                        <div className={styles.containerChartTitle}>Passivo Circulante, Passivo Não Circulante e PL</div>
                        <ResponsiveContainer height="300px" width="100%" aspect={2}>
                            <BarChart title="Passivo e PL" data={chart2Data} 
                            barCategoryGap = "20%"
                            barSize={40}
                            barGap={80}
                            margin={{
                                top: 30,
                                left: 40,
                                right: 30,
                                bottom: 10
                            }}>
                                <CartesianGrid strokeDasharray="4 1 2"></CartesianGrid>
                                <xAxis dataKey="name"></xAxis>
                                <YAxis tickFormatter={formatter}></YAxis>
                                <Legend wrapperStyle={{top: "100%"}}></Legend>
                                <Tooltip formatter={(v) => formatter(v)}></Tooltip>
                                <Bar dataKey="Passivo Circulante" fill="red"></Bar>
                                <Bar dataKey="Passivo Não Circulante" fill="rgba(255, 180, 180, 1)"></Bar>
                                <Bar dataKey="PL" fill="rgba(0, 140, 196, 1)"></Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.containerChart}>
                        <div className={styles.containerChartTitle}>Ativo, Passivo e PL</div>
                        <ResponsiveContainer height="300px" width="100%" aspect={2}>
                            <PieChart data={chart3Data}>
                                <Pie
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    outerRadius={100}
                                >
                                    
                                <Cell key={`cell-1`} fill="green"></Cell>
                                <Cell key={`cell-2`} fill="red"></Cell>
                                <Cell key={`cell-3`} fill="rgba(0, 140, 196, 1)"></Cell>
                                    
                                </Pie>
                                <Tooltip formatter={(v) => formatter(v)}></Tooltip>
                                <Legend wrapperStyle={{top: "100%"}}></Legend>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            


            <div className={styles.page}>
                <div className={styles.containerTitle}>
                    Operational KPIs
                </div>
                
                <div className={styles.containerSelectBox}>
                    <div>
                        <div>Periodo</div>
                        <select>
                            <option>All</option>
                            <option>Amarelo</option>
                            <option>Preto</option>
                            <option>Vermelho</option>
                            <option>Abacate</option>
                        </select>
                    </div>
                    <div>
                        <div>Região</div>
                        <select>
                            <option>All</option>
                            <option>Amarelo</option>
                            <option>Preto</option>
                            <option>Vermelho</option>
                            <option>Abacate</option>
                        </select>
                    </div>
                    <div>
                        <div>Loja</div>
                        <select>
                            <option>All</option>
                            <option>Amarelo</option>
                            <option>Preto</option>
                            <option>Vermelho</option>
                            <option>Abacate</option>
                        </select>
                    </div>
                    
                </div>
                <div>
                    
                    <div className={styles.KPIs}>
                        <div className={styles.bgComponent + " " + styles.bigData}>
                            <div style={{padding: "30px"}}>
                                <div className={styles.bigDataNumber}>65%</div>
                                <div>Margem Bruta</div>
                            </div>
                            <div className={styles.containerChart}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {"name": "Margem Bruta", "value": 65}, 
                                                {"name": "NaN", "value": 35}
                                                ]}
                                            dataKey="value"
                                            nameKey="name"
                                            >
                                                <Cell key={`cells-1`} fill="rgba(255, 0, 0, 1)"></Cell>
                                                <Cell key={`cells-2`} fill="rgba(255,255,255,0)"></Cell>
                                            </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className={styles.bgComponent + " " + styles.bigData}>
                            <div style={{padding: "30px"}}>
                                <div className={styles.bigDataNumber}>41.99%</div>
                                <div>Margem Operacional</div>
                            </div>
                            <div className={styles.containerChart}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {"name": "Margem Operacional", "value": 41.99}, 
                                                {"name": "NaN", "value": 58}
                                                ]}
                                            dataKey="value"
                                            nameKey="name"
                                            >
                                                <Cell key={`cells-1`} fill="green"></Cell>
                                                <Cell key={`cells-2`} fill="rgba(255,255,255,0)"></Cell>
                                            </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className={styles.bgComponent + " " + styles.bigData}>
                            <div style={{padding: "30px"}}>
                                <div className={styles.bigDataNumber}>38.1%</div>
                                <div>Margem Líquida</div>
                            </div>
                            <div className={styles.containerChart}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {"name": "Margem Líquida", "value": 38.1}, 
                                                {"name": "NaN", "value": 62}
                                                ]}
                                            dataKey="value"
                                            nameKey="name"
                                            >
                                                <Cell key={`cells-1`} fill="rgba(0, 140, 196, 1)"></Cell>
                                                <Cell key={`cells-2`} fill="rgba(255,255,255,0)"></Cell>
                                            </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCFO