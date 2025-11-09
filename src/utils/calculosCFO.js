// --- Funções Auxiliares de Filtro e Agregação ---

/**
 * Filtra dados por um range de datas.
 */
const filtrarPorData = (dados, chaveData, dataInicio, dataFim) => {
  if (!dataInicio && !dataFim) {
    return dados; // Sem filtro, retorna tudo
  }
  return dados.filter(d => {
    const dataItem = d[chaveData];
    if (!dataItem) return false;
    if (dataInicio && dataItem < dataInicio) return false;
    if (dataFim && dataItem > dataFim) return false;
    return true;
  });
};

/**
 * Soma o Valor_Total de um array de dados financeiros com base em filtros.
 */
const somarFinanceiro = (dados, tipoPatrimonio, generoPatrimonio = null, tipoReceita = null) => {
  return dados.reduce((acc, d) => {
    let match = true;
    if (tipoPatrimonio && d.Tipo_Patrimonio !== tipoPatrimonio) match = false;
    if (generoPatrimonio && d.Genero_Patrimonio !== generoPatrimonio) match = false;
    if (tipoReceita && d.Tipo_Receita !== tipoReceita) match = false;
    
    // Garante que o valor seja um número antes de somar
    return match ? acc + (parseFloat(d.Valor_Total) || 0) : acc;
  }, 0);
};

/**
 * Agrupa e soma transações (Repasse).
 */
const agruparESomarTransacoes = (dados, chaveAgrupamento, chaveSoma) => {
  const soma = dados.reduce((acc, obj) => {
    const valorChave = obj[chaveAgrupamento] || 'N/A';
    acc[valorChave] = (acc[valorChave] || 0) + (obj[chaveSoma] || 0);
    return acc;
  }, {});
  return Object.entries(soma)
    .map(([name, Total]) => ({ name, Total }))
    .sort((a, b) => b.Total - a.Total);
};


// --- LÓGICA DE CÁLCULO DE RECEITA DE USUÁRIO (REUTILIZÁVEL) ---

/**
 * Calcula os KPIs de receita de usuário para um conjunto de dados específico.
 * Esta função é usada tanto para o "Snapshot" (dados filtrados)
 * quanto para cada mês na "Evolução" (dados agrupados).
 */
const calcularKPIsReceitaUsuario = (dadosTransacoes) => {
  if (!dadosTransacoes || dadosTransacoes.length === 0) {
    return { numUsuariosGratuitos: 0, numUsuariosPagos: 0, lojistasGratuitos: 0, lojistasPagos: 0, RPU_Mensal_Geral: 0, RPU_Usuarios_Gratuitos: 0, RPU_Usuarios_Pagos: 0, LTV_Usuarios_Gratuitos: 0, LTV_Usuarios_Pagos: 0 };
  }
  
  const numUsuariosGratuitos = new Set(dadosTransacoes.filter(d => d.Tipo_Usuário === 'USUÁRIO GRATUITO').map(d => d.Celular)).size;
  const numUsuariosPagos = new Set(dadosTransacoes.filter(d => d.Tipo_Usuário === 'USUÁRIO PAGO').map(d => d.Celular)).size;
  const lojistasGratuitos = new Set(dadosTransacoes.filter(d => d.Tipo_Lojista === 'LTV GRATUITO').map(d => d.Nome_Estabelecimento)).size;
  const lojistasPagos = new Set(dadosTransacoes.filter(d => d.Tipo_Lojista === 'LTV PAGO').map(d => d.Nome_Estabelecimento)).size;

  const totalRepasseTransacoes = dadosTransacoes.reduce((acc, d) => acc + d.Repasse, 0);
  const totalUsuariosLojistas = numUsuariosGratuitos + numUsuariosPagos + lojistasGratuitos + lojistasPagos;
  const RPU_Mensal_Geral = (totalUsuariosLojistas > 0) ? (totalRepasseTransacoes / totalUsuariosLojistas) : 0;

  const repasseUsuariosGratuitos = dadosTransacoes.filter(d => d.Tipo_Usuário === 'USUÁRIO GRATUITO').reduce((acc, d) => acc + d.Repasse, 0);
  const RPU_Usuarios_Gratuitos = (numUsuariosGratuitos > 0) ? (repasseUsuariosGratuitos / numUsuariosGratuitos) : 0;

  const repasseUsuariosPagos = dadosTransacoes.filter(d => d.Tipo_Usuário === 'USUÁRIO PAGO').reduce((acc, d) => acc + d.Repasse, 0);
  const RPU_Usuarios_Pagos = (numUsuariosPagos > 0) ? (repasseUsuariosPagos / numUsuariosPagos) : 0;

  const repasseLojistasGratuitos = dadosTransacoes.filter(d => d.Tipo_Lojista === 'LTV GRATUITO').reduce((acc, d) => acc + d.Repasse, 0);
  const LTV_Usuarios_Gratuitos = (lojistasGratuitos > 0) ? (repasseLojistasGratuitos / lojistasGratuitos) : 0;

  const repasseLojistasPagos = dadosTransacoes.filter(d => d.Tipo_Lojista === 'LTV PAGO').reduce((acc, d) => acc + d.Repasse, 0);
  const LTV_Usuarios_Pagos = (lojistasPagos > 0) ? (repasseLojistasPagos / lojistasPagos) : 0;

  return {
    numUsuariosGratuitos, numUsuariosPagos, lojistasGratuitos, lojistasPagos,
    RPU_Mensal_Geral, RPU_Usuarios_Gratuitos, RPU_Usuarios_Pagos, LTV_Usuarios_Gratuitos, LTV_Usuarios_Pagos
  };
};

