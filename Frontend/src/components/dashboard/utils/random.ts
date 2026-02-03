export function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

export function seededNumber(seed: string, min: number, max: number) {
  const value = seededRandom(seed);
  return min + value * (max - min);
}


