// src/components/dashboards/SecaoExpansivel.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

const SecaoContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 2rem;
  overflow: hidden; /* Garante que o conteúdo não vaze */
`;

const SecaoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid ${({ $isOpen, theme }) => $isOpen ? theme.borderColor : 'transparent'};
`;

const SecaoTitulo = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const BotaoToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-size: 1.5rem;
  cursor: pointer;
`;

const SecaoConteudo = styled.div`
  /* Animação suave de abertura/fechamento */
  max-height: ${({ $isOpen }) => $isOpen ? '10000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  padding: ${({ $isOpen }) => $isOpen ? '1.5rem' : '0 1.5rem'};
`;

const SecaoExpansivel = ({ titulo, children, comecarAberto = true }) => {
  const [isOpen, setIsOpen] = useState(comecarAberto);

  return (
    <SecaoContainer>
      <SecaoHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <SecaoTitulo>{titulo}</SecaoTitulo>
        <BotaoToggle>{isOpen ? '−' : '+'}</BotaoToggle>
      </SecaoHeader>
      <SecaoConteudo $isOpen={isOpen}>
        {children}
      </SecaoConteudo>
    </SecaoContainer>
  );
};

export default SecaoExpansivel;