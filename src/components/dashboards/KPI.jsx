import React from 'react';
import styled from 'styled-components';

const KpiCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  /* Garante que o conteúdo não vaze, mesmo como última camada de proteção */
  overflow: hidden; 
`;

const KpiTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  /* Evita que o título quebre em duas linhas */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Função helper para determinar o tamanho da fonte com base no comprimento do texto.
 * Usamos props $transientes (com $) para que o React não as passe para o DOM.
 */
const KpiValue = styled.p`
  font-weight: 600;
  color: ${({ theme }) => theme.accent};
  margin: 0;

  /* Lógica de ajuste de fonte com base na prop $length */
  font-size: ${({ $length }) => {
    if ($length > 20) return '1.25rem'; // Muito longo
    if ($length > 15) return '1.5rem'; // Longo
    if ($length > 10) return '1.75rem'; // Médio
    return '2.25rem'; // Padrão
  }};
  
  /* * Como última alternativa, se o texto AINDA for muito grande, 
   * quebramos a palavra para evitar que ela vaze da div.
   */
  word-break: break-all;
`;

const KpiSubValue = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.9;
  margin-top: 0.25rem;

  /* Lógica de ajuste de fonte (menos agressiva) para o sub-valor */
  font-size: ${({ $length }) => {
    if ($length > 25) return '0.75rem';
    return '1rem'; // Padrão
  }};
  
  word-break: break-all;
`;

/**
 * Componente para exibir um KPI.
 * @param {{titulo: string, valor: string | number, subValor?: string}} props
 */
const KPI = ({ titulo, valor, subValor }) => {
  // Converte o valor para string e pega o comprimento
  const valorLength = String(valor).length;
  // Faz o mesmo para o subValor, se existir
  const subValorLength = String(subValor || '').length;

  return (
    <KpiCard>
      <KpiTitle title={titulo}>{titulo}</KpiTitle>
      {/* Passa o comprimento como uma prop $transiente para o styled-component */}
      <KpiValue $length={valorLength}>{valor}</KpiValue>
      {subValor && <KpiSubValue $length={subValorLength}>{subValor}</KpiSubValue>}
    </KpiCard>
  );
};

export default KPI;