import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: all 0.25s linear;
    margin: 0;
    padding: 0;
  }

  main {
    padding: 20px;
  }

  /* Outros estilos globais para botões, cards, etc. */
`;

export default GlobalStyles;