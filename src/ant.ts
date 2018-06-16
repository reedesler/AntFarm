import { AntState, default as AntBrain, GrabAction, MoveAction, TileView } from './brain/antbrain';
import ReedBrain from './brain/custom/ExampleBrain';
import { getEntityView } from './brain/EntityView';
import Entity from './entity';
import LiveEntity from './liveEntity';
import ShadowCaster from './shadowcaster/shadowcaster';
import { Colour } from './util';
import Tile, { TileDisplay } from './world/tile';
import World from './world/world';

export default class Ant extends LiveEntity {
  private dead = false;
  private fov: Array<Array<TileView | null>>;

  private brain: AntBrain;

  private grabbedEntity: Entity | null;

  constructor(world: World) {
    super(world);
    world.addAnt(this);
    const logger = (s: string) => {
      if (this.world.followingEntity === this) {
        this.world.log(s);
      }
    };
    this.brain = new ReedBrain(logger);
  }

  public render(): TileDisplay {
    const display: TileDisplay = {
      char: '•',
      foreground: this.dead ? Colour.BLACK : Colour.RED,
    };
    if (this.grabbedEntity) {
      display.background = this.grabbedEntity.render().foreground;
    }
    return display;
  }

  public followingDisplay(x: number, y: number): TileDisplay {
    if (this.fov[y] && this.fov[y][x]) {
      return {
        background: Colour.YELLOW,
      };
    }
    return {};
  }

  public tick() {
    if (!this.tile) return;
    if (Math.random() < 0.0001) {
      // return this.destroy();
    }
    if (this.dead) return;
    if (Math.random() < 0.001) {
      // this.dead = true;
    }
    this.fov = this.getFov();
    const state: AntState = {
      grabbedEntity: getEntityView(this.grabbedEntity),
    };
    const action = this.brain.tick(this.fov, state);
    if (action instanceof MoveAction) {
      this.move(action.x, action.y);
    } else if (action instanceof GrabAction) {
      this.grab(action.x, action.y, action.drop);
    }
  }

  private getFov() {
    const fov: Array<Array<Tile | null>> = [];
    const VIEW_LIMIT = 20;
    for (let y = -VIEW_LIMIT; y <= VIEW_LIMIT; y++) {
      fov[y] = [];
      for (let x = -VIEW_LIMIT; x <= VIEW_LIMIT; x++) {
        fov[y][x] = this.world.getTile(this.x! + x, this.y! + y);
      }
    }
    const isOpaque = (x: number, y: number) => {
      const tile = fov[y][x];
      return !tile || tile.isOpaque();
    };
    const lineOfSightFov: Array<Array<TileView | null>> = [];
    const setFov = (x: number, y: number) => {
      if (!lineOfSightFov[y]) {
        lineOfSightFov[y] = [];
      }
      const tile = fov[y][x];
      if (tile) {
        const entity = getEntityView(tile.getEntity());
        lineOfSightFov[y][x] = {
          covered: tile.getCovered(),
          entity,
        };
      } else {
        lineOfSightFov[y][x] = null;
      }
    };
    ShadowCaster.computeFieldOfViewWithShadowCasting(0, 0, VIEW_LIMIT, isOpaque, setFov);
    return lineOfSightFov;
  }

  public destroy() {
    super.destroy();
    this.world.removeAnt(this);
  }

  private grab(x: number, y: number, drop: boolean) {
    if (Math.abs(x) > 1 || Math.abs(y) > 1 || !this.tile) return;
    const destTile = this.world.getTile(this.tile.x + x, this.tile.y + y);
    if (!destTile) return;
    if (drop) {
      const entity = destTile.getEntity();
      if (!this.grabbedEntity || entity) return;
      destTile.setEntity(this.grabbedEntity);
      this.grabbedEntity = null;
    } else {
      const entity = destTile.getEntity();
      if (this.grabbedEntity || !entity) return;
      this.grabbedEntity = entity;
      destTile.setEntity(null);
      entity.tile = null;
    }
  }
}
