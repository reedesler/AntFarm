export enum Colour {
  RED = 'red',
  WHITE = 'white',
  BLACK = 'black',
  BRIGHTBLACK = 'brightblack',
  BRIGHTWHITE = 'brightwhite',
  DEFAULT = 'default',
}

export const CHUNK_SIZE = 64;

export const mod = (n, m) => {
  return ((n % m) + m) % m;
};
