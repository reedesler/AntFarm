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
    this.toolbar.content = 'Camera Speed: ' + this.world.getSpeed();
    this.world.render(Number(this.box.width), Number(this.box.height));
    this.screen.render();
  }

  public startTick(): number {
    this.loopId = gameloop.setGameLoop(this.tick, 1000 / 60);
    return this.loopId;
  }

  private tick() {
    this.world.tick();
    this.render();
  }
}