/**
 * Calcula a evolução mensal dos KPIs de Receita de Usuário.
 */
const calcularEvolucaoKPIs = (dadosTransacoes, dataInicio, dataFim) => {
  let diffMeses = 0;
  let exibirGraficosEvolucao = false;

  // 1. Determina a diferença de meses com base no filtro ou no dataset
  if (dataInicio && dataFim) {
    const d1 = new Date(dataInicio);
    const d2 = new Date(dataFim);
    diffMeses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  } else if (dadosTransacoes.length > 0) {
    // Se não há filtro, usa o range completo dos dados
    const datas = dadosTransacoes.map(d => new Date(d.Data)).sort((a, b) => a - b);
    if (datas.length > 0) {
        const d1 = datas[0];
        const d2 = datas[datas.length - 1];
        diffMeses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    }
  }

  // A regra: "igual ou superior a 2 meses". 
  // (Ex: Out-Nov é diff 1; Out-Dez é diff 2. A regra é diff >= 1)
  if (diffMeses >= 1) {
    exibirGraficosEvolucao = true;
  }

  if (!exibirGraficosEvolucao) {
    return { exibirGraficosEvolucao, chartEvolucaoRPU: [], chartEvolucaoLTV: [], chartEvolucaoUsuarios: [] };
  }

  // 2. Agrupa dados por mês (YYYY-MM)
  // Filtra os dados com base no range de datas ANTES de agrupar
  const dadosParaEvolucao = filtrarPorData(dadosTransacoes, 'Data', dataInicio, dataFim);
  
  const dadosPorMes = dadosParaEvolucao.reduce((acc, d) => {
    if (!d.Data) return acc;
    const mes = d.Data.substring(0, 7); // Formato YYYY-MM
    (acc[mes] = acc[mes] || []).push(d);
    return acc;
  }, {});

  // 3. Calcula KPIs para cada mês
  const kpisMensais = Object.keys(dadosPorMes).sort().map(mes => {
    const dadosDoMes = dadosPorMes[mes];
    const kpisDoMes = calcularKPIsReceitaUsuario(dadosDoMes);
    return { mes, ...kpisDoMes };
  });

  // 4. Formata para gráficos
  const chartEvolucaoRPU = kpisMensais.map(k => ({
    name: k.mes,
    'RPU Geral': k.RPU_Mensal_Geral,
    'RPU Gratuito': k.RPU_Usuarios_Gratuitos,
    'RPU Pago': k.RPU_Usuarios_Pagos,
  }));

  const chartEvolucaoLTV = kpisMensais.map(k => ({
    name: k.mes,
    'LTV Gratuito': k.LTV_Usuarios_Gratuitos,
    'LTV Pago': k.LTV_Usuarios_Pagos,
  }));
  
  const chartEvolucaoUsuarios = kpisMensais.map(k => ({
    name: k.mes,
    'Usuários Gratuitos': k.numUsuariosGratuitos,
    'Usuários Pagos': k.numUsuariosPagos,
    'Lojistas Gratuitos': k.lojistasGratuitos,
    'Lojistas Pagos': k.lojistasPagos,
  }));

  return { exibirGraficosEvolucao, chartEvolucaoRPU, chartEvolucaoLTV, chartEvolucaoUsuarios };
};


// --- FUNÇÃO PRINCIPAL DE CÁLCULO (CFO) ---

