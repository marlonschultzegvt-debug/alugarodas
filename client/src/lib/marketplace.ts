// Aluga Rodas · Estrada Editorial
// Dados e tipos do catálogo de marketplace. O shape é compatível com uma futura API de veículos, leads e analytics.

export type VehicleCategory = "Carro" | "Moto" | "Utilitário" | "Elétrico" | "Híbrido";

export type Vehicle = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  city: string;
  state: string;
  category: VehicleCategory;
  purpose: string;
  priceWeekly: number;
  priceMonthly: number;
  deposit: number;
  fuel: string;
  transmission: string;
  kmLimit: string;
  insurance: string;
  availability: string;
  appClasses: string[];
  image: string;
  accent: string;
  verified: boolean;
  provider: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "geely-ex2",
    slug: "geely-ex2-curitiba",
    brand: "Geely",
    model: "EX2",
    year: 2025,
    city: "Curitiba",
    state: "PR",
    category: "Elétrico",
    purpose: "APP",
    priceWeekly: 1350,
    priceMonthly: 4590,
    deposit: 3500,
    fuel: "Elétrico",
    transmission: "Automático",
    kmLimit: "7.000 km/mês",
    insurance: "Seguro incluso",
    availability: "Disponível agora",
    appClasses: ["Uber Comfort", "99 Plus"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663892022031/lFRFhkRyxmDSQBbG.jpg",
    accent: "#dce9e8",
    verified: true,
    provider: "Rodas Sul Mobilidade",
  },
  {
    id: "moto-entrega",
    slug: "moto-para-entrega-maringa",
    brand: "Honda",
    model: "CG 160 Start",
    year: 2024,
    city: "Maringá",
    state: "PR",
    category: "Moto",
    purpose: "Entregas",
    priceWeekly: 420,
    priceMonthly: 1390,
    deposit: 900,
    fuel: "Flex",
    transmission: "Manual",
    kmLimit: "Livre",
    insurance: "Proteção opcional",
    availability: "Disponível em 2 dias",
    appClasses: ["iFood", "99 Entrega"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663892022031/znrbgIypPNyDsAlU.jpg",
    accent: "#f1e9df",
    verified: true,
    provider: "Maringá Duas Rodas",
  },
  {
    id: "utilitario-entrega",
    slug: "fiorino-utilitario-londrina",
    brand: "Fiat",
    model: "Fiorino Endurance",
    year: 2023,
    city: "Londrina",
    state: "PR",
    category: "Utilitário",
    purpose: "Entregas",
    priceWeekly: 890,
    priceMonthly: 2990,
    deposit: 2200,
    fuel: "Flex",
    transmission: "Manual",
    kmLimit: "5.000 km/mês",
    insurance: "Seguro incluso",
    availability: "Disponível agora",
    appClasses: ["Entregas", "Uso empresarial"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663892022031/SOwgTnXAFeanSEXC.jpg",
    accent: "#e9e6de",
    verified: false,
    provider: "Loca Norte",
  },
  {
    id: "renault-kwid",
    slug: "renault-kwid-app-florianopolis",
    brand: "Renault",
    model: "Kwid Zen",
    year: 2024,
    city: "Florianópolis",
    state: "SC",
    category: "Carro",
    purpose: "APP",
    priceWeekly: 790,
    priceMonthly: 2690,
    deposit: 1800,
    fuel: "Flex",
    transmission: "Manual",
    kmLimit: "6.000 km/mês",
    insurance: "Seguro incluso",
    availability: "Disponível agora",
    appClasses: ["UberX", "99"],
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663892022031/neLaCNtNcjpXFjlZ.jpg",
    accent: "#e3ece9",
    verified: true,
    provider: "Sulcar Locadora",
  },
];

export const cityOptions = [
  { city: "Curitiba", state: "PR", country: "Brasil" },
  { city: "São Paulo", state: "SP", country: "Brasil" },
  { city: "Foz do Iguaçu", state: "PR", country: "Brasil" },
  { city: "Londrina", state: "PR", country: "Brasil" },
  { city: "Maringá", state: "PR", country: "Brasil" },
  { city: "Florianópolis", state: "SC", country: "Brasil" },
  { city: "Joinville", state: "SC", country: "Brasil" },
  { city: "Fortaleza", state: "CE", country: "Brasil" },
  { city: "Olinda", state: "PE", country: "Brasil" },
  { city: "Recife", state: "PE", country: "Brasil" },
  { city: "São José dos Pinhais", state: "PR", country: "Brasil" },
  { city: "Ponta Grossa", state: "PR", country: "Brasil" },
  { city: "Cascavel", state: "PR", country: "Brasil" },
  { city: "Londrina", state: "PR", country: "Brasil" },
  { city: "Balneário Camboriú", state: "SC", country: "Brasil" },
  { city: "Campinas", state: "SP", country: "Brasil" },
  { city: "Belo Horizonte", state: "MG", country: "Brasil" },
  { city: "Rio de Janeiro", state: "RJ", country: "Brasil" },
].filter((item, index, list) => list.findIndex((candidate) => candidate.city === item.city) === index);
export const cities = cityOptions.map((item) => item.city);
export const categories: { label: string; value: VehicleCategory | "Todos"; icon: string }[] = [
  { label: "Todos", value: "Todos", icon: "✦" },
  { label: "Carros", value: "Carro", icon: "▱" },
  { label: "Motos", value: "Moto", icon: "◒" },
  { label: "Utilitários", value: "Utilitário", icon: "▰" },
  { label: "Elétricos", value: "Elétrico", icon: "ϟ" },
  { label: "Híbridos", value: "Híbrido", icon: "⇄" },
];

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function trackEvent(event: string, payload?: Record<string, string>) {
  window.dispatchEvent(new CustomEvent("aluga-rodas:analytics", { detail: { event, payload, at: new Date().toISOString() } }));
}
