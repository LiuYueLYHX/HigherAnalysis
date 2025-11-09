// src/hooks/useFiltrosExecutive.js
import { useState, useMemo } from 'react';

// Estado inicial para todos os filtros
const estadoInicialFiltros = {
  dataInicio: '',
  dataFim: '',
  horaInicio: '',
  horaFim: '',
  estabelecimento: 'all',
  bairroEstabelecimento: 'all',
  categoriaEstabelecimento: 'all',
  idCampanha: 'all',
  tipoCupom: 'all',
  valorCupomMin: '',
  valorCupomMax: '',
  repasseMin: '',
  repasseMax: '',
  idadeMin: '',
  idadeMax: '',
  sexo: 'all',
  cidadeResidencial: 'all',
  bairroResidencial: 'all',
  cidadeTrabalho: 'all',
  bairroTrabalho: 'all',
  cidadeEscola: 'all',
  bairroEscola: 'all',
  categoriaFrequentada: 'all',
};

// Hook para gerenciar os filtros e os dados filtrados
export const useFiltrosExecutive = (dadosCompletos) => {
  const [filtros, setFiltros] = useState(estadoInicialFiltros);

  // Memoiza as opções dinâmicas dos filtros (extraídas dos dados brutos)
  // 
  const opcoesFiltros = useMemo(() => {
    const extrairOpcoes = (chave) => [
      ...new Set(dadosCompletos.map((d) => d[chave]).filter(Boolean)),
    ].sort();

    return {
      estabelecimentos: extrairOpcoes('Nome_Estabelecimento'),
      bairrosEstabelecimento: extrairOpcoes('Bairro_Estabelecimento'),
      categoriasEstabelecimento: extrairOpcoes('Categoria_Estabelecimento'),
      campanhas: extrairOpcoes('Id_Campanha'),
      tiposCupom: extrairOpcoes('Tipo_Cupom'),
      sexos: extrairOpcoes('Sexo'),
      cidadesResidencial: extrairOpcoes('Cidade_Residencial'),
      bairrosResidencial: extrairOpcoes('Bairro_Residencial'),
      cidadesTrabalho: extrairOpcoes('Cidade_Trabalho'),
      bairrosTrabalho: extrairOpcoes('Bairro_Trabalho'),
      cidadesEscola: extrairOpcoes('Cidade_Escola'),
      bairrosEscola: extrairOpcoes('Bairro_Escola'),
      categoriasFrequentadas: extrairOpcoes('Categoria_Frequenteada'),
    };
  }, [dadosCompletos]);

  // Memoiza os dados filtrados. Só recalcula se os dados ou os filtros mudarem.
  const dadosFiltrados = useMemo(() => {
    // Converte valores monetários e numéricos que podem vir como string
    const dadosNumericos = dadosCompletos.map(d => ({
        ...d,
        Valor_Cupom: parseFloat(d.Valor_Cupom) || 0,
        Repasse: parseFloat(d.Repasse) || 0,
        Idade: parseInt(d.Idade, 10) || 0,
    }));

    return dadosNumericos.filter((d) => {
      // Lógica de filtro para cada campo
      // (Omitido por brevidade, mas aqui entraria a lógica de '&&' para cada filtro)
      // Exemplo:
      if (filtros.dataInicio && d.Data < filtros.dataInicio) return false;
      if (filtros.dataFim && d.Data > filtros.dataFim) return false;
      
      if (filtros.horaInicio && d.Hora < filtros.horaInicio) return false;
      if (filtros.horaFim && d.Hora > filtros.horaFim) return false;

      if (filtros.estabelecimento !== 'all' && d.Nome_Estabelecimento !== filtros.estabelecimento) return false;
      if (filtros.bairroEstabelecimento !== 'all' && d.Bairro_Estabelecimento !== filtros.bairroEstabelecimento) return false;
      if (filtros.categoriaEstabelecimento !== 'all' && d.Categoria_Estabelecimento !== filtros.categoriaEstabelecimento) return false;
      if (filtros.idCampanha !== 'all' && d.Id_Campanha !== filtros.idCampanha) return false;
      if (filtros.tipoCupom !== 'all' && d.Tipo_Cupom !== filtros.tipoCupom) return false;
      
      if (filtros.valorCupomMin && d.Valor_Cupom < parseFloat(filtros.valorCupomMin)) return false;
      if (filtros.valorCupomMax && d.Valor_Cupom > parseFloat(filtros.valorCupomMax)) return false;
      
      if (filtros.repasseMin && d.Repasse < parseFloat(filtros.repasseMin)) return false;
      if (filtros.repasseMax && d.Repasse > parseFloat(filtros.repasseMax)) return false;
      
      if (filtros.idadeMin && d.Idade < parseInt(filtros.idadeMin, 10)) return false;
      if (filtros.idadeMax && d.Idade > parseInt(filtros.idadeMax, 10)) return false;
      
      if (filtros.sexo !== 'all' && d.Sexo !== filtros.sexo) return false;
      if (filtros.cidadeResidencial !== 'all' && d.Cidade_Residencial !== filtros.cidadeResidencial) return false;
      if (filtros.bairroResidencial !== 'all' && d.Bairro_Residencial !== filtros.bairroResidencial) return false;
      
      if (filtros.cidadeTrabalho !== 'all' && d.Cidade_Trabalho !== filtros.cidadeTrabalho) return false;
      if (filtros.bairroTrabalho !== 'all' && d.Bairro_Trabalho !== filtros.bairroTrabalho) return false;
      if (filtros.cidadeEscola !== 'all' && d.Cidade_Escola !== filtros.cidadeEscola) return false;
      if (filtros.bairroEscola !== 'all' && d.Bairro_Escola !== filtros.bairroEscola) return false;
      
      if (filtros.categoriaFrequentada !== 'all' && d.Categoria_Frequenteada !== filtros.categoriaFrequentada) return false;
      
      return true; // Passou em todos os filtros
    });
  }, [dadosCompletos, filtros]);

  return { filtros, setFiltros, dadosFiltrados, opcoesFiltros };
};