export const calcularMetricasCFO = (dadosFinanceiros, dadosTransacoes, filtros) => {
  
  // 1. Filtra os dados pelos filtros de data
  const finFiltrado = filtrarPorData(dadosFinanceiros, 'Data_Atividade', filtros.dataInicio, filtros.dataFim);
  const transFiltrado = filtrarPorData(dadosTransacoes, 'Data', filtros.dataInicio, filtros.dataFim);

   // --- 2. Seção: Balanço Patrimonial ---
  
  const totalAtivos = somarFinanceiro(finFiltrado, 'Ativo');
  const ativoCirculante = somarFinanceiro(finFiltrado, 'Ativo', 'Circulante');
  const ativoNaoCirculante = somarFinanceiro(finFiltrado, 'Ativo', 'Não Circulante');
  
  const totalPassivos = somarFinanceiro(finFiltrado, 'Passivo');
  const passivoCirculante = somarFinanceiro(finFiltrado, 'Passivo', 'Circulante');
  const passivoNaoCirculante = somarFinanceiro(finFiltrado, 'Passivo', 'Não Circulante');
  
  const patrimonioLiquido = somarFinanceiro(finFiltrado, 'Patrimônio Líquido');
  
  // Gráficos do Balanço
  const chartAtivos = [
    { name: 'Circulante', value: ativoCirculante },
    { name: 'Não Circulante', value: ativoNaoCirculante },
  ];
  const chartPassivos = [
    { name: 'Circulante', value: passivoCirculante },
    { name: 'Não Circulante', value: passivoNaoCirculante },
  ];
  const chartBalancoTotal = [
    { name: 'Ativos', value: totalAtivos },
    { name: 'Passivos', value: totalPassivos },
    { name: 'Patrimônio Líquido', value: patrimonioLiquido },
  ];
  
  const tiposAtividadeUnicos = [...new Set(finFiltrado.map(d => d.Tipo_Atividade).filter(Boolean))];
  const chartTiposAtividade = tiposAtividadeUnicos.map(tipo => {
    const total = finFiltrado.filter(d => d.Tipo_Atividade === tipo).reduce((acc, d) => acc + d.Valor_Total, 0);
    return { name: tipo, Total: total };
  }).sort((a,b) => b.Total - a.Total);


   // --- 3. Seção: Demonstração do Resultado de Exercício (DRE) ---
  
  const receitaBruta = somarFinanceiro(finFiltrado, null, null, 'Receita Bruta');
  const custosOperacionais = somarFinanceiro(finFiltrado, null, null, 'Custo Operacional');
  const receitaLiquida = receitaBruta - custosOperacionais; // Simplificado
  
  const despesasOperacionais = finFiltrado
    .filter(d => d.Tipo_Receita && d.Tipo_Receita.startsWith('Despesa'))
    .reduce((acc, d) => acc + d.Valor_Total, 0);
        
  const lucroBruto = receitaLiquida - custosOperacionais;
  const lucroOperacional = lucroBruto - despesasOperacionais;
  const lucroLiquido = lucroBruto - despesasOperacionais;

  const margemBruta = (receitaLiquida > 0) ? (lucroBruto / receitaLiquida) : 0;
  const margemOperacional = (receitaLiquida > 0) ? (lucroOperacional / receitaLiquida) : 0;
  const margemLiquida = (receitaLiquida > 0) ? (lucroLiquido / receitaLiquida) : 0;
  
  // KPIs das Transações (Snapshot)
  const totalRepasseTransacoes = transFiltrado.reduce((acc, d) => acc + d.Repasse, 0);
  const totalTransacoes = transFiltrado.length;
  const ticketMedioRepasse = (totalTransacoes > 0) ? (totalRepasseTransacoes / totalTransacoes) : 0;

  // Gráficos das Transações (Snapshot)
  const transacoesPorTurno = transFiltrado.reduce((acc, d) => {
    if (!d.Hora || typeof d.Hora !== 'string') return acc;
    const hora = parseInt(d.Hora.split(':')[0], 10);
    if (hora >= 5 && hora < 12) acc.Manhã++;
    else if (hora >= 12 && hora < 18) acc.Tarde++;
    else acc.Noite++;
    return acc;
  }, { Manhã: 0, Tarde: 0, Noite: 0 });
  const chartTurnos = Object.entries(transacoesPorTurno).map(([name, value]) => ({ name, value }));

  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const chartRepasseDiaSemana = transFiltrado.reduce((acc, d) => {
    if (!d.Data) return acc;
    const dia = new Date(d.Data).getUTCDay(); // Usar UTC para evitar problemas de fuso
    const nomeDia = diasSemana[dia];
    acc[nomeDia] = (acc[nomeDia] || 0) + d.Repasse;
    return acc;
  }, {});

  const chartRepasseDia = diasSemana.map(name => ({ name, Repasse: chartRepasseDiaSemana[name] || 0 }));
  
  const chartTicketMedioDia = transFiltrado.reduce((acc, d) => {
    if (!d.Data) return acc;
    const dia = new Date(d.Data).getUTCDay();
    const nomeDia = diasSemana[dia];
    if (!acc[nomeDia]) acc[nomeDia] = { totalRepasse: 0, totalTransacoes: 0 };
    acc[nomeDia].totalRepasse += d.Repasse;
    acc[nomeDia].totalTransacoes++;
    return acc;
  }, {});
  const chartTicketMedio = diasSemana.map(name => ({
    name,
    'Average Ticket': (chartTicketMedioDia[name] && chartTicketMedioDia[name].totalTransacoes > 0) ? 
                      chartTicketMedioDia[name].totalRepasse / chartTicketMedioDia[name].totalTransacoes : 0
  }));


   // --- 4. Seção: Índices de Liquidez ---
  
  const liquidezCorrente = (passivoCirculante > 0) ? (ativoCirculante / passivoCirculante) : 0;
  const liquidezImediata = liquidezCorrente; // Simplificado
  const liquidezGeral = ((passivoCirculante + passivoNaoCirculante) > 0) ? (ativoCirculante + ativoNaoCirculante) / (passivoCirculante + passivoNaoCirculante) : 0;
    
  const chartIndicesLiquidez = [
    { name: 'Corrente', value: liquidezCorrente },
    { name: 'Imediata', value: liquidezImediata },
    { name: 'Geral', value: liquidezGeral },
  ];

   // --- 5. Seção: Índices de Endividamento ---
  
  const pc_pnc = passivoCirculante + passivoNaoCirculante;
  const partCapitalTerceiros = (patrimonioLiquido > 0) ? (pc_pnc / patrimonioLiquido) : 0;
  const composicaoEndividamento = (pc_pnc > 0) ? (passivoCirculante / pc_pnc) : 0;
  const imobilizacaoPL = (patrimonioLiquido > 0) ? (ativoNaoCirculante / patrimonioLiquido) : 0;
  
  const chartPartCapital = [
    { name: 'Passivos', value: pc_pnc },
    { name: 'Patrimônio Líquido', value: patrimonioLiquido }
  ];
  const chartCompEndividamento = [
    { name: 'Passivo Circulante', value: passivoCirculante },
    { name: 'Passivo N. Circulante', value: passivoNaoCirculante }
  ];
  const chartImobilizacao = [
    { name: 'Ativo N. Circulante', value: ativoNaoCirculante },
    { name: 'Patrimônio Líquido', value: patrimonioLiquido }
  ];

   // --- 6. Seção: Análise de Receita por Usuários (Snapshot) ---
  const kpisReceitaSnapshot = calcularKPIsReceitaUsuario(transFiltrado);

   // --- 7. Seção: Evolução da Receita por Usuários (Tendência) ---
  // Passa os dados *não filtrados* (mas usa os filtros para a regra de exibição)
  const { 
    exibirGraficosEvolucao, 
    chartEvolucaoRPU, 
    chartEvolucaoLTV, 
    chartEvolucaoUsuarios 
  } = calcularEvolucaoKPIs(dadosTransacoes, filtros.dataInicio, filtros.dataFim);

  // --- 8. Retorno ---
  return {
    kpis: {
      totalAtivos, totalPassivos, patrimonioLiquido,
      receitaBruta, receitaLiquida, lucroBruto, lucroOperacional, lucroLiquido,
      margemBruta, margemOperacional, margemLiquida, ticketMedioRepasse,
      liquidezCorrente, liquidezImediata, liquidezGeral,
      partCapitalTerceiros, composicaoEndividamento, imobilizacaoPL,
      ...kpisReceitaSnapshot // Adiciona os KPIs de receita (Snapshot)
    },
    chartData: {
      chartAtivos, chartPassivos, chartBalancoTotal, chartTiposAtividade,
      chartTurnos, chartRepasseDia, chartTicketMedio,
      chartIndicesLiquidez,
      chartPartCapital, chartCompEndividamento, chartImobilizacao,
      // Gráficos de evolução (condicionais)
      exibirGraficosEvolucao,
      chartEvolucaoRPU,
      chartEvolucaoLTV,
      chartEvolucaoUsuarios
    }
  };
};
