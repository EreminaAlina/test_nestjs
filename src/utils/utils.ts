export const average = (array: number[]): number => {
  let sum = 0;

  for (const number of array) {
    sum += number;
  }

  return sum / array.length;
};

export const calculateTariff = (tariff: number, days: number): number => {
  let sum = 0;
  for (let i = 0; i < days; i++) {
    if (i < 4) {
      sum += tariff;
      continue;
    }
    if (i < 9) {
      sum += tariff - tariff * 0.05;
      continue;
    }
    if (i < 17) {
      sum += tariff - tariff * 0.1;
      continue;
    }
    if (i < 29) {
      sum += tariff - tariff * 0.15;
    }
  }
  return sum;
};
