export interface BuildingMetadata {
  id: number;
  name: string;
  description: string;
  sprites: { base: string; player: string; enemy: string };
  sfx?: { select: string };
}

export default interface BuildingData extends BuildingMetadata {
  prerequisiteBuildingId: number;
  isHeadquarters: boolean;
  constructionRange: number;
  canBeConstructed: boolean;

  constructionCost: {
    [material: string]: bigint;
  };
}
