export const LEVELS = [

    [
      [1,1,1,1,1,1,1,1,1],
      [1,3,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,1,2,1],
      [1,2,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1]
    ],
    
    [
      [1,1,1,1,1,1,1,1,1,1,1],
      [1,3,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,1,1,1,2,1],
      [1,2,1,2,2,2,1,2,2,2,1],
      [1,2,1,2,1,2,1,2,1,2,1],
      [1,2,1,2,1,2,2,2,2,2,1],
      [1,2,1,2,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1]
    ],
    
    [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,2,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,1,1,1,1,2,1],
      [1,2,1,2,2,2,1,2,2,2,2,1],
      [1,2,1,2,1,2,1,2,1,2,1,1],
      [1,2,2,2,2,2,2,2,2,2,4,1],
      [1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
        [ 1,3,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
        [ 1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,4,1,1,1,2,1 ],
        [ 1,2,2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
        [ 1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,2,1,2,1,2,1 ],
        [ 1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1 ],
        [ 1,2,1,1,2,1,2,1,1,1,2,1,1,1,2,1,1,2,1,2,1 ],
        [ 1,2,1,1,2,1,2,1,2,2,2,2,2,1,2,2,2,2,2,2,1 ],
        [ 1,2,1,1,2,2,2,1,2,2,4,2,2,1,2,1,1,1,1,2,1 ],
        [ 1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,1,1,1,2,1 ],
        [ 1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1 ],
        [ 1,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1,1 ],
        [ 1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1 ],
        [ 1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1 ],
        [ 1,2,2,2,2,2,2,4,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
        [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ]
    ],
    [
      [1,1,1,1,1,1,1],
      [1,4,2,2,2,4,1],
      [1,2,1,2,1,2,1],
      [1,2,2,3,2,2,1],
      [1,2,1,2,1,2,1],
      [1,4,2,2,2,4,1],
      [1,1,1,1,1,1,1],
    ]
   
  ];
  
  
  export const COLOR = ["#ccc", "black", "yellow", "green", "red"];
  
  export const GAME_STATUS = {
    Running: "RUNNING",
    GameOver: "GAMEOVER",
    Done: "DONE",
  };
  
  export const ACTION = {
    Restart: "RESTART",
    Move: "MOVE",
    TimeTick: "TIMETICK",
  };
  
  export const ITEM = {
    Playground: 0,
    Wall: 1,
    Food: 2,
    Pacman: 3,
    Ghost: 4,
  };
  
  export const SPEED = 200; // [ms]
  export const CONTROL = {
    Left: 37,
    Right: 39,
    Up: 38,
    Down: 40,
  };
  
  export function getInitialState(levelIndex = 0) {
    const LEVEL = LEVELS[levelIndex]; 
    let level = [], pacman = {position: {x: 0, y: 0}, direction:{x: 0, y: 0}}, ghost = [];
  
    for (let y = 0; y < LEVEL.length; y++) {
      level[y] = [];
      for (let x = 0; x < LEVEL[y].length; x++) {
        if (LEVEL[y][x] === ITEM.Ghost)
          ghost.push({ x, y, isMoving: ghost.length % 2 === 0 });
        if (LEVEL[y][x] === ITEM.Pacman)
          pacman = { position: { x, y }, direction: { x: -1, y: 0 } };
        if (LEVEL[y][x] === ITEM.Ghost)
          level[y][x] = ITEM.Food;
        else if (LEVEL[y][x] === ITEM.Pacman)
          level[y][x] = ITEM.Playground;
        else
          level[y][x] = LEVEL[y][x];
      }
    }
  
    return { status: GAME_STATUS.Running, level, pacman, ghost, tickCounter: 0, levelIndex };
  }
  
  export function gameReducer(state, action) {
    switch (action.type) {
      case ACTION.Restart: {
        return getInitialState(state.levelIndex);
      }
  
      case ACTION.ChangeLevel: {
        return getInitialState(action.levelIndex);
      }
  
      case ACTION.NextLevel: {
        const nextLevelIndex = state.levelIndex + 1;
        if (nextLevelIndex < LEVELS.length) {
          return getInitialState(nextLevelIndex);
        } else {
          return { ...state, status: GAME_STATUS.Done };
        }
      }
  
      case ACTION.Move: {
        let d = { x: 0, y: 0 };
        if (CONTROL.Left === action.keyCode) d.x--;
        if (CONTROL.Right === action.keyCode) d.x++;
        if (CONTROL.Up === action.keyCode) d.y--;
        if (CONTROL.Down === action.keyCode) d.y++;
        return { ...state, pacman: { ...state.pacman, direction: d } };
      }
  
      case ACTION.TimeTick: {
        let isDone = true;
        for (let row of state.level)
          for (let item of row)
            if (item === ITEM.Food) isDone = false;
        if (isDone) {
          return { ...state, status: GAME_STATUS.Done };
        }
  
        let newPacmanPosition = {
          x: state.pacman.position.x + state.pacman.direction.x,
          y: state.pacman.position.y + state.pacman.direction.y,
        };
  
        if (state.level[newPacmanPosition.y][newPacmanPosition.x] === ITEM.Wall)
          newPacmanPosition = { ...state.pacman.position };
  
        let newLevel = state.level.map((row) => row.slice());
        newLevel[newPacmanPosition.y][newPacmanPosition.x] = ITEM.Playground;
  
        let targetPositions = getSurroundingPositions(newPacmanPosition, state.level);
        let newGhost = state.ghost.map((g, index) => {
      
          let target = targetPositions[index % targetPositions.length];
  
          if (g.x === target.x && g.y === target.y) {
            return g; 
          }
  
          let nextStep = bfs(state.level, g, target);
          if (nextStep) {
            return { ...g, x: nextStep.x, y: nextStep.y };
          }
          return g;
        });
  
        return {
          ...state,
          pacman: { ...state.pacman, position: newPacmanPosition },
          level: newLevel,
          ghost: newGhost,
          tickCounter: state.tickCounter + 1,
        };
      }
  
      default:
        return state;
    }
  }
  
  function getSurroundingPositions(pacmanPosition, level) {
    const positions = [];
  
    if (pacmanPosition.x + 1 < level[0].length && level[pacmanPosition.y][pacmanPosition.x + 1] !== ITEM.Wall) {
      positions.push({ x: pacmanPosition.x + 1, y: pacmanPosition.y });
    }

    if (pacmanPosition.x - 1 >= 0 && level[pacmanPosition.y][pacmanPosition.x - 1] !== ITEM.Wall) {
      positions.push({ x: pacmanPosition.x - 1, y: pacmanPosition.y });
    }
  
    if (pacmanPosition.y + 1 < level.length && level[pacmanPosition.y + 1][pacmanPosition.x] !== ITEM.Wall) {
      positions.push({ x: pacmanPosition.x, y: pacmanPosition.y + 1 });
    }
  
    if (pacmanPosition.y - 1 >= 0 && level[pacmanPosition.y - 1][pacmanPosition.x] !== ITEM.Wall) {
      positions.push({ x: pacmanPosition.x, y: pacmanPosition.y - 1 });
    }
  
    return positions;
  }
  
  
  
  

  function bfs(level, start, target) {
    const queue = [];
    const visited = new Set();
    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];
  
    queue.push({ x: start.x, y: start.y, path: [] });
    visited.add(`${start.x},${start.y}`);
  
    while (queue.length > 0) {
      const current = queue.shift();
      if (current.x === target.x && current.y === target.y) {
        return current.path[0];
      }
  
      for (let dir of directions) {
        const nextX = current.x + dir.x;
        const nextY = current.y + dir.y;
  
        if (
          nextY >= 0 &&
          nextY < level.length &&
          nextX >= 0 &&
          nextX < level[0].length &&
          level[nextY][nextX] !== ITEM.Wall &&
          !visited.has(`${nextX},${nextY}`)
        ) {
          visited.add(`${nextX},${nextY}`);
          queue.push({
            x: nextX,
            y: nextY,
            path: [...current.path, { x: nextX, y: nextY }],
          });
        }
      }
    }
    
    return null;
  }
  