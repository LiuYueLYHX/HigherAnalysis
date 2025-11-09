// --- Funções Auxiliares ---

/**
 * Agrupa um array de objetos por uma chave.
 * @param {Array<Object>} array - O array de dados.
 * @param {string} chave - A chave para agrupar (ex: 'Cidade_Residencial').
 * @returns {Object} - Um objeto onde as chaves são os valores agrupados.
 */
const agruparPor = (array, chave) => {
  return array.reduce((acc, obj) => {
    const valorChave = obj[chave] || 'N/A'; // Garante que nulos/undefined sejam agrupados
    (acc[valorChave] = acc[valorChave] || []).push(obj);
    return acc;
  }, {});
};

/**
 * Calcula a média de uma chave numérica em um array de objetos.
 * @param {Array<Object>} array - O array de dados.
 * @param {string} chave - A chave para calcular a média (ex: 'Idade').
 * @returns {number} - A média.
 */
const calcularMedia = (array, chave) => {
  if (!array || array.length === 0) return 0;
  const soma = array.reduce((acc, obj) => acc + (obj[chave] || 0), 0);
  return soma / array.length;
};

/**
 * Soma o valor de uma chave numérica em um array de objetos.
 * @param {Array<Object>} array - O array de dados.
 * @param {string} chave - A chave para somar (ex: 'Repasse').
 * @returns {number} - A soma total.
 */
const calcularSoma = (array, chave) => {
  if (!array || array.length === 0) return 0;
  return array.reduce((acc, obj) => acc + (obj[chave] || 0), 0);
};

/**
 * Define a faixa etária com base na idade. [Ref: cite: 53-54]
 * @param {number} idade - A idade do usuário.
 * @returns {string} - A faixa etária.
 */
const getFaixaEtaria = (idade) => {
  if (idade <= 17) return '0-17';
  if (idade <= 24) return '18-24';
  if (idade <= 34) return '25-34';
  if (idade <= 44) return '35-44';
  if (idade <= 59) return '45-59';
  return '60+';
};

// --- Função Principal de Cálculo ---

