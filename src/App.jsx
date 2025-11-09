import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TemaProvider } from './contexts/TemaContext';
import { DadosProvider } from './contexts/DadosContext';
import GlobalStyles from './styles/GlobalStyles';
import ExecutiveOverviewDashboard from './pages/ExecutiveOverviewDashboard';
import FinancialPerformanceDashboard from './pages/FinancialPerformanceDashboard';
import Header from './components/core/Header';

function App() {
  return (
    <Router>
      <TemaProvider>
        <DadosProvider>
          <GlobalStyles />
          <Header />
          <main>
            <Routes>
              {/* Rota padrão redireciona para o dashboard do CEO */}
              <Route path="/" element={<Navigate to="/executive-overview" />} />
              <Route path="/executive-overview" element={<ExecutiveOverviewDashboard />} />
              <Route path="/financial-performance" element={<FinancialPerformanceDashboard />} />
            </Routes>
          </main>
        </DadosProvider>
      </TemaProvider>
    </Router>
  );
}

export default App;