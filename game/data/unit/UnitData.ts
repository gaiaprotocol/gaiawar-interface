export default interface UnitData {
  id: number;
  key: string;
  name: string;
  description: string;
  spine: {
    atlas: string;
    json: string;
    png: string;
  };

  prerequisiteUnitId: number;
  trainingBuildingIds: number[];
  healthPoints: number;
  attackDamage: number;
  attackRange: number;
  movementRange: number;
  canBeTrained: boolean;

  trainingCost: {
    [material: string]: bigint;
  };
}
