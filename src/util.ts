export enum Colour {
  RED = 'red',
}

export const CHUNK_SIZE = 32;

export const mod = (n, m) => {
  return ((n % m) + m) % m;
};