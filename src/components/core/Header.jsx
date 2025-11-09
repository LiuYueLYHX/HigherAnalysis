import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { TemaContext } from '../../contexts/TemaContext';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.cardBg};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  box-shadow: ${({ theme }) => theme.shadow};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.accent};
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

// Estilizando o NavLink do react-router-dom
const StyledNavLink = styled(NavLink)`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  transition: opacity 0.2s ease, color 0.2s ease;

  &:hover {
    opacity: 1;
  }

  /* Estilo do link ativo */
  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.accent};
    border-bottom: 2px solid ${({ theme }) => theme.accent};
    padding-bottom: 4px;
  }
`;

const BotaoTema = styled.button`
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.borderColor};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.body};
    border-color: ${({ theme }) => theme.accent};
  }
`;

const Header = () => {
  const { alternarTema, nomeTema } = useContext(TemaContext);

  return (
    <HeaderContainer>
      <Logo>HigherAnalysis</Logo>
      <Nav>
        <StyledNavLink to="/executive-overview">Executive Overview</StyledNavLink>
        <StyledNavLink to="/financial-performance">Financial Performance</StyledNavLink>
      </Nav>
      <BotaoTema onClick={alternarTema}>
        Tema {nomeTema === 'claro' ? 'Escuro' : 'Claro'}
      </BotaoTema>
    </HeaderContainer>
  );
};

export default Header;