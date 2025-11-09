// src/components/dashboards/KPI.jsx
import React from 'react';
import styled from 'styled-components';

const KpiCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const KpiTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const KpiValue = styled.p`
  font-size: 2.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.accent};
  margin: 0;
`;

const KpiSubValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
  margin-top: 0.25rem;
`;

/**
 * Componente para exibir um KPI.
 * @param {{titulo: string, valor: string | number, subValor?: string}} props
 */
const KPI = ({ titulo, valor, subValor }) => {
  return (
    <KpiCard>
      <KpiTitle>{titulo}</KpiTitle>
      <KpiValue>{valor}</KpiValue>
      {subValor && <KpiSubValue>{subValor}</KpiSubValue>}
    </KpiCard>
  );
};

export default KPI;