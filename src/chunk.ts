import Tile from './tile';
import {CHUNK_SIZE} from "./util";

export default class Chunk {
  private tiles: Tile[][];

  constructor(row: number, col: number) {
    const xOffset = col * CHUNK_SIZE;
    const yOffset = row * CHUNK_SIZE;
    const arr: Tile[][] = [];

    for (let y = 0; y < CHUNK_SIZE; y++) {
      arr[y] = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        arr[y][x] = new Tile(xOffset + x, yOffset + y);
      }
    }

    this.tiles = arr;
  }

  public get(x: number, y: number) {
    return this.tiles[y][x];
  }
}
