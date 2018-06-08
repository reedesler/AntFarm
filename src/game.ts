import * as blessed from 'blessed';
import { Widgets } from 'blessed';
import World from './world/world';
const gameloop = require('node-gameloop'); // tslint:disable-line

export default class Game {
  public box: Widgets.BoxElement;
  public console: Widgets.BoxElement;

  private screen: Widgets.Screen;
  private world: World;

  constructor(screen: Widgets.Screen) {
    this.screen = screen;
    this.world = new World(this);
    this.box = blessed.box({
      bg: 'black',
      top: 0,
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

    this.box.key('space', (ch, key) => {
      this.tick();
    });

    this.console = blessed.box({
      bg: 'black',
      fg: 'white',
      top: 0,
      left: '75%+1',
      width: '50%',
      height: '100%',
    });

    this.tick = this.tick.bind(this);
  }

  public render() {
    this.world.render(Number(this.box.width), Number(this.box.height));
    this.screen.render();
  }

  public startTick(): number {
    return gameloop.setGameLoop(this.tick, 1000 / 60);
  }

  private tick() {
    this.world.tick();
    this.render();
  }
}
