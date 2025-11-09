import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Função auxiliar para ler um único arquivo
const lerArquivo = (arquivo) => {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = (event) => {
      try {
        const dadosBinarios = event.target.result;
        if (arquivo.name.endsWith('.csv')) {
          // Processa arquivos .csv [cite: 10]
          const texto = new TextDecoder('utf-8').decode(dadosBinarios);
          Papa.parse(texto, {
            header: true,
            skipEmptyLines: true,
            complete: (resultado) => resolve(resultado.data),
            error: (err) => reject(err),
          });
        } else if (arquivo.name.endsWith('.xlsx')) {
          // Processa arquivos .xlsx [cite: 134]
          const workbook = XLSX.read(dadosBinarios, { type: 'array' });
          const nomePlanilha = workbook.SheetNames[0];
          const planilha = workbook.Sheets[nomePlanilha];
          const dadosJson = XLSX.utils.sheet_to_json(planilha);
          resolve(dadosJson);
        } else {
          reject(new Error('Formato de arquivo não suportado. Use .csv ou .xlsx.'));
        }
      } catch (e) {
        reject(e);
      }
    };
    leitor.onerror = (err) => reject(err);
    leitor.readAsArrayBuffer(arquivo);
  });
};

/**
 * Processa uma lista de arquivos (FileList) e agrega os resultados.
 * A função é projetada para ler um conjunto de arquivos, permitindo a análise de diversos períodos[cite: 138].
 * @param {FileList} listaArquivos - A lista de arquivos do input.
 * @returns {Promise<Array>} - Uma promessa que resolve para um array de objetos de dados agregados.
 */
export const processarArquivos = async (listaArquivos) => {
  if (!listaArquivos || listaArquivos.length === 0) {
    return []; // Retorna array vazio se nenhum arquivo for fornecido
  }
  
  const promessas = Array.from(listaArquivos).map(lerArquivo);
  const resultados = await Promise.all(promessas);
  
  // Concatena os dados de todos os arquivos em um único array
  return [].concat(...resultados);
};