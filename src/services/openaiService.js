/**
 * Serviço responsável pela comunicação com a API da OpenAI.
 * Gera dados sintéticos de transações e financeiros baseados em uma descrição de estratégia.
 */

export const gerarDadosSimulados = async (apiKey, estrategiaUsuario) => {
  const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

  // O System Prompt define a estrutura estrita dos dados
  const systemPrompt = `
    Você é um simulador de dados empresariais avançado para a empresa 'PicMoney'.
    Sua tarefa é gerar um JSON contendo dados sintéticos realistas para um período de 1 mês (começando no próximo mês relativo a hoje), baseados estritamente na estratégia de negócios descrita pelo usuário.
    
    Você deve retornar APENAS um objeto JSON (sem markdown, sem texto antes ou depois) com duas chaves: "transacoes" e "financeiro".

    1. "transacoes": Um array com 150 a 200 objetos. Cada objeto DEVE ter exatamente estas chaves (respeite maiúsculas/minúsculas):
       - Celular (string, formato brasileiro)
       - Data (string, YYYY-MM-DD)
       - Hora (string, HH:MM:SS)
       - Nome_Estabelecimento (string)
       - Bairro_Estabelecimento (string, bairros de SP)
       - Categoria_Estabelecimento (string: 'Alimentação', 'Serviços', 'Lazer', 'Varejo', 'Saúde', 'Transporte')
       - Id_Campanha (string)
       - Id_Cupom (string)
       - Tipo_Cupom (string: 'Desconto', 'Cashback', 'Produto')
       - Produto (string ou 'Não tem')
       - Valor_Cupom (number, float)
       - Repasse (number, float, valor que a PicMoney ganha)
       - Data_Nascimento (string, YYYY-MM-DD)
       - Idade (number, int)
       - Sexo (string: 'Masculino', 'Feminino')
       - Cidade_Residencial (string)
       - Bairro_Residencial (string)
       - Cidade_Trabalho (string ou 'Não tem')
       - Bairro_Trabalho (string ou 'Não tem')
       - Cidade_Escola (string ou 'Não tem')
       - Bairro_Escola (string ou 'Não tem')
       - Categoria_Frequenteada (string)
       - Tipo_Usuário (string: 'USUÁRIO GRATUITO', 'USUÁRIO PAGO')
       - Tipo_Lojista (string: 'LTV GRATUITO', 'LTV PAGO')
       - Tempo_Aplic (number, int, minutos de sessão)

    2. "financeiro": Um array com 30 a 40 objetos. Cada objeto DEVE ter exatamente estas chaves:
       - Descricao (string)
       - Tipo_Patrimonio ((Se o componente é uma variável geral do balanço patrimonial, qualificá-lo-á como um Ativo, Passivo ou Patrimônio Líquido. Se não matenha-o vazio)(string: 'Ativo', 'Passivo', 'Patrimônio Líquido'))
       - Genero_Patrimonio ((Se o componente é uma variável geral do balanço patrimonial)(string: 'Circulante', 'Não Circulante' ou vazio))
       - Tipo_Atividade ((Se esse componente se qualificar dentro de uma análise de fluxo de caixa)(string: 'Atividade Operacional', 'Atividade de Investimento', 'Atividade Financeira' ou vazio))
       - Valor_Total (number, float)
       - Data_Atividade (string, YYYY-MM-DD)
       - Tipo_Receita ((Se o componente não é uma variável geral do balanço patrimonial)(string: 'Receita Bruta', 'Custo Operacional', 'Despesa Administrativa', 'Despesa Financeira', 'Despesa Comercial' ou vazio para Balanço)
'      
    IMPORTANTE: APÓS GERAR TODAS AS TRANSAÇÕES, GERE OS COMPONENTES QUE COMPÕE O BALANÇO PATRIMONIAL (ATIVO, PASSIVO E PATRIMÔNIO LÍQUIDO). A soma de todos os passivos mais todos os patrimônios líquidos deve ser igual ao total de ativos. Você deve colocar no financeiro um número total de componentes do balanço patrimonial favorável ao equilíbrio que esperamos (Ativo = Passivo + Patrimônio Líquido).
    IMPORTANTE: Os dados devem refletir matematicamente a estratégia do usuário. Ex: se ele diz "focar em universitários", aumente transações em bairros universitários, idade ~20 anos e 'Cidade_Escola' preenchida. Se ele diz "cortar custos", reduza valores de 'Despesa Administrativa' no financeiro.
    IMPORTANTE: Você deve explorar bem os custos e despesas causados pela estratégia do usuário.
  `;

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Estratégia do Usuário: "${estrategiaUsuario}"` }
        ],
        temperature: 0.7,
        max_tokens: 16000 // Garante resposta longa
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro na comunicação com a OpenAI');
    }

    const data = await response.json();
    const conteudo = data.choices[0].message.content;

    console.log(conteudo)

    // Limpeza para garantir que pegamos apenas o JSON (caso o GPT mande markdown ```json ... ```)
    const jsonString = conteudo.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Erro no serviço OpenAI:", error);
    throw error;
  }
};