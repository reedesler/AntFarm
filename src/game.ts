import * as blessed from 'blessed';
import { Widgets } from 'blessed';
import World from './world';

export default class Game {
  public box: Widgets.BoxElement;
  public console: Widgets.BoxElement;

  private world: World;

  constructor(screen: Widgets.Screen) {
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
      this.render(screen);
    });

    this.box.key(['down', 's'], (ch, key) => {
      this.world.moveCameraDown();
      this.render(screen);
    });

    this.box.key(['left', 'a'], (ch, key) => {
      this.world.moveCameraLeft();
      this.render(screen);
    });

    this.box.key(['right', 'd'], (ch, key) => {
      this.world.moveCameraRight();
      this.render(screen);
    });

    this.console = blessed.box({
      bg: 'black',
      fg: 'white',
      top: 0,
      left: '75%+1',
      width: '50%',
      height: '100%',
    });

  }

  public render(screen: Widgets.Screen) {
    this.world.render(Number(this.box.width), Number(this.box.height));
    screen.render();
  }
}
