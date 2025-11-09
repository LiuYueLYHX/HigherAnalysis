import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GraficoWrapper from './GraficoWrapper';

// Componente reutilizável para gráfico de Rosca (Donut)
const GraficoRosca = ({ titulo, data, cores, estiloTooltip }) => {
  return (
    <GraficoWrapper titulo={titulo}>
      <PieChart>
        {/* O gráfico de rosca é um PieChart com innerRadius e outerRadius */}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60} // Raio interno (cria o buraco)
          outerRadius={100} // Raio externo
          fill="#8884d8"
          paddingAngle={5}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} {...estiloTooltip} />
        <Legend />
      </PieChart>
    </GraficoWrapper>
  );
};

export default GraficoRosca;