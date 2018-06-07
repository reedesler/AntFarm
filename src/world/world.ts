import * as blessed from 'blessed';
import { Widgets } from 'blessed';
import Game from '../game';
import { CHUNK_SIZE, mod } from '../util';
import Chunk from './chunk';
import Generator from './generator';
import Tile from './tile';

export default class World {
  public box: Widgets.TextElement;

  private chunks: Chunk[][] = [[]];
  private cameraX;
  private cameraY;

  private game: Game;

  private generator: Generator;

  constructor(game: Game) {
    this.game = game;
    this.generator = new Generator();
    const WORLD_SIZE = 5;
    for (let row = -WORLD_SIZE; row <= WORLD_SIZE; row++) {
      for (let col = -WORLD_SIZE; col <= WORLD_SIZE; col++) {
        this.addChunk(row, col);
      }
    }
    this.cameraX = 0;
    this.cameraY = 0;

    this.box = blessed.text({
      width: '100%',
      height: '100%',
      tags: true,
      bg: 'brightwhite',
    });
  }

  public moveCameraUp() {
    this.cameraY += 2;
  }

  public moveCameraDown() {
    this.cameraY -= 2;
  }

  public moveCameraLeft() {
    this.cameraX -= 2;
  }

  public moveCameraRight() {
    this.cameraX += 2;
  }

  public render(width: number, height: number) {
    const bounds = this.getCameraBounds(width, height);
    let str = '';
    for (let j = bounds.up; j >= bounds.down; j--) {
      for (let i = bounds.left; i <= bounds.right; i++) {
        const tile = this.getTile(i, j);
        let background = '{/}';
        let char = ' ';
        if (tile) {
          const tileDisplay = tile.render();
          char = tileDisplay.char || ' ';
          if (tileDisplay.background) {
            background = '{' + tileDisplay.background + '-bg}';
          }
        }
        str += background + char;
      }
      str += '\n';
    }
    this.box.content = str;
  }

  private addChunk(row: number, col: number) {
    if (!this.chunks[row]) {
      this.chunks[row] = [];
    }
    this.chunks[row][col] = new Chunk(row, col, this.generator);
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
