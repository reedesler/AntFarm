export enum Colour {
  RED = 'red',
  BRIGHTRED = '#ff0000',
  GREEN = 'green',
  WHITE = 'white',
  BLACK = 'black',
  BRIGHTBLACK = 'brightblack',
  BRIGHTWHITE = 'brightwhite',
  DEFAULT = 'default',
}

export const CHUNK_SIZE = 64;

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
