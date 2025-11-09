// src/utils/formatadores.js

/**
 * Formata um número como um inteiro (ex: 1.234).
 * @param {number} valor - O número a ser formatado.
 * @returns {string} - O número formatado.
 */
export const formatarNumero = (valor) => {
  if (typeof valor !== 'number' || isNaN(valor)) return '0';
  return new Intl.NumberFormat('en-US').format(valor.toFixed(0));
};

/**
 * Formata um número como decimal (ex: 1.234,56).
 * @param {number} valor - O número a ser formatado.
 * @returns {string} - O número formatado.
 */
export const formatarDecimal = (valor) => {
  if (typeof valor !== 'number' || isNaN(valor)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

/**
 * Formata um número como percentual (ex: 50,5%).
 * @param {number} valor - O número (ex: 0.505).
 * @returns {string} - O percentual formatado.
 */
export const formatarPercentual = (valor) => {
  if (typeof valor !== 'number' || isNaN(valor)) return '0.0%';
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(valor);
};