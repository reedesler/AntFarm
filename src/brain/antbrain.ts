import EntityView from './EntityView';

export default abstract class AntBrain {
  protected logger: (s: string) => void;
  constructor(logger: (s: string) => void) {
    this.logger = logger;
  }
  public abstract tick(vision: Array<Array<TileView | null>>, state: AntState): Action;
}

// tslint:disable
export abstract class Action {}

export class MoveAction extends Action {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class GrabAction extends Action {
  x: number;
  y: number;
  drop: boolean;
  constructor(x: number, y: number, drop: boolean) {
    super();
    this.x = x;
    this.y = y;
    this.drop = drop;
  }
}

export interface TileView {
  covered: boolean;
  entity: EntityView | null;
}

export interface AntState {
  grabbedEntity: EntityView | null;
}
