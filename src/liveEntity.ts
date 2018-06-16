import Entity from './entity';
import World from './world/world';

export default abstract class LiveEntity extends Entity {
  constructor(world: World) {
    super(world);
    world.addLiveEntity(this);
  }
  public abstract tick(): void;

  public destroy() {
    super.destroy();
    this.world.removeLiveEntity(this);
  }
}
