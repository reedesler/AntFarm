import Entity from './entity';
import World from './world/world';

export default abstract class LiveEntity extends Entity {
  constructor(world: World) {
    super(world);
    world.addLiveEntitiy(this);
  }
  public abstract tick(): void;
}
