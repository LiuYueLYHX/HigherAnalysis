// src/components/dashboards/FiltrosExecutive.jsx
import React from 'react';
import styled from 'styled-components';
import SecaoExpansivel from './SecaoExpansivel';

// Estiliza o formulário de filtros
const FiltroForm = styled.div`
  display: grid;
  /* Cria um grid responsivo para os filtros */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
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

  input,
  select {
    font-size: 1rem;
    padding: 0.5rem;
    background: ${({ theme }) => theme.body};
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 6px;
    color: ${({ theme }) => theme.text};
  }
`;

const FiltrosExecutive = ({ filtros, setFiltros, opcoes }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };
  
  // Função auxiliar para renderizar selects
  const renderizarSelect = (name, label, opcoesArray) => (
    <FiltroGrupo>
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} value={filtros[name]} onChange={handleChange}>
        <option value="all">All</option>
        {opcoesArray.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </FiltroGrupo>
  );

  return (
    <SecaoExpansivel titulo="Filters" comecarAberto={false}>
      <FiltroForm>
        {/* Filtros de Data e Hora [cite: 21] */}
        <FiltroGrupo>
          <label htmlFor="dataInicio">Start Date</label>
          <input type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="dataFim">End Date</label>
          <input type="date" name="dataFim" value={filtros.dataFim} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="horaInicio">Start Time</label>
          <input type="time" name="horaInicio" value={filtros.horaInicio} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="horaFim">End Time</label>
          <input type="time" name="horaFim" value={filtros.horaFim} onChange={handleChange} />
        </FiltroGrupo>

        {/* Filtros de Estabelecimento [cite: 21] */}
        {renderizarSelect('estabelecimento', 'Establishment', opcoes.estabelecimentos)}
        {renderizarSelect('bairroEstabelecimento', 'Establishment Neighborhood', opcoes.bairrosEstabelecimento)}
        {renderizarSelect('categoriaEstabelecimento', 'Establishment Category', opcoes.categoriasEstabelecimento)}
        
        {/* Filtros de Cupom e Campanha [cite: 21] */}
        {renderizarSelect('idCampanha', 'Campaign ID', opcoes.campanhas)}
        {renderizarSelect('tipoCupom', 'Coupon Type', opcoes.tiposCupom)}
        <FiltroGrupo>
          <label htmlFor="valorCupomMin">Min Coupon Value</label>
          <input type="number" name="valorCupomMin" value={filtros.valorCupomMin} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="valorCupomMax">Max Coupon Value</label>
          <input type="number" name="valorCupomMax" value={filtros.valorCupomMax} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="repasseMin">Min Repasse</label>
          <input type="number" name="repasseMin" value={filtros.repasseMin} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="repasseMax">Max Repasse</label>
          <input type="number" name="repasseMax" value={filtros.repasseMax} onChange={handleChange} />
        </FiltroGrupo>

        {/* Filtros de Usuário [cite: 22] */}
        <FiltroGrupo>
          <label htmlFor="idadeMin">Min Age</label>
          <input type="number" name="idadeMin" value={filtros.idadeMin} onChange={handleChange} />
        </FiltroGrupo>
        <FiltroGrupo>
          <label htmlFor="idadeMax">Max Age</label>
          <input type="number" name="idadeMax" value={filtros.idadeMax} onChange={handleChange} />
        </FiltroGrupo>
        {renderizarSelect('sexo', 'Gender', opcoes.sexos)}
        {renderizarSelect('cidadeResidencial', 'Home City', opcoes.cidadesResidencial)}
        {renderizarSelect('bairroResidencial', 'Home Neighborhood', opcoes.bairrosResidencial)}
        {renderizarSelect('cidadeTrabalho', 'Work City', opcoes.cidadesTrabalho)}
        {renderizarSelect('bairroTrabalho', 'Work Neighborhood', opcoes.bairrosTrabalho)}
        {renderizarSelect('cidadeEscola', 'School City', opcoes.cidadesEscola)}
        {renderizarSelect('bairroEscola', 'School Neighborhood', opcoes.bairrosEscola)}
        {renderizarSelect('categoriaFrequentada', 'Frequented Category', opcoes.categoriasFrequentadas)}
      </FiltroForm>
    </SecaoExpansivel>
  );
};

export default FiltrosExecutive;