import React from 'react';
import { useDados } from '../contexts/DadosContext';
import SeletorArquivos from '../components/core/SeletorArquivos';
import TelaCarregamento from '../components/core/TelaCarregamento';
import styled from 'styled-components';

// Reutilizando os mesmos estilos
const DashboardContainer = styled.div`
  width: 100%;
`;

const ErrorMessage = styled.p`
  background-color: #FED7D7;
  color: #C53030;
  border: 1px solid #FC8181;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  max-width: 800px;
  margin: 1rem auto;
`;

const BemVindo = styled.div`
  text-align: center;
  h2 {
    font-size: 1.8rem;
  }
  p {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

const FinancialPerformanceDashboard = () => {
  const { dadosFinanceiros, estaCarregando, erro } = useDados();

  if (estaCarregando) {
    return <TelaCarregamento />;
  }
  
  if (dadosFinanceiros.length === 0) {
    return (
      <DashboardContainer>
        <BemVindo>
          <h2>Financial Performance Dashboard</h2>
          <p>Para começar, carregue os arquivos de dados.</p>
        </BemVindo>
        {erro && <ErrorMessage>{erro}</ErrorMessage>}
        <SeletorArquivos />
      </DashboardContainer>
    );
  }

  // TODO: Renderizar as seções, KPIs e gráficos financeiros
  return (
    <DashboardContainer>
      <h2>Financial Performance Dashboard</h2>
      {erro && <ErrorMessage>{erro}</ErrorMessage>}
      
      <p>{dadosFinanceiros.length} registros financeiros carregados com sucesso.</p>
      
    </DashboardContainer>
  );
};

export default FinancialPerformanceDashboard;