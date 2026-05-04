// Опис відповідностей
export const payTable:  Record<string, Record<number, number>> = {
    bell:   { 3: 7, 4: 25, 5: 100 },
    cherry: { 3: 5, 4: 20, 5: 40 },
    grapes: { 3: 25, 4: 50, 5: 100 },
    lemon:  { 3: 5, 4: 20, 5: 40 },
    orange: { 3: 5, 4: 25, 5: 50 },
    plum:   { 3: 15, 4: 25, 5: 50 },
    seven:  { 3: 200, 4: 500, 5: 2500 },
};

export const payLines: number[][] = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
];