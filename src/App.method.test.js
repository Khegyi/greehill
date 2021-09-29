import {
  isCellAlive,
  countAliveNeighbours,
  getNeighboursPosition,
  willCellSurvive,
} from "./App.method";
import presets from "./presets";

const testCellFirst = { row: 0, coll: 0, alive: true };
const testAlfaCell = {
  row: 0,
  coll: 2,
  alive: true,
  neighbours: [
    { row: 0, coll: 1 },
    { row: 0, coll: 3 },
    { row: 1, coll: 1 },
    { row: 1, coll: 2 },
    { row: 1, coll: 3 },
  ],
};
const testCellAlive = { row: 1, coll: 1, alive: true };
const testCellDead = { row: 1, coll: 1, alive: false };
const testCellPositon = { row: 0, coll: 1 };
const testRightButtomCorneCellPositon = {
  row: 29,
  coll: 29,
  neighbours: [
    { row: 0, coll: 1 },
    { row: 0, coll: 3 },
    { row: 1, coll: 1 },
    { row: 1, coll: 2 },
    { row: 1, coll: 3 },
  ],
};
const expectedNeighbours = [
  { row: 0, coll: 0 },
  { row: 0, coll: 1 },
  { row: 0, coll: 2 },
  { row: 1, coll: 0 },
  { row: 1, coll: 2 },
  { row: 2, coll: 0 },
  { row: 2, coll: 1 },
  { row: 2, coll: 2 },
];
const expectedRightButtomCornerNeighbours = [
  { row: 28, coll: 28 },
  { row: 28, coll: 29 },
  { row: 29, coll: 28 },
];

describe("Test with pikachu", () => {
  it("should get the correct lifesignal", () => {
    expect(isCellAlive(testAlfaCell, presets.pikachu, 30)).toBe(true);

    expect(isCellAlive(testCellFirst, presets.pikachu, 30)).toBe(true);
    expect(isCellAlive(testCellDead, presets.pikachu, 30)).toBe(true);
    expect(isCellAlive(testCellAlive, presets.pikachu, 30)).toBe(true);
    expect(isCellAlive(testCellPositon, presets.pikachu, 30)).toBe(true);
    expect(
      isCellAlive(testRightButtomCorneCellPositon, presets.pikachu, 30)
    ).toBe(false);
  });
  it("should get the correct neighbours position", () => {
    expect(getNeighboursPosition(testAlfaCell, 30, 30)).toEqual([
      { row: 0, coll: 1 },
      { row: 0, coll: 3 },
      { row: 1, coll: 1 },
      { row: 1, coll: 2 },
      { row: 1, coll: 3 },
    ]);

    expect(getNeighboursPosition(testCellAlive, 30, 30)).toEqual(
      expectedNeighbours
    );
    expect(
      getNeighboursPosition(testRightButtomCorneCellPositon, 30, 30)
    ).toEqual(expectedRightButtomCornerNeighbours);
  });
  it("should get the correct number of live neighbors", () => {
    expect(
      countAliveNeighbours(
        [
          { row: 0, coll: 1 },
          { row: 0, coll: 3 },
          { row: 1, coll: 1 },
          { row: 1, coll: 2 },
          { row: 1, coll: 3 },
        ],
        presets.pikachu,
        30
      )
    ).toBe(4);

    expect(countAliveNeighbours(expectedNeighbours, presets.pikachu, 30)).toBe(
      4
    );
    expect(
      countAliveNeighbours(
        expectedRightButtomCornerNeighbours,
        presets.pikachu,
        30
      )
    ).toBe(0);
  });
  it("should get the cell's correct next generation lifesignal", () => {
    expect(willCellSurvive(testAlfaCell, presets.pikachu, 30, 30)).toBe(false);

    expect(
      willCellSurvive(testRightButtomCorneCellPositon, presets.pikachu, 30, 30)
    ).toBe(false);
  });
});
