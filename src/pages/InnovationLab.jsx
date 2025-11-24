import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { gerarDadosSimulados } from '../services/openaiService';
import { useDados } from '../contexts/DadosContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const LabHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h2 {
    font-size: 2.5rem;
    background: -webkit-linear-gradient(45deg, ${({ theme }) => theme.accent}, #9F7AEA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.8;
  }
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }

  input, textarea {
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.accent};
    }
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }
  
  small {
    display: block;
    margin-top: 0.5rem;
    opacity: 0.6;
    font-size: 0.85rem;
  }
`;

const gradientAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const BotaoSimular = styled.button`
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  background: linear-gradient(-45deg, #3182CE, #805AD5, #3182CE);
  background-size: 200% 200%;
  animation: ${gradientAnim} 5s ease infinite;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingOverlay = styled.div`
  margin-top: 2rem;
  text-align: center;
  
  p {
    margin-top: 1rem;
    font-weight: 500;
  }
`;

const InnovationLab = () => {
  var [apiKey, setApiKey] = useState('');
  const [estrategia, setEstrategia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { carregarDadosSimulados } = useDados();
  const navigate = useNavigate();

  const handleSimular = async () => {
    if (!estrategia) {
      setError('Please provide a Strategy Description.');
      return;
    }

    setLoading(true);
    setError(null);

    if(!apiKey){
        apiKey = import.meta.env.VITE_OPENAI_API_KEY
    }

    try {
      // 1. Chama a IA para gerar os dados
      const dadosGerados = await gerarDadosSimulados(apiKey, estrategia);
      
      // 2. Valida se a IA retornou o formato esperado
      if (!dadosGerados.transacoes || !dadosGerados.financeiro) {
        throw new Error('A IA não gerou os dados no formato esperado. Tente novamente.');
      }

      // 3. Carrega no Contexto
      carregarDadosSimulados(dadosGerados.transacoes, dadosGerados.financeiro);

      // 4. Redireciona para o Dashboard Executivo para ver o resultado
      navigate('/executive-overview');
      
    } catch (err) {
      setError(err.message || 'Failed to generate simulation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LabHeader>
        <h2>Innovation Lab</h2>
        <p>Use AI to simulate future business scenarios for PicMoney.</p>
      </LabHeader>

      <FormCard>
        <FormGroup>
          <label>OpenAI API Key</label>
          <input 
            type="password" 
            placeholder="sk-..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
          />
          <small>Your key is sent directly to OpenAI and is not stored on any server.</small>
        </FormGroup>

        <FormGroup>
          <label>Strategy & Innovation Description</label>
          <textarea 
            placeholder="Ex: We want to launch a campaign focused on university students in São Paulo with aggressive cashback on food services, while cutting administrative office costs by 20%..."
            value={estrategia}
            onChange={(e) => setEstrategia(e.target.value)}
          />
        </FormGroup>

        <BotaoSimular onClick={handleSimular} disabled={loading}>
          {loading ? 'Simulating Scenario...' : 'Generate Simulation'}
        </BotaoSimular>

        {error && (
          <p style={{ color: '#E53E3E', marginTop: '1rem', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </p>
        )}

        {loading && (
          <LoadingOverlay>
            <p>Creating synthetic transactions and financial records based on your idea...</p>
            <small>(This may take up to 30 seconds)</small>
          </LoadingOverlay>
        )}
      </FormCard>
    </Container>
  );
};

export default InnovationLab;