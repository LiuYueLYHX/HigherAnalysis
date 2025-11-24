import React from 'react';
import styled from 'styled-components';
import SecaoExpansivel from './SecaoExpansivel';

// Estiliza o formulário de filtros
const FiltroContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 650px; /* Limita a largura, já que são poucos filtros */
`;

const FiltroGrupo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  label {
    font-size: 0.8rem;
    font-weight: 500;
    opacity: 0.7;
    text-transform: uppercase;
  }

  
  input {
    font-size: 1rem;
    padding: 0.5rem;
    background: ${({ theme }) => theme.body};
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 6px;
    color: ${({ theme }) => theme.text};
  }
`;

const FiltrosCFO = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SecaoExpansivel titulo="Filters" comecarAberto={false}>
      <FiltroContainer>
        {/* Filtros de Data */}
        <FiltroGrupo>
          <label htmlFor="dataInicio">Start Date</label>
          <input type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="dataFim">End Date</label>
          <input type="date" name="dataFim" value={filtros.dataFim} onChange={handleChange} />
        </FiltroGrupo>
      </FiltroContainer>
    </SecaoExpansivel>
  );
};

export default FiltrosCFO;