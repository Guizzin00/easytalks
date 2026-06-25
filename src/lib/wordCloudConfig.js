// Configuração de palavras ignoradas por não possuírem valor semântico.
export const stopWords = new Set([
  "de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "é", "com", "não",
  "uma", "os", "no", "se", "na", "por", "mais", "as", "dos", "como", "mas", "foi",
  "ao", "ele", "das", "tem", "à", "seu", "sua", "ou", "ser", "quando", "muito",
  "há", "nos", "já", "está", "eu", "também", "só", "pelo", "pela", "até", "isso",
  "ela", "entre", "era", "depois", "sem", "mesmo", "aos", "ter", "seus", "quem",
  "nas", "me", "esse", "eles", "estão", "você", "tinha", "foram", "essa", "num",
  "nem", "suas", "meu", "às", "minha", "têm", "numa", "pelos", "elas", "havia",
  "seja", "qual", "será", "nós", "tenho", "lhe", "deles", "essas", "esses", "pelas",
  "este", "fosse", "dele", "tu", "te", "vocês", "vos", "lhes", "meus", "minhas",
  "teu", "tua", "teus", "tuas", "nosso", "nossa", "nossos", "nossas", "dela",
  "delas", "esta", "estes", "estas", "aquele", "aquela", "aqueles", "aquelas",
  "isto", "aquilo", "estou", "estamos", "estive", "esteve",
  "estivemos", "estiveram", "estava", "estávamos", "estavam", "estivera",
  "estivéramos", "esteja", "estejamos", "estejam", "estivesse", "estivéssemos",
  "estivessem", "estiver", "estivermos", "estiverem", "hei", "havemos",
  "hão", "houve", "houvemos", "houveram", "houvera", "houvéramos", "haja",
  "hajamos", "hajam", "houvesse", "houvéssemos", "houvessem", "houver", "houvermos",
  "houverem", "houverei", "houverá", "houveremos", "houverão", "houveria",
  "houveríamos", "houveriam", "sou", "somos", "são", "éramos", "eram",
  "fui", "fomos", "fora", "fôramos", "sejamos", "sejam",
  "fôssemos", "fossem", "for", "formos", "forem", "serei",
  "seremos", "serão", "seria", "seríamos", "seriam", "temos",
  "tínhamos", "tinham", "tive", "teve", "tivemos", "tiveram",
  "tivera", "tivéramos", "tenha", "tenhamos", "tenham", "tivesse", "tivéssemos",
  "tivessem", "tiver", "tivermos", "tiverem", "terei", "terá", "teremos", "terão",
  "teria", "teríamos", "teriam", "sendo", "tudo", "todos", "todas", "porque",
  "sempre", "sobre", "vez", "dia", "anos", 
  "pra", "pro", "tá", "tô", "aí", "aqui", "lá", "onde", "bem", "mal", "assim", 
  "então", "agora", "fazer", "dar", "ver", "dizer", "ir", "pode", "vai", "vou", 
  "quero", "quer", "acho", "sabe", "tudo", "nada", "alguém", "ninguém", "cada",
  "qualquer", "outra", "outro", "outras", "outros", "dá"
]);

// Configuração de palavras óbvias que não agregam valor ao dashboard (Blacklist).
export const blacklist = [
  "easyplan",
  "empresa",
  "colaborador",
  "colaboradores"
];

// Configuração para agrupar conceitos similares sob o mesmo termo principal.
export const synonyms = {
  crescer: "crescimento",
  crescimento: "crescimento",
  evolucao: "crescimento",
  desenvolvimento: "crescimento",

  aprender: "aprendizado",
  aprendizado: "aprendizado",
  conhecimento: "aprendizado",

  equipe: "colaboracao",
  colaboracao: "colaboracao",
  uniao: "colaboracao",
  juntos: "colaboracao",
  
  inovacao: "inovacao",
  inovar: "inovacao",
  criatividade: "inovacao"
};
