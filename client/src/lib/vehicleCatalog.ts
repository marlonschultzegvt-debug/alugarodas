// Aluga Rodas · Cadastro inteligente
// Catálogos locais para UX imediata; a integração FIPE é consultiva e o Detran fica preparada para backend autorizado.

export const stateOptions = [
  { uf: "PR", name: "Paraná" }, { uf: "SC", name: "Santa Catarina" }, { uf: "SP", name: "São Paulo" },
  { uf: "RS", name: "Rio Grande do Sul" }, { uf: "MG", name: "Minas Gerais" }, { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "ES", name: "Espírito Santo" }, { uf: "GO", name: "Goiás" }, { uf: "BA", name: "Bahia" },
  { uf: "PE", name: "Pernambuco" }, { uf: "CE", name: "Ceará" }, { uf: "DF", name: "Distrito Federal" },
  { uf: "MT", name: "Mato Grosso" }, { uf: "MS", name: "Mato Grosso do Sul" }, { uf: "PA", name: "Pará" },
  { uf: "AM", name: "Amazonas" }, { uf: "MA", name: "Maranhão" }, { uf: "PB", name: "Paraíba" },
  { uf: "RN", name: "Rio Grande do Norte" }, { uf: "AL", name: "Alagoas" }, { uf: "PI", name: "Piauí" },
  { uf: "SE", name: "Sergipe" }, { uf: "RO", name: "Rondônia" }, { uf: "TO", name: "Tocantins" },
  { uf: "AC", name: "Acre" }, { uf: "AP", name: "Amapá" }, { uf: "RR", name: "Roraima" },
];

export const citiesByState: Record<string, string[]> = {
  PR: ["Curitiba", "Maringá", "Londrina", "Cascavel", "Ponta Grossa", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava", "Paranaguá"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Itajaí", "Chapecó", "Criciúma", "Balneário Camboriú"],
  SP: ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto", "Sorocaba", "Jundiaí", "Bauru", "Osasco"],
  RS: ["Porto Alegre", "Caxias do Sul", "Canoas", "Pelotas", "Santa Maria", "Novo Hamburgo", "Gravataí"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Uberaba"],
  RJ: ["Rio de Janeiro", "Niterói", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Petrópolis", "Volta Redonda"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Itumbiara"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
  DF: ["Brasília"],
};

export const vehicleYears = Array.from({ length: 12 }, (_, index) => String(2027 - index));
export const vehicleCategories = ["Carro", "Moto", "Elétrico", "Híbrido", "Utilitário", "Van", "Caminhonete"];
export const fuelOptions = ["Flex", "Gasolina", "Etanol", "Diesel", "Elétrico", "Híbrido", "Híbrido plug-in"];

export type FipeLookup = { type: "carros" | "motos" | "caminhoes"; brandCode: string; modelCode: string; yearCode: string };
export type FipeVehicle = { brand: string; model: string; year: string; fuel: string; price: string; codeFipe: string; reference: string };
export type FipeOption = { codigo: string; nome: string };

const FIPE_API = "https://parallelum.com.br/fipe/api/v1";

export async function fetchFipeOptions(path: string): Promise<FipeOption[]> {
  const response = await fetch(`${FIPE_API}/${path}`);
  if (!response.ok) throw new Error("Não foi possível carregar as opções FIPE agora.");
  const payload = await response.json() as FipeOption[] | { modelos?: FipeOption[] };
  return Array.isArray(payload) ? payload : (payload.modelos ?? []);
}

export async function fetchFipeVehicle({ type, brandCode, modelCode, yearCode }: FipeLookup): Promise<FipeVehicle> {
  const response = await fetch(`${FIPE_API}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`);
  if (!response.ok) throw new Error("Não foi possível consultar a referência FIPE agora.");
  return response.json() as Promise<FipeVehicle>;
}

export const detranIntegrationNote = "Consultas de placa, Renavam, CRLV, débitos e restrições devem passar por backend seguro e serviço autorizado, como os produtos oficiais Denatran/SERPRO ou integrações estaduais licenciadas. Nunca expor credenciais no navegador.";
