import * as blessed from 'blessed';
import { Widgets } from 'blessed';
import Ant from '../ant';
import Entity from '../entity';
import Food from '../food';
import Game from '../game';
import LiveEntity from '../liveEntity';
import { CHUNK_SIZE, Colour, mod } from '../util';
import Chunk from './chunk';
import Generator from './generator';
import Tile from './tile';

export default class World {
  public box: Widgets.TextElement;

  private chunks: Chunk[][] = [[]];
  private cameraX: number;
  private cameraY: number;
  private cameraSpeed: number;
  public followingEntity: Entity | null;
  private followingIndex = -1;

  private game: Game;

  private generator: Generator;

  private liveEntities: LiveEntity[] = [];
  private ants: Ant[] = [];

  constructor(game: Game) {
    this.game = game;
    this.generator = new Generator(this);
    const WORLD_SIZE = 5;
    for (let row = -WORLD_SIZE; row <= WORLD_SIZE; row++) {
      for (let col = -WORLD_SIZE; col <= WORLD_SIZE; col++) {
        this.addChunk(row, col);
      }
    }

    const ANTZ = 5;
    for (let row = 0; row <= ANTZ; row++) {
      for (let col = 0; col <= ANTZ; col++) {
        this.chunks[0][0].getTile(col * 5 + col, row * 5 + row).setEntity(new Ant(this));
      }
    }

    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraSpeed = 2;

    this.box = blessed.text({
      width: '100%',
      height: '100%',
      tags: true,
      bg: 'brightwhite',
    });
  }

  public moveCameraUp() {
    if (!this.followingEntity) this.cameraY += this.cameraSpeed;
  }

  public moveCameraDown() {
    if (!this.followingEntity) this.cameraY -= this.cameraSpeed;
  }

  public moveCameraLeft() {
    if (!this.followingEntity) this.cameraX -= this.cameraSpeed;
  }

  public moveCameraRight() {
    if (!this.followingEntity) this.cameraX += this.cameraSpeed;
  }

  public speedCameraUp() {
    this.cameraSpeed++;
  }

  public slowCameraDown() {
    this.cameraSpeed = Math.max(this.cameraSpeed - 1, 1);
  }

  public getSpeed() {
    return this.cameraSpeed;
  }

  public render(width: number, height: number) {
    const bounds = this.getCameraBounds(width, height);
    let str = '';
    let prevBackground: Colour | null = null;
    let prevForeground: Colour | null = null;
    for (let y = bounds.up; y >= bounds.down; y--) {
      for (let x = bounds.left; x <= bounds.right; x++) {
        const tile = this.getTile(x, y);
        let background = '';
        let foreground = '';
        let char = ' ';
        let tileDisplay = (tile && tile.render()) || {};
        if (this.followingEntity && this.followingEntity.tile) {
          const followingEntityDisplay = this.followingEntity.followingDisplay(
            x - this.followingEntity.x!,
            y - this.followingEntity.y!
          );
          tileDisplay = { ...tileDisplay, ...followingEntityDisplay };
        }
        if (tileDisplay && tileDisplay.char) char = tileDisplay.char;
        if (!tileDisplay.background) tileDisplay.background = Colour.DEFAULT;
        if (tileDisplay.background && tileDisplay.background !== prevBackground) {
          background = '{' + tileDisplay.background + '-bg}';
          prevBackground = tileDisplay.background;
        }
        if (tileDisplay.foreground && tileDisplay.foreground !== prevForeground) {
          foreground = '{' + tileDisplay.foreground + '-fg}';
          prevForeground = tileDisplay.foreground;
        }
        str += background + foreground + char;
      }
      str += '\n';
    }
    this.box.content = str;
  }

  public tick() {
    for (const row of Object.values(this.chunks)) {
      for (const chunk of Object.values(row)) {
        chunk.tick();
      }
    }
    for (const liveEntity of this.liveEntities) {
      liveEntity.tick();
    }

    if (this.followingEntity && this.followingEntity.tile) {
      this.cameraX = this.followingEntity.x!;
      this.cameraY = this.followingEntity.y!;
    }
  }

  public addLiveEntity(liveEntity: LiveEntity) {
    this.liveEntities.push(liveEntity);
  }

  public removeLiveEntity(liveEntity: LiveEntity) {
    const index = this.liveEntities.indexOf(liveEntity);
    if (index > -1) {
      this.liveEntities.splice(index, 1);
    }
  }

  public addAnt(ant: Ant) {
    this.ants.push(ant);
  }

  public removeAnt(ant: Ant) {
    const index = this.ants.indexOf(ant);
    if (index > -1) {
      this.ants.splice(index, 1);
    }
  }

  public getTile(x: number, y: number): Tile | null {
    const xOffset = mod(x, CHUNK_SIZE);
    const yOffset = mod(y, CHUNK_SIZE);
    const chunk = this.getChunkFromTile(x, y);
    return chunk && chunk.getTile(xOffset, yOffset);
  }

  public setTile(x: number, y: number, tile: Tile) {
    const xOffset = mod(x, CHUNK_SIZE);
    const yOffset = mod(y, CHUNK_SIZE);
    const chunk = this.getChunkFromTile(x, y);
    return chunk && chunk.setTile(xOffset, yOffset, tile);
  }

  public spawnFood(x: number, y: number) {
    const SIZE = 3;
    for (let row = y - SIZE; row <= y + SIZE; row++) {
      for (let col = x - SIZE; col <= x + SIZE; col++) {
        const tile = this.getTile(col, row);
        if (tile && !tile.getEntity()) {
          tile.setEntity(new Food(this));
        }
      }
    }
  }

  public followNext() {
    this.followingIndex = (this.followingIndex + 1) % this.ants.length;
    this.followingEntity = this.ants[this.followingIndex];
  }

  public clearFollow() {
    this.followingIndex = -1;
    this.followingEntity = null;
  }

  public log(s: string) {
    this.game.console.content += s + '\n';
  }

  private getChunkFromTile(x: number, y: number) {
    const row = Math.floor(y / CHUNK_SIZE);
    const col = Math.floor(x / CHUNK_SIZE);
    const chunk = this.chunks[row] && this.chunks[row][col];
    return chunk;
  }

  private addChunk(row: number, col: number) {
    if (!this.chunks[row]) {
      this.chunks[row] = [];
    }
    this.chunks[row][col] = new Chunk(row, col, this.generator, this);
  }

  private getCameraBounds(width: number, height: number) {
    const right = this.cameraX + Math.floor(width / 2);
    const left = right - width + 1;
    const up = this.cameraY + Math.floor(height / 2);
    const down = up - height + 1;
    return { right, left, up, down };
  }
}
