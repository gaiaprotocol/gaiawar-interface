export default interface BuildingData {
  id: number;
  name: string;
  description: string;
  sprites: { base: string; player: string; enemy: string };

  prerequisiteBuildingId: number;
  isHeadquarters: boolean;
  constructionRange: number;
  canBeConstructed: boolean;

  constructionCost: {
    [material: string]: bigint;
  };
}
