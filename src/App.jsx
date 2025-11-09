import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TemaProvider } from './contexts/TemaContext';
import { DadosProvider } from './contexts/DadosContext';
import GlobalStyles from './styles/GlobalStyles';
import ExecutiveOverviewDashboard from './pages/ExecutiveOverviewDashboard';
import FinancialPerformanceDashboard from './pages/FinancialPerformanceDashboard';
import Header from './components/core/Header';
import styled from 'styled-components';

// Novo container para centralizar o conteúdo principal
const LayoutContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

function App() {
  return (
    <Router>
      <TemaProvider>
        <DadosProvider>
          <GlobalStyles />
          <Header />
          <LayoutContainer>
            <main>
              <Routes>
                <Route path="/" element={<Navigate to="/executive-overview" />} />
                <Route path="/executive-overview" element={<ExecutiveOverviewDashboard />} />
                <Route path="/financial-performance" element={<FinancialPerformanceDashboard />} />
              </Routes>
            </main>
          </LayoutContainer>
        </DadosProvider>
      </TemaProvider>
    </Router>
  );
}

export default App;