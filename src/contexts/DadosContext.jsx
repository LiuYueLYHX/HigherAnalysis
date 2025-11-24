import React, { createContext, useState, useContext } from 'react';
import { processarArquivos } from '../api/processamentoDados';

export const DadosContext = createContext();

export const DadosProvider = ({ children }) => {
  const [dadosTransacoes, setDadosTransacoes] = useState([]);
  const [dadosFinanceiros, setDadosFinanceiros] = useState([]);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [modoSimulacao, setModoSimulacao] = useState(false);

  // Função para carregar e processar os arquivos
  const carregarDados = async (arquivosTransacoes, arquivosFinanceiros) => {
    setEstaCarregando(true);
    setErro(null);
    try {
      const [transacoes, financeiros] = await Promise.all([
        processarArquivos(arquivosTransacoes),
        processarArquivos(arquivosFinanceiros),
      ]);
      setDadosTransacoes(transacoes);
      setDadosFinanceiros(financeiros);
    } catch (e) {
      setErro('Falha ao processar os arquivos. Verifique o formato e tente novamente.');
      console.error(e);
    } finally {
      setEstaCarregando(false);
    }
  };

  const carregarDadosSimulados = (transacoesSimuladas, financeiroSimulado) => {
    setEstaCarregando(true);
    setErro(null);
    try {
      // Como a IA já devolve no formato de chaves correto (instruído no prompt),
      // apenas garantimos a tipagem correta de campos críticos
      
      const transacoesFormatadas = transacoesSimuladas.map(d => ({
        ...d,
        Repasse: Number(d.Repasse) || 0,
        Valor_Cupom: Number(d.Valor_Cupom) || 0,
        Idade: Number(d.Idade) || 0,
        Tempo_Aplic: Number(d.Tempo_Aplic) || 0
      }));

      const financeiroFormatado = financeiroSimulado.map(d => ({
        ...d,
        Valor_Total: Number(d.Valor_Total) || 0
      }));

      setDadosTransacoes(transacoesFormatadas);
      setDadosFinanceiros(financeiroFormatado);
      setModoSimulacao(true); // Ativa flag visual de simulação
      
    } catch (e) {
      setErro('Erro ao processar dados simulados.');
      console.error(e);
    } finally {
      setEstaCarregando(false);
    }
  };

  const value = {
    dadosTransacoes,
    dadosFinanceiros,
    estaCarregando,
    erro,
    carregarDados,
    carregarDadosSimulados, // Exporta a nova função
    modoSimulacao // Exporta o estado
  };


  return <DadosContext.Provider value={value}>{children}</DadosContext.Provider>;
};

export const useDados = () => useContext(DadosContext);