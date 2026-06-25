import { stopWords, blacklist, synonyms } from './wordCloudConfig';

/**
 * Módulo de Processamento de Linguagem Natural (NLP) para Nuvem de Palavras
 * Pipeline: Minúsculas -> Sem Acentos -> Sem Punct/Num/Emojis -> 
 * Tokenização -> Sem StopWords/Blacklist -> Sinônimos -> Frequência & Percentual
 */

// 1. Minúsculas
const toLowerCase = (text) => text.toLowerCase();

// 2. Remover Acentos
const removeAccents = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// 3. Remover Pontuações e Caracteres Especiais
const removePunctuationAndNumbers = (text) => {
  // Mantém apenas letras não acentuadas (já tiramos acentos antes) e espaços.
  // Pela regra de negócio pedida, também ignoramos os números.
  return text.replace(/[^a-z\s]/g, " ");
};

// 4. Remover Emojis (redundante pelo regex acima, mas explícito conforme pedido)
const removeEmojis = (text) => {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, " ");
};

// 5. Dividir em palavras (Tokenização)
const tokenize = (text) => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

// 6. Remover Stop Words
const removeStopWords = (words) => {
  return words.filter(word => !stopWords.has(word));
};

// 7. Remover palavras menores que 3 caracteres
const filterByLength = (words) => {
  return words.filter(word => word.length >= 3);
};

// 8. Aplicar Blacklist (sempre checando em lowercase/sem acento)
const applyBlacklist = (words) => {
  return words.filter(word => !blacklist.includes(word));
};

// 9. Agrupar palavras através do dicionário de Sinônimos
const applySynonyms = (words) => {
  return words.map(word => synonyms[word] || word);
};

// 10. Calcular frequência, ordenar e gerar %
const calculateFrequency = (words) => {
  const counts = {};
  let totalWords = 0;

  words.forEach(word => {
    counts[word] = (counts[word] || 0) + 1;
    totalWords++;
  });

  const wordsArray = Object.keys(counts).map(word => ({
    text: word,
    value: counts[word],
    percentage: totalWords > 0 ? Number(((counts[word] / totalWords) * 100).toFixed(1)) : 0
  }));

  // Ordenar decrescente
  return wordsArray.sort((a, b) => b.value - a.value);
};

/**
 * Função Principal Exposta
 * @param {Array} statements Array de depoimentos (strings)
 * @returns {Array} Array de objetos { text, value, percentage }
 */
export function processWordCloudData(statements) {
  if (!statements || statements.length === 0) return [];

  // Juntar todas as frases numa string só para facilitar o pipeline
  const joinedText = statements.join(" ");

  const step1 = toLowerCase(joinedText);
  const step2 = removeAccents(step1);
  const step3 = removeEmojis(step2);
  const step4 = removePunctuationAndNumbers(step3);
  
  const tokens = tokenize(step4);
  
  const step5 = filterByLength(tokens);
  const step6 = removeStopWords(step5);
  const step7 = applyBlacklist(step6);
  const step8 = applySynonyms(step7);
  
  return calculateFrequency(step8);
}
