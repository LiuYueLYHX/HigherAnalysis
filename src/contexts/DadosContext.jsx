import React, { createContext, useState, useContext } from 'react';
import { processarArquivos } from '../api/processamentoDados';

export const DadosContext = createContext();

export const DadosProvider = ({ children }) => {
  const [dadosTransacoes, setDadosTransacoes] = useState([]);
  const [dadosFinanceiros, setDadosFinanceiros] = useState([]);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [erro, setErro] = useState(null);

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

  const value = {
    dadosTransacoes,
    dadosFinanceiros,
    estaCarregando,
    erro,
    carregarDados,
  };

  return <DadosContext.Provider value={value}>{children}</DadosContext.Provider>;
};

export const useDados = () => useContext(DadosContext);