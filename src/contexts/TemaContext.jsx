import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { temaClaro, temaEscuro } from '../styles/themes';

export const TemaContext = createContext();

export const TemaProvider = ({ children }) => {
  const [nomeTema, setNomeTema] = useState('escuro');

  const alternarTema = () => {
    setNomeTema(nomeTema === 'claro' ? 'escuro' : 'claro');
  };

  const tema = useMemo(() => (nomeTema === 'claro' ? temaClaro : temaEscuro), [nomeTema]);

  return (
    <TemaContext.Provider value={{ alternarTema, nomeTema }}>
      <ThemeProvider theme={tema}>{children}</ThemeProvider>
    </TemaContext.Provider>
  );
};