export const calcularMetricasExecutive = (dados) => {
  if (!dados || dados.length === 0) {
    return { kpis: {}, chartData: {} };
  }

  // --- 1. Cálculo dos KPIs [cite: 31-46] ---

  const totalCupons = dados.length;
  const valorTotalMovimentado = calcularSoma(dados, 'Repasse');
  const ticketMedio = valorTotalMovimentado / totalCupons;
  
  const usuariosUnicos = new Set(dados.map(d => d.Celular));
  const numUsuariosAtivos = usuariosUnicos.size;
  
  const idadeMediaPublico = calcularMedia(dados, 'Idade');

  const totalHomens = dados.filter(d => d.Sexo === 'Masculino').length;
  const totalMulheres = dados.filter(d => d.Sexo === 'Feminino').length;
  const totalGenero = totalHomens + totalMulheres;
  const distribuicaoGenero = {
      masculino: totalGenero > 0 ? totalHomens / totalGenero : 0,
      feminino: totalGenero > 0 ? totalMulheres / totalGenero : 0,
  };

  const cuponsPorCliente = agruparPor(dados, 'Celular');
  const somaCuponsPorCliente = Object.values(cuponsPorCliente).map(arr => arr.length);
  const frequenciaMediaUso = somaCuponsPorCliente.reduce((a, b) => a + b, 0) / (numUsuariosAtivos || 1);
  
  // Contagem de usuários únicos por tipo
  const usuariosPorTipo = [...usuariosUnicos].map(celular => {
      return dados.find(d => d.Celular === celular);
  });
  const numUsuariosGratuitos = usuariosPorTipo.filter(d => d.Tipo_Usuário === 'USUÁRIO GRATUITO').length;
  const numUsuariosPagos = usuariosPorTipo.filter(d => d.Tipo_Usuário === 'USUÁRIO PAGO').length;

  const lojistasUnicos = [...new Set(dados.map(d => d.Nome_Estabelecimento))].map(nome => {
      return dados.find(d => d.Nome_Estabelecimento === nome);
  });
  const lojistasGratuitos = lojistasUnicos.filter(d => d.Tipo_Lojista === 'LTV GRATUITO').length;
  const lojistasPagos = lojistasUnicos.filter(d => d.Tipo_Lojista === 'LTV PAGO').length;

  // DAU/WAU/MAU - Simplificado (requer lógica de data mais complexa)
  const usuariosAtivosDiarios = numUsuariosAtivos;
  
  const tempoMedioAplicacao = calcularMedia(dados, 'Tempo_Aplic');
  const sessoesPorUsuario = (tempoMedioAplicacao / 2) * frequenciaMediaUso; 

  const kpis = {
    totalCupons,
    valorTotalMovimentado,
    ticketMedio,
    numUsuariosAtivos,
    idadeMediaPublico,
    distribuicaoGenero,
    frequenciaMediaUso,
    numUsuariosGratuitos,
    numUsuariosPagos,
    lojistasGratuitos,
    lojistasPagos,
    usuariosAtivosDiarios,
    tempoMedioAplicacao,
    sessoesPorUsuario
  };

  // --- 2. Preparação dos Dados para Gráficos (TODOS) ---

  const chartData = {};

  // Gráfico 1: Categoria x Idade Média [cite: 48]
  const agrupadoCategoriaFreq = agruparPor(dados, 'Categoria_Frequenteada');
  chartData.chartCategoriaIdade = Object.entries(agrupadoCategoriaFreq)
    .map(([categoria, arr]) => ({
      name: categoria,
      'Average Age': calcularMedia(arr, 'Idade')
    }))
    .sort((a, b) => b['Average Age'] - a['Average Age']);

  // Gráfico 2: Distribuição de Sexo por Categoria [cite: 49]
  chartData.chartSexoCategoria = Object.entries(agrupadoCategoriaFreq)
    .map(([categoria, arr]) => ({
      name: categoria,
      Male: arr.filter(d => d.Sexo === 'Masculino').length,
      Female: arr.filter(d => d.Sexo === 'Feminino').length,
    }));

  // Gráfico 3 e 4: Transações por Cidade e Bairro [cite: 50, 51]
  const agruparContagem = (chave) => {
    const contagem = dados.reduce((acc, d) => {
        const valorChave = d[chave] || 'N/A';
        acc[valorChave] = (acc[valorChave] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(contagem)
        .map(([name, Transactions]) => ({ name, Transactions }))
        .sort((a, b) => b.Transactions - a.Transactions);
  };
  chartData.chartTransacoesCidade = agruparContagem('Cidade_Residencial');
  chartData.chartTransacoesBairro = agruparContagem('Bairro_Residencial');

  // Gráfico 5: Transações por Trabalho/Estudo [cite: 52]
  const trabalhaApenas = dados.filter(d => d.Cidade_Trabalho !== 'Não tem' && d.Cidade_Escola === 'Não tem').length;
  const estudaApenas = dados.filter(d => d.Cidade_Trabalho === 'Não tem' && d.Cidade_Escola !== 'Não tem').length;
  const trabalhaEEstuda = dados.filter(d => d.Cidade_Trabalho !== 'Não tem' && d.Cidade_Escola !== 'Não tem').length;
  chartData.chartTrabalhaEstuda = [
      { name: 'Only Works', value: trabalhaApenas },
      { name: 'Only Studies', value: estudaApenas },
      { name: 'Works and Studies', value: trabalhaEEstuda },
  ];

  // Gráfico 6 e 7: Transações por Faixa Etária por Cidade/Bairro [cite: 53, 54]
  const faixas = ['0-17', '18-24', '25-34', '35-44', '45-59', '60+'];
  const agregarPorFaixaEtaria = (chaveAgrupamento) => {
      const grupos = agruparPor(dados, chaveAgrupamento);
      return Object.entries(grupos).map(([name, arr]) => {
          const transacoesPorFaixa = arr.reduce((acc, d) => {
              const faixa = getFaixaEtaria(d.Idade);
              acc[faixa] = (acc[faixa] || 0) + 1;
              return acc;
          }, {});
          return { name, ...transacoesPorFaixa };
      });
  };
  chartData.chartFaixaEtariaCidade = agregarPorFaixaEtaria('Cidade_Residencial');
  chartData.chartFaixaEtariaBairro = agregarPorFaixaEtaria('Bairro_Residencial');
  chartData.faixasEtarias = faixas; // Para as legendas

  // Gráfico 8, 9, 10: Categorias mais frequentadas por Atividade [cite: 57, 58, 59]
  const filtrarEContarCategoria = (filtro) => {
      const dadosFiltrados = dados.filter(filtro);
      return agruparContagem.call({dados: dadosFiltrados}, 'Categoria_Frequenteada');
  };
  chartData.chartCatSoloTrabalha = filtrarEContarCategoria(d => d.Cidade_Trabalho !== 'Não tem' && d.Cidade_Escola === 'Não tem');
  chartData.chartCatSoloEstuda = filtrarEContarCategoria(d => d.Cidade_Trabalho === 'Não tem' && d.Cidade_Escola !== 'Não tem');
  chartData.chartCatTrabalhaEstuda = filtrarEContarCategoria(d => d.Cidade_Trabalho !== 'Não tem' && d.Cidade_Escola !== 'Não tem');

  // Gráfico 11: Bairros mais rentáveis (Repasse) [cite: 60]
  const agrupadoBairroEstab = agruparPor(dados, 'Bairro_Estabelecimento');
  chartData.chartBairrosRentaveis = Object.entries(agrupadoBairroEstab)
    .map(([name, arr]) => ({
      name,
      Revenue: calcularSoma(arr, 'Repasse')
    }))
    .sort((a, b) => b.Revenue - a.Revenue);

  // Gráfico 12: Transações por Tipo de Cupom [cite: 61]
  const agrupadoTipoCupom = agruparPor(dados, 'Tipo_Cupom');
  chartData.chartTipoCupom = Object.entries(agrupadoTipoCupom)
    .map(([name, arr]) => ({ name, value: arr.length }));
    
  // Gráfico 13: Valor de Cupom por Categoria Estabelecimento [cite: 62]
  const agrupadoCatEstab = agruparPor(dados, 'Categoria_Estabelecimento');
  chartData.chartValorCupomCategoria = Object.entries(agrupadoCatEstab)
    .map(([name, arr]) => ({
      name,
      CouponValue: calcularSoma(arr, 'Valor_Cupom')
    }))
    .sort((a, b) => b.CouponValue - a.CouponValue);

  // Gráfico 14: Cupons (empilhados por tipo) por Bairro Estabelecimento [cite: 63]
  chartData.chartTiposCupomBairro = Object.entries(agrupadoBairroEstab)
    .map(([name, arr]) => {
      const tipos = agruparPor(arr, 'Tipo_Cupom');
      const contagemTipos = Object.entries(tipos).reduce((acc, [tipo, tipoArr]) => {
          acc[tipo] = tipoArr.length;
          return acc;
      }, {});
      return { name, ...contagemTipos };
    });
  chartData.tiposDeCupom = [...new Set(dados.map(d => d.Tipo_Cupom).filter(Boolean))];

  // Gráfico 15: Rentabilidade (Repasse) por Estabelecimento [cite: 64]
  const agrupadoEstab = agruparPor(dados, 'Nome_Estabelecimento');
  chartData.chartRentabilidadeEstab = Object.entries(agrupadoEstab)
    .map(([name, arr]) => ({
      name,
      Revenue: calcularSoma(arr, 'Repasse')
    }))
    .sort((a, b) => b.Revenue - a.Revenue);

  // Gráfico 16: Transações por Hora do Dia [cite: 65]
  const agrupadoHora = dados.reduce((acc, d) => {
    const hora = d.Hora ? d.Hora.split(':')[0] : 'N/A';
    acc[hora] = (acc[hora] || 0) + 1;
    return acc;
  }, {});
  chartData.chartTransacoesHora = Object.entries(agrupadoHora)
    .map(([name, Transactions]) => ({ name: `${name}:00`, Transactions }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
    
  // Gráfico 17: Ranking de Campanhas [cite: 66]
  chartData.chartRankingCampanhas = agruparContagem('Id_Campanha');

  return { kpis, chartData };
};