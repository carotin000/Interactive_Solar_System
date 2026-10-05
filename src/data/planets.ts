export interface PlanetData {
  name: string;
  nameRu: string;
  radius: number; // визуальный радиус в пикселях
  orbitRadius: number; // визуальный радиус орбиты
  color: string;
  orbitalPeriod: string;
  orbitalPeriodDays: number;
  distanceFromSun: string;
  diameter: string;
  description: string;
  speed: number; // скорость вращения (радиан/кадр)
}

export const planets: PlanetData[] = [
  {
    name: "Mercury",
    nameRu: "Меркурий",
    radius: 4,
    orbitRadius: 60,
    color: "#b5b5b5",
    orbitalPeriod: "88 дней",
    orbitalPeriodDays: 88,
    distanceFromSun: "57.9 млн км",
    diameter: "4 879 км",
    description: "Самая маленькая и ближайшая к Солнцу планета.",
    speed: 0.04,
  },
  {
    name: "Venus",
    nameRu: "Венера",
    radius: 7,
    orbitRadius: 95,
    color: "#e8cda0",
    orbitalPeriod: "225 дней",
    orbitalPeriodDays: 225,
    distanceFromSun: "108.2 млн км",
    diameter: "12 104 км",
    description: "Самая горячая планета с плотной атмосферой из CO₂.",
    speed: 0.015,
  },
  {
    name: "Earth",
    nameRu: "Земля",
    radius: 8,
    orbitRadius: 135,
    color: "#4da6ff",
    orbitalPeriod: "365.25 дней",
    orbitalPeriodDays: 365,
    distanceFromSun: "149.6 млн км",
    diameter: "12 742 км",
    description: "Наш дом — единственная известная планета с жизнью.",
    speed: 0.01,
  },
  {
    name: "Mars",
    nameRu: "Марс",
    radius: 5,
    orbitRadius: 175,
    color: "#e05a3a",
    orbitalPeriod: "687 дней",
    orbitalPeriodDays: 687,
    distanceFromSun: "227.9 млн км",
    diameter: "6 779 км",
    description: "Красная планета с самой высокой горой в Солнечной системе.",
    speed: 0.008,
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    radius: 18,
    orbitRadius: 240,
    color: "#c88b3a",
    orbitalPeriod: "11.86 лет",
    orbitalPeriodDays: 4333,
    distanceFromSun: "778.5 млн км",
    diameter: "139 820 км",
    description: "Крупнейшая планета — газовый гигант с Большим Красным Пятном.",
    speed: 0.004,
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    radius: 15,
    orbitRadius: 310,
    color: "#e8d590",
    orbitalPeriod: "29.46 лет",
    orbitalPeriodDays: 10759,
    distanceFromSun: "1 434 млн км",
    diameter: "116 460 км",
    description: "Знаменит своими впечатляющими кольцами из льда и камня.",
    speed: 0.003,
  },
  {
    name: "Uranus",
    nameRu: "Уран",
    radius: 11,
    orbitRadius: 375,
    color: "#7de8e8",
    orbitalPeriod: "84.01 лет",
    orbitalPeriodDays: 30687,
    distanceFromSun: "2 871 млн км",
    diameter: "50 724 км",
    description: "Ледяной гигант, вращающийся «на боку» — ось наклонена на 98°.",
    speed: 0.002,
  },
  {
    name: "Neptune",
    nameRu: "Нептун",
    radius: 10,
    orbitRadius: 430,
    color: "#3f54e8",
    orbitalPeriod: "164.8 лет",
    orbitalPeriodDays: 60190,
    distanceFromSun: "4 495 млн км",
    diameter: "49 244 км",
    description: "Самая далёкая планета с сильнейшими ветрами до 2100 км/ч.",
    speed: 0.001,
  },
];
