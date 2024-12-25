export interface UnitMetadata {
  id: number;
  key: string;
  name: string;
  description: string;
  spine: {
    atlas: string;
    json: string;
    png: string;
  };
  shadowSize?: string;
  canBeTrained?: boolean;
}

export default interface UnitData extends UnitMetadata {
  prerequisiteUnitId: number;
  trainingBuildingIds: number[];
  healthPoints: number;
  attackDamage: number;
  attackRange: number;
  movementRange: number;

  trainingCost: {
    [material: string]: bigint;
  };
}
