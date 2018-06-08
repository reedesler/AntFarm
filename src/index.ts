import * as blessed from 'blessed';
import Game from './game';

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
});

screen.title = 'AntFarm';

const game = new Game(screen);

const renderedGame = game.box;

renderedGame.on('resize', () => {
  renderedGame.content = 'wowowow';
  game.render();
  screen.render();
});

screen.append(renderedGame);
screen.append(game.console);
screen.append(game.toolbar);
game.render();

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  return process.exit(0);
});

screen.render();

game.startTick();
