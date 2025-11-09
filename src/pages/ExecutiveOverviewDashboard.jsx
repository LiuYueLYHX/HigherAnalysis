import React, { useMemo, useState } from 'react';
import { useDados } from '../contexts/DadosContext';
import SeletorArquivos from '../components/core/SeletorArquivos';
import TelaCarregamento from '../components/core/TelaCarregamento';
import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';

// Importa os componentes que criamos
import { useFiltrosExecutive } from '../hooks/useFiltrosExecutive';
import { calcularMetricasExecutive } from '../utils/calculosExecutive';
import { formatarNumero, formatarDecimal, formatarPercentual } from '../utils/formatadores';
import FiltrosExecutive from '../components/dashboards/FiltrosExecutive';
import SecaoExpansivel from '../components/dashboards/SecaoExpansivel';
import KPI from '../components/dashboards/KPI';
import GraficoWrapper from '../components/charts/GraficoWrapper';

// --- Styled Components (Estilos da Página) ---

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

// Grid para KPIs
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

// Grid para Gráficos
const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const ChartGridTriple = styled(ChartGrid)`
  /* Grid específico para 3 gráficos */
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
`;

// Container para filtros de gráficos
const ChartFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChartFilterButton = styled.button`
  background: ${({ theme, $isActive }) => $isActive ? theme.accent : theme.body};
  color: ${({ theme, $isActive }) => $isActive ? '#FFF' : theme.text};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.8;
  }
`;

// --- NOVA PALETA DE CORES CORPORATIVA ---
// Paleta principal variada
const CORES_GRAFICOS = ['#3182CE', '#38A169', '#ED8936', '#718096', '#E53E3E'];
// Paleta para gráficos de pizza (cores distintas)
const CORES_PIE = ['#3182CE', '#38A169', '#ED8936'];
// Paleta sequencial para faixas etárias (do claro ao escuro)
const CORES_FAIXA_ETARIA = ['#EBF8FF', '#BEE3F8', '#90CDF4', '#63B3ED', '#4299E1', '#3182CE'];
// --- FIM DA NOVA PALETA ---

// --- Estilo para corrigir o Tooltip ---
const estiloTooltip = {
  labelStyle: { color: '#1A202C' }, // Cor escura para o título
  itemStyle: { color: '#1A202C' }   // Cor escura para os itens
};

// --- Componente Principal ---

