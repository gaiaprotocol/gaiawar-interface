export default interface BuildingData {
  id: number;
  name: string;
  description: string;
  sprites: {
    base: string;
  };

  previousBuildingId: number;
  isHeadquarters: boolean;
  constructionRange: number;
  canBeConstructed: boolean;

  constructionCosts: {
    [material: string]: bigint;
  };
}
