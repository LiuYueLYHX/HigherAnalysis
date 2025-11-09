// src/components/charts/GraficoWrapper.jsx
import React from 'react';
import styled from 'styled-components';
import { ResponsiveContainer } from 'recharts';

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  height: 400px; /* Altura padrão para os gráficos */
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const GraficoWrapper = ({ titulo, children }) => {
  return (
    <ChartContainer>
      <ChartTitle>{titulo}</ChartTitle>
      {/* ResponsiveContainer garante que o gráfico se ajuste ao container */}
      <ResponsiveContainer width="100%" height="85%">
        {children}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default GraficoWrapper;