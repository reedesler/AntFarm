import Ant from '../ant';
import Entity from '../entity';
import Food from '../food';
import Block from '../world/block';

export default abstract class EntityView {
  public abstract type: string;
}

export const getEntityView = (entity: Entity | null) => {
  if (entity instanceof Ant) {
    return new AntView();
  } else if (entity instanceof Food) {
    return new FoodView();
  } else if (entity instanceof Block) {
    return new BlockView();
  }
  return null;
};

// tslint:disable
export class AntView extends EntityView {
  type: 'AntView' = 'AntView';
}

export class BlockView extends EntityView {
  type: 'BlockView' = 'BlockView';
}

export class FoodView extends EntityView {
  type: 'BlockView' = 'BlockView';
}
