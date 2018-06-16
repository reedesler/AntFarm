import { getRandomInt } from '../../util';
import AntBrain, { Action, AntState, GrabAction, MoveAction, TileView } from '../antbrain';

export default class ExampleBrain extends AntBrain {
  private moveX: number;
  private moveY: number;

  constructor(logger: (s: string) => void) {
    super(logger);
    this.moveX = getRandomInt(-1, 1);
    this.moveY = getRandomInt(-1, 1);
  }

  public tick(vision: Array<Array<TileView | null>>, state: AntState): Action {
    if (state.grabbedEntity) {
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          if ((x === this.moveX && y === this.moveY) || (x === -this.moveX && y === -this.moveY))
            continue;
          const tile = vision[y][x];
          if (tile && !tile.entity) {
            return new GrabAction(x, y, true);
          }
        }
      }
      const frontTile =
        vision[-this.moveX * 2] && (vision[-this.moveX * 2][-this.moveY * 2] as TileView | null);
      if (!frontTile || frontTile.entity) {
        return new GrabAction(-this.moveX, -this.moveY, true);
      } else {
        return new MoveAction(-this.moveX, -this.moveY);
      }
    }
    this.logger(JSON.stringify(vision[this.moveY][this.moveX]));
    const moveTile = vision[this.moveY][this.moveX];
    if (moveTile && moveTile.entity) {
      return new GrabAction(this.moveX, this.moveY, false);
    }
    return new MoveAction(this.moveX, this.moveY);
  }
}
