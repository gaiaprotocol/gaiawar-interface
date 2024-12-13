export default interface Building {
  id: number;
  name: string;
  description: string;
  assets: {
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
