import {CHUNK_SIZE} from "../util";
import Generator from "./generator";
import Tile from './tile';

export default class Chunk {
  private tiles: Tile[][];

  constructor(row: number, col: number, generator: Generator) {
    const xOffset = col * CHUNK_SIZE;
    const yOffset = row * CHUNK_SIZE;
    const arr: Tile[][] = [];

    for (let y = 0; y < CHUNK_SIZE; y++) {
      arr[y] = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const globX = xOffset + x;
        const globY = yOffset + y;
        const t = new Tile(globX, globY);
        generator.generate(t);
        arr[y][x] = t;
      }
    }

    this.tiles = arr;
  }

  public get(x: number, y: number) {
    return this.tiles[y][x];
  }
}
