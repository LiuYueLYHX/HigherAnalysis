import React, { useRef } from 'react';
import { useDados } from '../../contexts/DadosContext';
import styled from 'styled-components';

const Container = styled.div`
  background: ${({ theme }) => theme.cardBg};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.borderColor};
  max-width: 800px;
  margin: 2rem auto;
`;

const GridInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 1rem;
    font-weight: 500;
  }

  input[type="file"] {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};

    &::file-selector-button {
      background-color: ${({ theme }) => theme.body};
      color: ${({ theme }) => theme.accent};
      border: 1px solid ${({ theme }) => theme.borderColor};
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${({ theme }) => theme.borderColor};
      }
    }
  }
`;

const BotaoCarregar = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SeletorArquivos = () => {
  const { carregarDados, estaCarregando } = useDados();
  const refInputTransacoes = useRef(null);
  const refInputFinanceiro = useRef(null);

  const handleCarregarClick = () => {
    const arquivosTransacoes = refInputTransacoes.current.files;
    const arquivosFinanceiros = refInputFinanceiro.current.files;
    carregarDados(arquivosTransacoes, arquivosFinanceiros);
  };

  return (
    <Container>
      <GridInputs>
        <InputWrapper>
          <label htmlFor="transacoes">Arquivos de Transações (CEO)</label>
          <input type="file" id="transacoes" ref={refInputTransacoes} multiple />
        </InputWrapper>
        <InputWrapper>
          <label htmlFor="financeiro">Arquivos Financeiros (CFO)</label>
          <input type="file" id="financeiro" ref={refInputFinanceiro} multiple />
        </InputWrapper>
      </GridInputs>
      <BotaoCarregar onClick={handleCarregarClick} disabled={estaCarregando}>
        {estaCarregando ? 'Processando...' : 'Carregar e Processar Dados'}
      </BotaoCarregar>
    </Container>
  );
};

export default SeletorArquivos;