const ExecutiveOverviewDashboard = () => {
  const { dadosTransacoes, estaCarregando, erro } = useDados();
  
  // Estado para o filtro Top N do gráfico 15 
  const [topNEstab, setTopNEstab] = useState(10);

  // 1. Hook de Filtros
  const { filtros, setFiltros, dadosFiltrados, opcoesFiltros } = useFiltrosExecutive(dadosTransacoes);

  // 2. Memoiza os cálculos
  const metricas = useMemo(() => {
    return calcularMetricasExecutive(dadosFiltrados);
  }, [dadosFiltrados]);

  // --- Renderização ---

  if (estaCarregando) {
    return <TelaCarregamento />;
  }
  
  if (dadosTransacoes.length === 0) {
    return (
      <DashboardContainer>
        <BemVindo>
          <h2>Executive Overview Dashboard</h2>
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
      
       {/* 1. Barra de Filtros [cite: 20] */}
      <FiltrosExecutive filtros={filtros} setFiltros={setFiltros} opcoes={opcoesFiltros} />

       {/* 2. Seção de KPIs [cite: 30] */}
      <SecaoExpansivel titulo="Key Performance Indicators (KPIs)">
        <KpiGrid>
          {kpis && (
            <>
              <KPI titulo="Total Coupons Captured" valor={formatarNumero(kpis.totalCupons)} />
              <KPI titulo="Total Revenue (Repasse)" valor={`$${formatarDecimal(kpis.valorTotalMovimentado)}`} />
              <KPI titulo="Average Ticket (Repasse)" valor={`$${formatarDecimal(kpis.ticketMedio)}`} />
              <KPI titulo="Active Users" valor={formatarNumero(kpis.numUsuariosAtivos)} />
              <KPI titulo="Average Audience Age" valor={formatarDecimal(kpis.idadeMediaPublico)} />
              <KPI 
                titulo="Gender Distribution" 
                valor={`${formatarPercentual(kpis.distribuicaoGenero?.masculino)} M`} 
                subValor={`${formatarPercentual(kpis.distribuicaoGenero?.feminino)} F`} 
              />
              <KPI titulo="Avg. Use Frequency" valor={formatarDecimal(kpis.frequenciaMediaUso)} />
              <KPI titulo="Free Users (Unique)" valor={formatarNumero(kpis.numUsuariosGratuitos)} />
              <KPI titulo="Paid Users (Unique)" valor={formatarNumero(kpis.numUsuariosPagos)} />
              <KPI titulo="Free Merchants (Unique)" valor={formatarNumero(kpis.lojistasGratuitos)} />
              <KPI titulo="Paid Merchants (Unique)" valor={formatarNumero(kpis.lojistasPagos)} />
              <KPI titulo="Daily Active Users (DAU)" valor={formatarNumero(kpis.usuariosAtivosDiarios)} />
              <KPI titulo="Avg. Session Time" valor={`${formatarDecimal(kpis.tempoMedioAplicacao)} min`} />
              <KPI titulo="Sessions per User" valor={formatarDecimal(kpis.sessoesPorUsuario)} />
            </>
          )}
        </KpiGrid>
      </SecaoExpansivel>

       {/* 3. Seções de Gráficos (Organizadas harmonicamente) [cite: 47, 68] */}

      <SecaoExpansivel titulo="User Demographics & Behavior">
        <ChartGridTriple>
           {/* Gráfico 1: Categoria x Idade Média [cite: 48] */}
          <GraficoWrapper titulo="Average Age by Frequented Category">
            <BarChart data={chartData.chartCategoriaIdade} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={10} />
              <Tooltip formatter={(value) => formatarDecimal(value)} {...estiloTooltip} />
              <Bar dataKey="Average Age" fill={CORES_GRAFICOS[0]} />
            </BarChart>
          </GraficoWrapper>
          
           {/* Gráfico 2: Sexo por Categoria [cite: 49] */}
          <GraficoWrapper titulo="Gender Distribution by Frequented Category">
            <BarChart data={chartData.chartSexoCategoria} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip {...estiloTooltip} />
              <Legend />
              <Bar dataKey="Male" stackId="a" fill={CORES_GRAFICOS[0]} />
              <Bar dataKey="Female" stackId="a" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>
          
           {/* Gráfico 5: Atividade (Trabalho/Estudo) [cite: 52] */}
          <GraficoWrapper titulo="User Activity (Work/Study)">
            <PieChart>
              <Pie data={chartData.chartTrabalhaEstuda} dataKey="value" nameKey="name" outerRadius={120} fill="#8884d8">
                {chartData.chartTrabalhaEstuda?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
        </ChartGridTriple>
        <ChartGridTriple>
            {/* Gráfico 8: Categorias / Só Trabalha [cite: 57] */}
          <GraficoWrapper titulo="Top Categories (Works Only)">
            <BarChart data={chartData.chartCatSoloTrabalha?.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={10} />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Bar dataKey="Transactions" fill={CORES_GRAFICOS[0]} />
            </BarChart>
          </GraficoWrapper>
           {/* Gráfico 9: Categorias / Só Estuda [cite: 58] */}
          <GraficoWrapper titulo="Top Categories (Studies Only)">
            <BarChart data={chartData.chartCatSoloEstuda?.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={10} />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Bar dataKey="Transactions" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>
           {/* Gráfico 10: Categorias / Ambos [cite: 59] */}
          <GraficoWrapper titulo="Top Categories (Works & Studies)">
            <BarChart data={chartData.chartCatTrabalhaEstuda?.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={10} />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Bar dataKey="Transactions" fill={CORES_GRAFICOS[2]} />
            </BarChart>
          </GraficoWrapper>
        </ChartGridTriple>
      </SecaoExpansivel>

      <SecaoExpansivel titulo="Geographic Analysis">
        <ChartGrid>
           {/* Gráfico 3: Transações por Cidade [cite: 50] */}
          <GraficoWrapper titulo="Transactions by Home City (Top 15)">
            <BarChart data={chartData.chartTransacoesCidade?.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Bar dataKey="Transactions" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>
          
           {/* Gráfico 4: Transações por Bairro [cite: 51] */}
          <GraficoWrapper titulo="Transactions by Home Neighborhood (Top 15)">
            <BarChart data={chartData.chartTransacoesBairro?.slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Bar dataKey="Transactions" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>

           {/* Gráfico 11: Bairros mais rentáveis [cite: 60] */}
          <GraficoWrapper titulo="Most Profitable Neighborhoods (Revenue)">
            <BarChart data={chartData.chartBairrosRentaveis?.slice(0, 15)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={10} />
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Bar dataKey="Revenue" fill={CORES_GRAFICOS[0]} />
            </BarChart>
          </GraficoWrapper>
        </ChartGrid>
        <ChartGrid>
           {/* Gráfico 6: Faixa Etária por Cidade [cite: 53] */}
          <GraficoWrapper titulo="Age Group by Home City (Top 10)">
            <BarChart data={chartData.chartFaixaEtariaCidade?.slice(0, 10)} layout="vertical" stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(tick) => formatarPercentual(tick)} />
              <YAxis dataKey="name" type="category" width={100} fontSize={10} />
              <Tooltip formatter={(value, name) => [formatarNumero(value), name]} {...estiloTooltip} />
              <Legend />
              {chartData.faixasEtarias?.map((faixa, i) => (
                <Bar key={faixa} dataKey={faixa} stackId="a" fill={CORES_FAIXA_ETARIA[i % CORES_FAIXA_ETARIA.length]} />
              ))}
            </BarChart>
          </GraficoWrapper>
           {/* Gráfico 7: Faixa Etária por Bairro [cite: 54] */}
          <GraficoWrapper titulo="Age Group by Home Neighborhood (Top 10)">
            <BarChart data={chartData.chartFaixaEtariaBairro?.slice(0, 10)} layout="vertical" stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(tick) => formatarPercentual(tick)} />
              <YAxis dataKey="name" type="category" width={100} fontSize={10} />
              <Tooltip formatter={(value, name) => [formatarNumero(value), name]} {...estiloTooltip} />
              <Legend />
              {chartData.faixasEtarias?.map((faixa, i) => (
                <Bar key={faixa} dataKey={faixa} stackId="a" fill={CORES_FAIXA_ETARIA[i % CORES_FAIXA_ETARIA.length]} />
              ))}
            </BarChart>
          </GraficoWrapper>
        </ChartGrid>
      </SecaoExpansivel>
      
      <SecaoExpansivel titulo="Establishment & Campaign Performance">
        <ChartGrid>
           {/* Gráfico 12: Transações por Tipo de Cupom [cite: 61] */}
          <GraficoWrapper titulo="Transactions by Coupon Type">
            <PieChart>
              <Pie data={chartData.chartTipoCupom} dataKey="value" nameKey="name" outerRadius={120} fill="#8884d8">
                {chartData.chartTipoCupom?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_PIE[index % CORES_PIE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Legend />
            </PieChart>
          </GraficoWrapper>
          
           {/* Gráfico 13: Valor de Cupom por Categoria Estab. [cite: 62] */}
          <GraficoWrapper titulo="Total Coupon Value by Est. Category">
            <BarChart data={chartData.chartValorCupomCategoria?.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
              <Bar dataKey="CouponValue" fill={CORES_GRAFICOS[1]} />
            </BarChart>
          </GraficoWrapper>

           {/* Gráfico 16: Transações por Hora [cite: 65] */}
          <GraficoWrapper titulo="Transactions by Hour of Day">
            <LineChart data={chartData.chartTransacoesHora}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Line type="monotone" dataKey="Transactions" stroke={CORES_GRAFICOS[0]} strokeWidth={2} />
            </LineChart>
          </GraficoWrapper>
          
           {/* Gráfico 17: Ranking de Campanhas [cite: 66] */}
          <GraficoWrapper titulo="Campaign Ranking (Top 10)">
            <BarChart data={chartData.chartRankingCampanhas?.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} fontSize={10} />
              <Tooltip formatter={(value) => formatarNumero(value)} {...estiloTooltip} />
              <Bar dataKey="Transactions" fill={CORES_GRAFICOS[0]} />
            </BarChart>
          </GraficoWrapper>

           {/* Gráfico 14: Cupons por Tipo / Bairro Estab. [cite: 63] */}
          <GraficoWrapper titulo="Coupon Types by Est. Neighborhood (Top 10)">
            <BarChart data={chartData.chartTiposCupomBairro?.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} fontSize={10} />
              <Tooltip {...estiloTooltip} />
              <Legend />
              {chartData.tiposDeCupom?.map((tipo, i) => (
                <Bar key={tipo} dataKey={tipo} stackId="a" fill={CORES_GRAFICOS[i % CORES_GRAFICOS.length]} />
              ))}
            </BarChart>
          </GraficoWrapper>
          
           {/* Gráfico 15: Rentabilidade por Estabelecimento [cite: 64] */}
          <GraficoWrapper titulo="Revenue by Establishment">
            <ChartFilterContainer>
              <ChartFilterButton onClick={() => setTopNEstab(5)} $isActive={topNEstab === 5}>Top 5</ChartFilterButton>
              <ChartFilterButton onClick={() => setTopNEstab(10)} $isActive={topNEstab === 10}>Top 10</ChartFilterButton>
              <ChartFilterButton onClick={() => setTopNEstab(20)} $isActive={topNEstab === 20}>Top 20</ChartFilterButton>
              <ChartFilterButton onClick={() => setTopNEstab(null)} $isActive={!topNEstab}>All</ChartFilterButton>
            </ChartFilterContainer>
            <ResponsiveContainer width="100%" height="75%">
              <BarChart data={topNEstab ? chartData.chartRentabilidadeEstab?.slice(0, topNEstab) : chartData.chartRentabilidadeEstab} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} fontSize={10} />
                <Tooltip formatter={(value) => `$${formatarDecimal(value)}`} {...estiloTooltip} />
                <Bar dataKey="Revenue" fill={CORES_GRAFICOS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </GraficoWrapper>

        </ChartGrid>
      </SecaoExpansivel>

    </DashboardContainer>
  );
};

export default ExecutiveOverviewDashboard;