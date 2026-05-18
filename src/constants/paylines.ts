// Опис відповідностей
export const payTable:  Record<string, Record<number, number>> = {
    bell:   { 3: 20, 4: 70, 5: 100 },
    cherry: { 3: 2, 4: 12, 5: 30 },
    grapes: { 3: 10, 4: 30, 5: 100 },
    lemon:  { 3: 4, 4: 12, 5: 30 },
    orange: { 3: 6, 4: 18, 5: 50 },
    plum:   { 3: 8, 4: 25, 5: 80 },
    seven:  { 3: 25, 4: 50, 5: 1000 },
};

export const payLines: number[][] = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
];