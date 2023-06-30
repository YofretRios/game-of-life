const ALIVE = "alive";
const DEAD = "dead";

let rows = 50;
let columns = 50;
let lattice = [];
let nextGeneration = [];

let grid = document.getElementById("grid");
let gameCycle = document.getElementById("game-cycle-button");
let gameStart = document.getElementById("game-run");

function createLattice(rows, columns) {
  for (let index = 0; index < rows; index++) {
    lattice[index] = new Array(columns).fill(0);
    nextGeneration[index] = new Array(columns).fill(0);
  }
}

function updateCell(x, y, status) {
  let cell = document.getElementById(`${x}-${y}`);
  if (status === ALIVE) {
    cell.classList.add(status);
  } else {
    cell.classList.remove(ALIVE);
  }
}

function addLivingCell(x, y) {
  lattice[x][y] = 1;
  nextGeneration[x][y] = 1;
  updateCell(x, y, ALIVE);
}

function paintGrid(lattice) {
  for (let x = 0; x < lattice.length; x++) {
    const row = lattice[x];
    for (let y = 0; y < row.length; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `${x}-${y}`;
      cell.addEventListener("click", addLivingCell.bind(this, x, y));

      grid.append(cell);
    }
  }
}

function isValidPosition(i, j, rows, columns) {
  if (i < 0 || j < 0 || i > rows - 1 || j > columns - 1) {
    return false;
  }

  return true;
}

function populationRules(cell, totalAdjacent, x, y) {
  if (cell === 1) {
    if (totalAdjacent < 2 || totalAdjacent > 3) {
      nextGeneration[x][y] = 0;
      updateCell(x, y, DEAD);
    }
  } else if (totalAdjacent === 3) {
    nextGeneration[x][y] = 1;
    console.log("here?");
    updateCell(x, y, ALIVE);
  }
}

function checkAdjacent(x, y, rows, columns) {
  let totalAdjacent = 0;

  totalAdjacent += isValidPosition(x - 1, y - 1, rows, columns)
    ? lattice[x - 1][y - 1]
    : 0;
  totalAdjacent += isValidPosition(x, y - 1, rows, columns)
    ? lattice[x][y - 1]
    : 0;
  totalAdjacent += isValidPosition(x + 1, y - 1, rows, columns)
    ? lattice[x + 1][y - 1]
    : 0;
  totalAdjacent += isValidPosition(x - 1, y, rows, columns)
    ? lattice[x - 1][y]
    : 0;
  totalAdjacent += isValidPosition(x + 1, y, rows, columns)
    ? lattice[x + 1][y]
    : 0;
  totalAdjacent += isValidPosition(x - 1, y + 1, rows, columns)
    ? lattice[x - 1][y + 1]
    : 0;
  totalAdjacent += isValidPosition(x, y + 1, rows, columns)
    ? lattice[x][y + 1]
    : 0;
  totalAdjacent += isValidPosition(x + 1, y + 1, rows, columns)
    ? lattice[x + 1][y + 1]
    : 0;

  return totalAdjacent;
}

function copyNextGeneration() {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      lattice[x][y] = nextGeneration[x][y];
    }
  }
}

function updateGeneration(rows, columns) {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      const totalAdjacent = checkAdjacent(x, y, rows, columns);
      populationRules(lattice[x][y], totalAdjacent, x, y);
    }
  }

  copyNextGeneration();
}

function runGame() {
  const id = setInterval(updateGeneration.bind(this, rows, columns), 100);
}

createLattice(rows, columns);
paintGrid(lattice);

gameCycle.addEventListener("click", updateGeneration.bind(this, rows, columns));
gameStart.addEventListener("click", runGame);
