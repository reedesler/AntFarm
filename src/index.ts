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
  game.render(screen);
  screen.render();
});

screen.append(renderedGame);
screen.append(game.console);
game.render(screen);

/* const x = 0;
const y = 0;

const box = blessed.text({
    top: y,
    left: x,
    content: '•',
    fg: 'red'
});

box.focus();

screen.append(box);

box.key('up', (ch, key) => {
    y--;
    box.top = y;
    screen.render();
});

box.key('down', (ch, key) => {
    y++;
    box.top = y;
    screen.render();
});

box.key('left', (ch, key) => {
    x--;
    box.left = x;
    screen.render();
});

box.key('right', (ch, key) => {
    x++;
    box.left = x;
    screen.render();
}); */

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  return process.exit(0);
});

screen.render();
