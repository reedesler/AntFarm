import * as blessed from 'blessed';
import { Widgets } from 'blessed';
import Chunk from './chunk';
import Game from "./game";
import Tile from "./tile";
import {CHUNK_SIZE, mod} from "./util";

export default class World {
  public box: Widgets.TextElement;

  private chunks: Chunk[][] = [[]];
  private cameraX;
  private cameraY;

  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.addChunk(0, 0);
    this.addChunk(-1, 0);
    this.addChunk(0, -1);
    this.addChunk(-1, -1);
    this.cameraX = 0;
    this.cameraY = 0;

    this.box = blessed.text({
      width: '100%',
      height: '100%',
      tags: true,
    });
  }

  public moveCameraUp() {
    this.cameraY++;
  }

  public moveCameraDown() {
    this.cameraY--;
  }

  public moveCameraLeft() {
    this.cameraX--;
  }

  public moveCameraRight() {
    this.cameraX++;
  }

  public render(width: number, height: number) {
    const bounds = this.getCameraBounds(width, height);
    let str = '';
    for (let j = bounds.up; j >= bounds.down; j--) {
      for (let i = bounds.left; i <= bounds.right; i++) {
        const tile = this.getTile(i, j);
        let char = ' ';
        if (tile) {
          const tileDisplay = tile.render();
          char = tileDisplay.char || ' ';
        }
        str += char;
      }
      str += '\n';
    }
    this.box.content = str;
  }

  private addChunk(row: number, col: number) {
    if (!this.chunks[row]) {
      this.chunks[row] = [];
    }
    this.chunks[row][col] = new Chunk(row, col);
  }

  private getTile(x: number, y: number): Tile | null {
    const row = Math.floor(y / CHUNK_SIZE);
    const col = Math.floor(x / CHUNK_SIZE);
    const chunk = this.chunks[row] && this.chunks[row][col];
    const xOffset = mod(x, CHUNK_SIZE);
    const yOffset = mod(y, CHUNK_SIZE);
    return chunk && chunk.get(xOffset, yOffset);
  }

  private getCameraBounds(width: number, height: number) {
    const right = this.cameraX + Math.floor(width / 2);
    const left = right - width + 1;
    const up = this.cameraY + Math.floor(height / 2);
    const down = up - height + 1;
    return { right, left, up, down };
  }
}