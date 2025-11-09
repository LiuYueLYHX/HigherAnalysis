import React from 'react';
import styled, { keyframes } from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #FFF;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const Mensagem = styled.h2`
  color: white;
  margin-top: 1.5rem;
  font-weight: 500;
  font-size: 1.2rem;
`;

const TelaCarregamento = () => {
  return (
    <Overlay>
      <Spinner />
      <Mensagem>Processando dados... Isso pode levar alguns instantes.</Mensagem>
    </Overlay>
  );
};

export default TelaCarregamento;