import React from 'react';
import { useDados } from '../contexts/DadosContext';
import SeletorArquivos from '../components/core/SeletorArquivos';
import TelaCarregamento from '../components/core/TelaCarregamento';
import styled from 'styled-components';

// Container para o conteúdo do dashboard
const DashboardContainer = styled.div`
  width: 100%;
`;

// Mensagem de erro estilizada
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

const ExecutiveOverviewDashboard = () => {
  const { dadosTransacoes, estaCarregando, erro } = useDados();

  if (estaCarregando) {
    return <TelaCarregamento />;
  }
  
  // Se não houver dados, mostra a tela de boas-vindas e seleção de arquivos.
  if (dadosTransacoes.length === 0) {
    return (
      <DashboardContainer>
        <BemVindo>
          <h2>Executive Overview Dashboard</h2>
          <p>Para começar, carregue os arquivos de dados.</p>
        </BemVindo>
        {erro && <ErrorMessage>{erro}</ErrorMessage>}
        <SeletorArquivos />
      </DashboardContainer>
    );
  }

  // TODO: Renderizar os KPIs e gráficos aqui
  return (
    <DashboardContainer>
      <h2>Executive Overview Dashboard</h2>
      {erro && <ErrorMessage>{erro}</ErrorMessage>}
      
      <p>{dadosTransacoes.length} transações carregadas com sucesso.</p>
      {/* Próximo passo: Implementar os filtros dinâmicos e os gráficos */}
      
    </DashboardContainer>
  );
};

export default ExecutiveOverviewDashboard;