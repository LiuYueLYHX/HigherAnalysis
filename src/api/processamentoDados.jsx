import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// MAPA DE COLUNAS: Mapeia nomes de colunas do CSV/XLSX para nomes padronizados no app
const MAPA_COLUNAS = {
  celular: 'Celular',
  data: 'Data',
  hora: 'Hora',
  nome_estabelecimento: 'Nome_Estabelecimento',
  bairro_estabelecimento: 'Bairro_Estabelecimento',
  categoria_estabelecimento: 'Categoria_Estabelecimento',
  id_campanha: 'Id_Campanha',
  id_cupom: 'Id_Cupom',
  tipo_cupom: 'Tipo_Cupom',
  produto: 'Produto',
  valor_cupom: 'Valor_Cupom',
  repasse_picmoney: 'Repasse',
  data_nascimento: 'Data_Nascimento',
  idade: 'Idade',
  sexo: 'Sexo',
  cidade_residencial: 'Cidade_Residencial',
  bairro_residencial: 'Bairro_Residencial',
  cidade_trabalho: 'Cidade_Trabalho',
  bairro_trabalho: 'Bairro_Trabalho',
  cidade_escola: 'Cidade_Escola',
  bairro_escola: 'Bairro_Escola',
  categoria_frequentada: 'Categoria_Frequenteada',
  Tipo_Usuário: 'Tipo_Usuário',
  Tipo_Lojista: 'Tipo_Lojista',
  Tempo_Aplic: 'Tempo_Aplic',
};

/**
 * Converte um número de hora do Excel (fração de um dia) para uma string "HH:MM:SS".
 * @param {number} numeroHora - O número decimal (ex: 0.6770833).
 * @returns {string} - A hora formatada (ex: "16:15:00").
 */
const converterHoraExcelParaString = (numeroHora) => {
  const totalSegundos = Math.round(numeroHora * 86400);
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  
  return [horas, minutos, segundos]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
};

/**
 * Normaliza um objeto de dados mapeando suas chaves usando o MAPA_COLUNAS.
 * @param {Object} obj - O objeto (linha) de dados brutos.
 * @returns {Object} - O objeto de dados com chaves normalizadas.
 */
const normalizarObjeto = (obj) => {
  const objetoNormalizado = {};
  for (const chaveBruta in obj) {
    const chaveLimpa = chaveBruta.trim();
    const chaveNormalizada = MAPA_COLUNAS[chaveLimpa] || chaveLimpa;
    
    let valor = obj[chaveBruta];

    // --- Lógica de Conversão ---
    if (chaveNormalizada === 'Repasse' || chaveNormalizada === 'Valor_Cupom') {
      valor = parseFloat(valor) || 0;
    } else if (chaveNormalizada === 'Idade' || chaveNormalizada === 'Tempo_Aplic') {
      valor = parseInt(valor, 10) || 0;
    } else if (chaveNormalizada === 'Hora' && typeof valor === 'number') {
      // *** ESTA É A CORREÇÃO ***
      // Converte a hora de número (ex: 0.677) para string (ex: "16:15:00")
      valor = converterHoraExcelParaString(valor);
    }
    // --- Fim da Lógica de Conversão ---
    
    objetoNormalizado[chaveNormalizada] = valor;
  }
  return objetoNormalizado;
};

// Função auxiliar para ler um único arquivo
const lerArquivo = (arquivo) => {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = (event) => {
      try {
        const dadosBinarios = event.target.result;
        let dadosJson = [];

        if (arquivo.name.endsWith('.csv')) {
          // Processa arquivos .csv
          const texto = new TextDecoder('utf-8').decode(dadosBinarios);
          Papa.parse(texto, {
            header: true,
            skipEmptyLines: true,
            complete: (resultado) => {
              dadosJson = resultado.data.map(normalizarObjeto);
              resolve(dadosJson);
            },
            error: (err) => reject(err),
          });
        } else if (arquivo.name.endsWith('.xlsx')) {
          // Processa arquivos .xlsx
          const workbook = XLSX.read(dadosBinarios, { type: 'array' });
          const nomePlanilha = workbook.SheetNames[0];
          const planilha = workbook.Sheets[nomePlanilha];
          const dadosBrutos = XLSX.utils.sheet_to_json(planilha);
          dadosJson = dadosBrutos.map(normalizarObjeto);
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
 * @param {FileList} listaArquivos - A lista de arquivos do input.
 * @returns {Promise<Array>} - Uma promessa que resolve para um array de objetos de dados agregados.
 */
export const processarArquivos = async (listaArquivos) => {
  if (!listaArquivos || listaArquivos.length === 0) {
    return [];
  }
  
  const promessas = Array.from(listaArquivos).map(lerArquivo);
  const resultados = await Promise.all(promessas);
  
  // Concatena os dados de todos os arquivos em um único array
  return [].concat(...resultados);
};
