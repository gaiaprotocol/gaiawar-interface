type Actor = {
  type: "building";
  buildingId: number;
} | {
  type: "unit";
  unitId: number;
  quantity: number;
};

export default Actor;
