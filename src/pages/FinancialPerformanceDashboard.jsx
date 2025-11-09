
import React, { useMemo, useState } from 'react';
import { useDados } from '../contexts/DadosContext';
import SeletorArquivos from '../components/core/SeletorArquivos';
import TelaCarregamento from '../components/core/TelaCarregamento';
import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer // Importando LineChart
} from 'recharts';

// Importa os componentes que criamos
import { calcularMetricasCFO } from '../utils/calculosCFO';
import { formatarNumero, formatarDecimal, formatarPercentual } from '../utils/formatadores';
import FiltrosCFO from '../components/dashboards/FiltrosCFO';
import SecaoExpansivel from '../components/dashboards/SecaoExpansivel';
import KPI from '../components/dashboards/KPI';
import GraficoWrapper from '../components/charts/GraficoWrapper';
import GraficoRosca from '../components/charts/GraficoRosca';

// --- Styled Components ---

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
  h2 { font-size: 1.8rem; }
  p { font-size: 1.1rem; opacity: 0.8; }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

// Novo componente para a mensagem de filtro
const MensagemInformativa = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  margin-top: 1.5rem;
`;

// --- Paleta de Cores e Estilos ---
const CORES_GRAFICOS = ['#3182CE', '#38A169', '#ED8936', '#718096', '#E53E3E'];
const CORES_PIE = ['#3182CE', '#38A169', '#ED8936'];
const CORES_LINHA = ['#3182CE', '#38A169', '#ED8936', '#718096'];

const estiloTooltip = {
  labelStyle: { color: '#1A202C' },
  itemStyle: { color: '#1A202C' }
};

// --- Componente Principal ---

const FinancialPerformanceDashboard = () => {
  const { dadosFinanceiros, dadosTransacoes, estaCarregando, erro } = useDados();
  
  const [filtros, setFiltros] = useState({ dataInicio: '', dataFim: '' });

  const metricas = useMemo(() => {
    // Passa ambos os datasets para a função de cálculo
    return calcularMetricasCFO(dadosFinanceiros, dadosTransacoes, filtros);
  }, [dadosFinanceiros, dadosTransacoes, filtros]);

  // --- Renderização ---

  if (estaCarregando) {
    return <TelaCarregamento />;
  }
  
  if (dadosFinanceiros.length === 0) {
    return (
      <DashboardContainer>
        <BemVindo>
          <h2>Financial Performance Dashboard</h2>
          <p>To get started, please load your transaction and financial data files.</p>
        </BemVindo>
        {erro && <ErrorMessage>{erro}</ErrorMessage>}
        <SeletorArquivos />
      </DashboardContainer>
    );
  }

  const { kpis, chartData } = metricas;

  return (
    <DashboardContainer>
      {erro && <ErrorMessage>{erro}</ErrorMessage>}
      
      <FiltrosCFO filtros={filtros} setFiltros={setFiltros} />

      {/* Seção Balanço Patrimonial */}
      <SecaoExpansivel titulo="Balance Sheet">
        <KpiGrid>
          <KPI titulo="Total Assets" valor={`$${formatarDecimal(kpis.totalAtivos)}`} />
          <KPI titulo="Total Liabilities" valor={`$${formatarDecimal(kpis.totalPassivos)}`} />
          <KPI titulo="Total Equity" valor={`$${formatarDecimal(kpis.patrimonioLiquido)}`} />
        </KpiGrid>
        <ChartGrid>
          <GraficoWrapper titulo="Assets (Current vs. Non-Current)">
            <PieChart>
              <Pie data={chartData.chartAtivos} dataKey="value" nameKey="name" outerRadius={120} >
                {chartData.chartAtivos?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
          <GraficoWrapper titulo="Liabilities (Current vs. Non-Current)">
            <PieChart>
              <Pie data={chartData.chartPassivos} dataKey="value" nameKey="name" outerRadius={120} >
                {chartData.chartPassivos?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
          <GraficoRosca
            titulo="Balance Sheet Distribution"
            data={chartData.chartBalancoTotal}
            cores={CORES_PIE}
            estiloTooltip={estiloTooltip}
          />
          <GraficoWrapper titulo="Activity Types">
            <BarChart data={chartData.chartTiposAtividade} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} fontSize={10} />
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Bar dataKey="Total" fill={CORES_GRAFICOS[0]} />
            </BarChart>
          </GraficoWrapper>
        </ChartGrid>
      </SecaoExpansivel>

      {/* Seção DRE */}
      <SecaoExpansivel titulo="Income Statement (DRE)">
        <KpiGrid>
          <KPI titulo="Gross Revenue" valor={`$${formatarDecimal(kpis.receitaBruta)}`} />
          <KPI titulo="Net Revenue" valor={`$${formatarDecimal(kpis.receitaLiquida)}`} />
          <KPI titulo="Gross Profit" valor={`$${formatarDecimal(kpis.lucroBruto)}`} />
          <KPI titulo="Operating Profit" valor={`$${formatarDecimal(kpis.lucroOperacional)}`} />
          <KPI titulo="Net Profit" valor={`$${formatarDecimal(kpis.lucroLiquido)}`} />
          <KPI titulo="Gross Margin" valor={formatarPercentual(kpis.margemBruta)} />
          <KPI titulo="Operating Margin" valor={formatarPercentual(kpis.margemOperacional)} />
          <KPI titulo="Net Margin" valor={formatarPercentual(kpis.margemLiquida)} />
          <KPI titulo="Avg. Repasse Ticket (from Tx)" valor={`$${formatarDecimal(kpis.ticketMedioRepasse)}`} />
        </KpiGrid>
        <ChartGrid>
          <GraficoWrapper titulo="Transactions by Time of Day (from Tx)">
            <PieChart>
              <Pie data={chartData.chartTurnos} dataKey="value" nameKey="name" outerRadius={120} >
                {chartData.chartTurnos?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
          <GraficoWrapper titulo="Total Repasse by Day of Week (from Tx)">
            <BarChart data={chartData.chartRepasseDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Bar dataKey="Repasse" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>
          <GraficoWrapper titulo="Avg. Ticket by Day of Week (from Tx)">
            <BarChart data={chartData.chartTicketMedio}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Bar dataKey="Average Ticket" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>
        </ChartGrid>
      </SecaoExpansivel>

      {/* Seção Índices de Liquidez */}
      <SecaoExpansivel titulo="Liquidity Ratios">
        <KpiGrid>
          <KPI titulo="Current Ratio" valor={formatarDecimal(kpis.liquidezCorrente)} />
          <KPI titulo="Quick Ratio" valor={formatarDecimal(kpis.liquidezImediata)} />
          <KPI titulo="General Ratio" valor={formatarDecimal(kpis.liquidezGeral)} />
        </KpiGrid>
        <ChartGrid>
          <GraficoWrapper titulo="Liquidity Ratios Comparison">
            <BarChart data={chartData.chartIndicesLiquidez} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatarDecimal(value)} {...estiloTooltip} />
              <Bar dataKey="value" fill={CORES_GRAFICOS[2]} />
            </BarChart>
          </GraficoWrapper>
        </ChartGrid>
      </SecaoExpansivel>

      {/* Seção Índices de Endividamento */}
      <SecaoExpansivel titulo="Debt Ratios">
        <KpiGrid>
          <KPI titulo="Third-Party Capital" valor={formatarPercentual(kpis.partCapitalTerceiros)} />
          <KPI titulo="Debt Composition" valor={formatarPercentual(kpis.composicaoEndividamento)} />
          <KPI titulo="Equity Immobilization" valor={formatarPercentual(kpis.imobilizacaoPL)} />
        </KpiGrid>
        <ChartGrid>
          <GraficoWrapper titulo="Third-Party Capital Ratio">
            <PieChart>
              <Pie data={chartData.chartPartCapital} dataKey="value" nameKey="name" outerRadius={100} >
                {chartData.chartPartCapital?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
          <GraficoWrapper titulo="Debt Composition Ratio">
            <PieChart>
              <Pie data={chartData.chartCompEndividamento} dataKey="value" nameKey="name" outerRadius={100} >
                {chartData.chartCompEndividamento?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
          <GraficoWrapper titulo="Equity Immobilization Ratio">
            <PieChart>
              <Pie data={chartData.chartImobilizacao} dataKey="value" nameKey="name" outerRadius={100} >
                {chartData.chartImobilizacao?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
        </ChartGrid>
      </SecaoExpansivel>
      
      {/* Seção Análise de Receita (com Evolução Condicional) */}
      <SecaoExpansivel titulo="User Revenue Analysis (from Tx)">
        <KpiGrid>
          <KPI titulo="Free Users (Unique)" valor={formatarNumero(kpis.numUsuariosGratuitos)} />
          <KPI titulo="Paid Users (Unique)" valor={formatarNumero(kpis.numUsuariosPagos)} />
          <KPI titulo="Free Merchants (Unique)" valor={formatarNumero(kpis.lojistasGratuitos)} />
          <KPI titulo="Paid Merchants (Unique)" valor={formatarNumero(kpis.lojistasPagos)} />
          <KPI titulo="Total RPU (Period)" valor={`$${formatarDecimal(kpis.RPU_Mensal_Geral)}`} />
          <KPI titulo="RPU (Free Users)" valor={`$${formatarDecimal(kpis.RPU_Usuarios_Gratuitos)}`} />
          <KPI titulo="RPU (Paid Users)" valor={`$${formatarDecimal(kpis.RPU_Usuarios_Pagos)}`} />
          <KPI titulo="LTV (Free Merchants)" valor={`$${formatarDecimal(kpis.LTV_Usuarios_Gratuitos)}`} />
          <KPI titulo="LTV (Paid Merchants)" valor={`$${formatarDecimal(kpis.LTV_Usuarios_Pagos)}`} />
        </KpiGrid>
        
        {/* --- LÓGICA CONDICIONAL PARA GRÁFICOS DE LINHA --- */}
        {chartData.exibirGraficosEvolucao ? (
          <ChartGrid>
            <GraficoWrapper titulo="RPU Evolution (Monthly)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.chartEvolucaoRPU}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
                  <Legend />
                  <Line type="monotone" dataKey="RPU Geral" stroke={CORES_LINHA[0]} />
                  <Line type="monotone" dataKey="RPU Gratuito" stroke={CORES_LINHA[1]} />
                  <Line type="monotone" dataKey="RPU Pago" stroke={CORES_LINHA[2]} />
                </LineChart>
              </ResponsiveContainer>
            </GraficoWrapper>
            <GraficoWrapper titulo="LTV Evolution (Monthly)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.chartEvolucaoLTV}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
                  <Legend />
                  <Line type="monotone" dataKey="LTV Gratuito" stroke={CORES_LINHA[1]} />
                  <Line type="monotone" dataKey="LTV Pago" stroke={CORES_LINHA[2]} />
                </LineChart>
              </ResponsiveContainer>
            </GraficoWrapper>
            <GraficoWrapper titulo="User Base Evolution (Monthly)">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.chartEvolucaoUsuarios}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
                  <Legend />
                  <Line type="monotone" dataKey="Usuários Gratuitos" stroke={CORES_LINHA[0]} />
                  <Line type="monotone" dataKey="Usuários Pagos" stroke={CORES_LINHA[1]} />
                  <Line type="monotone" dataKey="Lojistas Gratuitos" stroke={CORES_LINHA[2]} />
                  <Line type="monotone" dataKey="Lojistas Pagos" stroke={CORES_LINHA[3]} />
                </LineChart>
              </ResponsiveContainer>
            </GraficoWrapper>
          </ChartGrid>
        ) : (
          <MensagemInformativa>
            Selecione um período de pelo menos 2 meses (ex: 01/10 a 01/11) para visualizar os gráficos de evolução.
          </MensagemInformativa>
        )}
        
      </SecaoExpansivel>

    </DashboardContainer>
  );
};

export default FinancialPerformanceDashboard;