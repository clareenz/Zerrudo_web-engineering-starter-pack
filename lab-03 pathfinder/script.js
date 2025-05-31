// Constants and Configuration
const GRID_CONFIG = {
  rows: 10,
  cols: 10,
  speeds: {
    slow: 500,
    medium: 200,
    fast: 50
  },
  defaultWeight: 5
};

// State Management
let state = {
  grid: [],
  startNode: null,
  endNode: null,
  isRunning: false,
  isWeightMode: false
};

class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.isWall = false;
    this.isVisited = false;
    this.distance = Infinity;
    this.weight = 1;
    this.previous = null;
    // A* specific properties
    this.f = Infinity;
    this.g = Infinity;
    this.h = 0;
  }

  reset() {
    this.isWall = false;
    this.isVisited = false;
    this.distance = Infinity;
    this.weight = 1;
    this.previous = null;
    this.f = Infinity;
    this.g = Infinity;
    this.h = 0;
  }
}

// Grid Creation and Management
function createGrid() {
  const container = document.getElementById('grid-container');
  const rows = parseInt(document.getElementById('gridRows').value) || GRID_CONFIG.rows;
  const cols = parseInt(document.getElementById('gridCols').value) || GRID_CONFIG.cols;
  
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cols}, 35px)`;
  state.grid = [];

  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      const node = new Node(row, col);
      const cell = createCell(node, row, col);
      container.appendChild(cell);
      rowArray.push({ node, cell });
    }
    state.grid.push(rowArray);
  }
}

function createCell(node, row, col) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.addEventListener('click', () => handleCellClick(node, cell));
  return cell;
}

function handleCellClick(node, cell) {
  if (state.isRunning) return;

  if (state.isWeightMode) {
    if (!node.isWall && node !== state.startNode && node !== state.endNode) {
      const weightValue = parseInt(document.getElementById('weightValue').value);
      node.weight = node.weight === 1 ? weightValue : 1;
      cell.classList.toggle('weighted');
      cell.textContent = node.weight === 1 ? '' : node.weight;
    }
  } else if (!state.startNode) {
    state.startNode = node;
    cell.classList.add('start');
  } else if (!state.endNode && node !== state.startNode) {
    state.endNode = node;
    cell.classList.add('end');
  } else if (node !== state.startNode && node !== state.endNode) {
    node.isWall = !node.isWall;
    cell.classList.toggle('wall');
    if (node.isWall) {
      node.weight = 1;
      cell.classList.remove('weighted');
      cell.textContent = '';
    }
  }
}

function resetGrid() {
  if (state.isRunning) return;

  for (let row of state.grid) {
    for (let { node, cell } of row) {
      node.reset();
      cell.className = 'cell';
      cell.textContent = '';
    }
  }
  state.startNode = null;
  state.endNode = null;
  state.isRunning = false;
}

function updateGridSize() {
  if (state.isRunning) return;
  createGrid();
}

// Pathfinding Algorithms
async function startAlgorithm() {
  if (state.isRunning) return;
  if (!state.startNode || !state.endNode) {
    alert('Please set both start and end points first!');
    return;
  }

  state.isRunning = true;
  const algorithm = document.getElementById('algorithmSelect').value;
  
  try {
    if (algorithm === 'astar') {
      await astar();
    } else {
      await dijkstra();
    }
  } catch (error) {
    alert(error.message);
  } finally {
    state.isRunning = false;
  }
}

async function dijkstra() {
  const unvisited = [];
  state.startNode.distance = 0;

  for (let row of state.grid) {
    for (let { node } of row) unvisited.push(node);
  }

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift();

    if (closest.isWall) continue;
    if (closest.distance === Infinity) {
      throw new Error('No path found!');
    }

    closest.isVisited = true;
    updateCell(closest, 'visited');

    if (closest === state.endNode) {
      await tracePath();
      return;
    }

    const neighbors = getNeighbors(closest);
    for (let neighbor of neighbors) {
      const alt = closest.distance + neighbor.weight;
      if (alt < neighbor.distance) {
        neighbor.distance = alt;
        neighbor.previous = closest;
      }
    }

    await sleep(getSpeed());
  }
}

async function astar() {
  const openSet = [state.startNode];
  const closedSet = new Set();

  state.startNode.g = 0;
  state.startNode.f = heuristic(state.startNode, state.endNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    if (current.isWall) continue;
    if (current === state.endNode) {
      await tracePath();
      return;
    }

    closedSet.add(current);
    current.isVisited = true;
    updateCell(current, 'visited');

    const neighbors = getNeighbors(current);
    for (let neighbor of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = current.g + neighbor.weight;

      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }

      neighbor.previous = current;
      neighbor.g = tentativeG;
      neighbor.h = heuristic(neighbor, state.endNode);
      neighbor.f = neighbor.g + neighbor.h;
    }

    await sleep(getSpeed());
  }

  throw new Error('No path found!');
}

function heuristic(node, goal) {
  // Manhattan distance
  return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
}

function getNeighbors(node) {
  const { row, col } = node;
  const neighbors = [];

  // Cardinal directions (up, right, down, left)
  const directions = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
  ];

  for (let [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;

    if (isValidPosition(newRow, newCol)) {
      neighbors.push(state.grid[newRow][newCol].node);
    }
  }

  return neighbors.filter(n => !n.isWall);
}

function isValidPosition(row, col) {
  return row >= 0 && row < state.grid.length && 
         col >= 0 && col < state.grid[0].length;
}

async function tracePath() {
  let current = state.endNode;
  while (current.previous) {
    updateCell(current, 'path');
    current = current.previous;
    await sleep(50);
  }
}

// Utility Functions
function updateCell(node, className) {
  const { row, col } = node;
  const cell = state.grid[row][col].cell;
  if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
    cell.classList.add(className);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getSpeed() {
  const speed = document.getElementById('speedControl').value;
  return GRID_CONFIG.speeds[speed];
}

// Event Listeners
document.getElementById('toggleWeight').addEventListener('click', function() {
  state.isWeightMode = !state.isWeightMode;
  this.classList.toggle('active');
});

document.getElementById('gridRows').addEventListener('input', function() {
  if (!state.isRunning) createGrid();
});

document.getElementById('gridCols').addEventListener('input', function() {
  if (!state.isRunning) createGrid();
});

// Initialize the grid
createGrid();
