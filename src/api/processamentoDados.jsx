import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// --- MAPEAMENTO DE COLUNAS DE TRANSAÇÕES (CEO) ---
// (Mantém os mapeamentos que já fizemos)
const mapeamentoColunasTransacoes = {
  // ... (mapeamentos anteriores como 'repasse_picmoney': 'Repasse', etc.)
  'celular': 'Celular',
  'data': 'Data',
  'hora': 'Hora',
  'nome_estabelecimento': 'Nome_Estabelecimento',
  'bairro_estabelecimento': 'Bairro_Estabelecimento',
  'categoria_estabelecimento': 'Categoria_Estabelecimento',
  'id_campanha': 'Id_Campanha',
  'id_cupom': 'Id_Cupom',
  'tipo_cupom': 'Tipo_Cupom',
  'produto': 'Produto',
  'valor_cupom': 'Valor_Cupom',
  'repasse_picmoney': 'Repasse',
  'data_nascimento': 'Data_Nascimento',
  'idade': 'Idade',
  'sexo': 'Sexo',
  'cidade_residencial': 'Cidade_Residencial',
  'bairro_residencial': 'Bairro_Residencial',
  'cidade_trabalho': 'Cidade_Trabalho',
  'bairro_trabalho': 'Bairro_Trabalho',
  'cidade_escola': 'Cidade_Escola',
  'bairro_escola': 'Bairro_Escola',
  'categoria_frequentada': 'Categoria_Frequenteada',
  'Tipo_Usuário': 'Tipo_Usuário',
  'Tipo_Lojista': 'Tipo_Lojista',
  'tempo_aplic': 'Tempo_Aplic',
  // Mapeamentos diretos (caso o cabeçalho já esteja correto)
  'Celular': 'Celular',
  'Data': 'Data',
  'Hora': 'Hora',
  'Nome_Estabelecimento': 'Nome_Estabelecimento',
  'Bairro_Estabelecimento': 'Bairro_Estabelecimento',
  'Categoria_Estabelecimento': 'Categoria_Estabelecimento',
  'Id_Campanha': 'Id_Campanha',
  'Id_Cupom': 'Id_Cupom',
  'Tipo_Cupom': 'Tipo_Cupom',
  'Produto': 'Produto',
  'Valor_Cupom': 'Valor_Cupom',
  'Repasse': 'Repasse',
  'Data_Nascimento': 'Data_Nascimento',
  'Idade': 'Idade',
  'Sexo': 'Sexo',
  'Cidade_Residencial': 'Cidade_Residencial',
  'Bairro_Residencial': 'Bairro_Residencial',
  'Cidade_Trabalho': 'Cidade_Trabalho',
  'Bairro_Trabalho': 'Bairro_Trabalho',
  'Cidade_Escola': 'Cidade_Escola',
  'Bairro_Escola': 'Bairro_Escola',
  'Categoria_Frequenteada': 'Categoria_Frequenteada',
  'Tempo_Aplic': 'Tempo_Aplic',
};

// --- NOVO MAPEAMENTO DE COLUNAS FINANCEIRAS (CFO) ---
const mapeamentoColunasFinanceiro = {
  'Descricao': 'Descricao',
  'Tipo_de_Patrimônio': 'Tipo_Patrimonio',
  'Genero_de_Patrimonio': 'Genero_Patrimonio',
  'Tipo_de_Atividade': 'Tipo_Atividade',
  'Valor_Total': 'Valor_Total',
  'Data_Atividade': 'Data_Atividade',
  'Tipo_Receita': 'Tipo_Receita',
  // Mapeamentos com nomes ligeiramente diferentes (caso o CSV venha assim)
  'Tipo_de_Patrimonio': 'Tipo_Patrimonio',
  'Genero_de_Patrimonio': 'Genero_Patrimonio',
  'Tipo_de_Atividade': 'Tipo_Atividade',
  'Data_Atividade': 'Data_Atividade',
  // Mapeamentos diretos
  'Tipo_Patrimonio': 'Tipo_Patrimonio',
  'Genero_Patrimonio': 'Genero_Patrimonio',
  'Tipo_Atividade': 'Tipo_Atividade',
};

