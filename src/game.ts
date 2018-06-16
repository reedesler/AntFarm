import * as blessed from 'blessed';
import { Widgets } from 'blessed';
import { Colour } from './util';
import World from './world/world';
const gameloop = require('node-gameloop'); // tslint:disable-line

export default class Game {
  public box: Widgets.BoxElement;
  public console: Widgets.BoxElement;
  public toolbar: Widgets.BoxElement;
  public pausedDisplay: Widgets.BoxElement;

  private screen: Widgets.Screen;
  private world: World;

  private loopId: number = -1;

  private GAME_SPEEDS = [2000, 1000, 1000 / 5, 1000 / 15, 1000 / 30, 1000 / 60, 0];
  private gameSpeedIndex = 5;

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
    this.world = new World(this);
    this.box = blessed.box({
      bg: 'black',
      top: 1,
      left: 0,
      width: '75%',
      height: '100%',
    });
    this.box.append(this.world.box);
    this.box.focus();

    this.box.key(['up', 'w'], (ch, key) => {
      this.world.moveCameraUp();
      this.render();
    });

    this.box.key(['down', 's'], (ch, key) => {
      this.world.moveCameraDown();
      this.render();
    });

    this.box.key(['left', 'a'], (ch, key) => {
      this.world.moveCameraLeft();
      this.render();
    });

    this.box.key(['right', 'd'], (ch, key) => {
      this.world.moveCameraRight();
      this.render();
    });

    this.box.key('z', (ch, key) => {
      this.world.speedCameraUp();
    });

    this.box.key('x', (ch, key) => {
      this.world.slowCameraDown();
    });

    this.box.key('space', (ch, key) => {
      if (this.loopId === -1) {
        this.startTick();
        this.pausedDisplay.hide();
      } else {
        gameloop.clearGameLoop(this.loopId);
        this.loopId = -1;
        this.pausedDisplay.show();
        screen.render();
      }
    });

    this.box.key('m', () => {
      this.gameSpeedIndex = Math.min(this.gameSpeedIndex + 1, this.GAME_SPEEDS.length - 1);
      gameloop.clearGameLoop(this.loopId);
      this.startTick();
    });

    this.box.key('n', () => {
      this.gameSpeedIndex = Math.max(this.gameSpeedIndex - 1, 0);
      gameloop.clearGameLoop(this.loopId);
      this.startTick();
    });

    this.console = blessed.box({
      bg: 'black',
      fg: 'white',
      top: 0,
      left: '75%+1',
      width: '50%',
      height: '100%',
    });

    this.toolbar = blessed.box({
      top: 0,
      height: 1,
      width: '75%',
      fg: Colour.BLACK,
    });

    this.pausedDisplay = blessed.box({
      top: 0,
      left: 'center',
      content: '==PAUSED==',
    });

    this.toolbar.append(this.pausedDisplay);
    this.pausedDisplay.hide();

    this.tick = this.tick.bind(this);
  }

  public render() {
    const fps = 1000 / this.GAME_SPEEDS[this.gameSpeedIndex];
    this.toolbar.content =
      'Camera Speed: ' + this.world.getSpeed() + '     Game speed: ' + fps.toFixed(1) + ' FPS';
    this.world.render(Number(this.box.width), Number(this.box.height));
    this.screen.render();
  }

  public startTick(): number {
    this.loopId = gameloop.setGameLoop(this.tick, this.GAME_SPEEDS[this.gameSpeedIndex]);
    return this.loopId;
  }

  private tick() {
    this.world.tick();
    this.render();
  }
}