// Função para normalizar as colunas de um objeto
const normalizarColunas = (objeto, mapeamento) => {
  const objetoNormalizado = {};
  for (const chave in objeto) {
    const chaveTrim = chave.trim();
    if (mapeamento[chaveTrim]) {
      const novaChave = mapeamento[chaveTrim];
      objetoNormalizado[novaChave] = objeto[chave];
    } else {
      // Mantém colunas não mapeadas, se necessário (ex: Valor_Total)
      objetoNormalizado[chaveTrim] = objeto[chave];
    }
  }
  return objetoNormalizado;
};

// Função para converter hora de Excel (decimal) para string HH:MM:SS
const converterHoraExcel = (horaDecimal) => {
  if (typeof horaDecimal === 'number' && horaDecimal < 1) {
    const totalSegundos = Math.round(horaDecimal * 86400);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }
  // Se já for string ou formato inesperado, retorna como está
  return String(horaDecimal); 
};

// Função para identificar qual mapeamento usar
const getMapeamentoAdequado = (primeiroItem) => {
  if (primeiroItem.hasOwnProperty('repasse_picmoney') || primeiroItem.hasOwnProperty('Repasse')) {
    return mapeamentoColunasTransacoes;
  }
  if (primeiroItem.hasOwnProperty('Tipo_de_Patrimônio') || primeiroItem.hasOwnProperty('Tipo_Patrimonio')) {
    return mapeamentoColunasFinanceiro;
  }
  // Default para transações se não for claro
  return mapeamentoColunasTransacoes; 
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
          const texto = new TextDecoder('utf-8').decode(dadosBinarios);
          dadosJson = Papa.parse(texto, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
          }).data;
        } else if (arquivo.name.endsWith('.xlsx')) {
          const workbook = XLSX.read(dadosBinarios, { type: 'array' });
          const nomePlanilha = workbook.SheetNames[0];
          const planilha = workbook.Sheets[nomePlanilha];
          dadosJson = XLSX.utils.sheet_to_json(planilha);
        } else {
          reject(new Error('Formato de arquivo não suportado. Use .csv ou .xlsx.'));
        }

        if (dadosJson.length === 0) {
          resolve([]);
          return;
        }

        // Identifica o tipo de arquivo e normaliza os dados
        const mapeamento = getMapeamentoAdequado(dadosJson[0]);
        const dadosNormalizados = dadosJson.map(item => {
          const itemNormalizado = normalizarColunas(item, mapeamento);
          
          // Limpeza e Formatação Específica
          
          // Transações (CEO)
          if (mapeamento === mapeamentoColunasTransacoes) {
            itemNormalizado.Repasse = parseFloat(itemNormalizado.Repasse) || 0;
            itemNormalizado.Valor_Cupom = parseFloat(itemNormalizado.Valor_Cupom) || 0;
            itemNormalizado.Idade = parseInt(itemNormalizado.Idade, 10) || 0;
            itemNormalizado.Tempo_Aplic = parseFloat(itemNormalizado.Tempo_Aplic) || 0;
            if (itemNormalizado.Hora) {
              itemNormalizado.Hora = converterHoraExcel(itemNormalizado.Hora);
            }
          }

          // Financeiro (CFO)
          if (mapeamento === mapeamentoColunasFinanceiro) {
            itemNormalizado.Valor_Total = parseFloat(itemNormalizado.Valor_Total) || 0;
            // Limpar valores 'Não tem' ou 'vazio' para consistência
            if (itemNormalizado.Tipo_Patrimonio === 'Não tem') itemNormalizado.Tipo_Patrimonio = '';
            if (itemNormalizado.Genero_Patrimonio === 'Não tem') itemNormalizado.Genero_Patrimonio = '';
            if (itemNormalizado.Tipo_Atividade === 'Não tem') itemNormalizado.Tipo_Atividade = '';
            if (itemNormalizado.Tipo_Receita === 'Não tem') itemNormalizado.Tipo_Receita = '';
          }

          return itemNormalizado;
        });
        
        resolve(dadosNormalizados);

      } catch (e) {
        reject(e);
      }
    };
    leitor.onerror = (err) => reject(err);
    leitor.readAsArrayBuffer(arquivo);
  });
};

export const processarArquivos = async (listaArquivos) => {
  if (!listaArquivos || listaArquivos.length === 0) {
    return [];
  }
  
  const promessas = Array.from(listaArquivos).map(lerArquivo);
  const resultados = await Promise.all(promessas);
  
  // Concatena os dados de todos os arquivos em um único array
  return [].concat(...resultados);
};