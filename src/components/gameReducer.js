export const LEVEL = [
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
    [ 1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,4,2,2,1 ],
    [ 1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1 ],
    [ 1,2,2,2,2,2,2,4,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
    [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ]
  ];
  
  export const COLOR = ["#ccc", "#444", "yellow", "green", "red"];
  
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
  
  export function getInitialState() {
    let level = [], pacman = {position: {x: 0, y: 0}, direction:{x: 0, y: 0}}, ghost = []
    for (let y=0; y<LEVEL.length; y++) {                         
      level[y] = []
      for (let x=0; x<LEVEL[y].length; x++) {
        if ( LEVEL[y][x] === ITEM.Ghost )  
          ghost.push({x, y, isMoving: ghost.length%2===0 })     
        if ( LEVEL[y][x] === ITEM.Pacman ) 
          pacman = {position: {x, y}, direction: {x: -1, y: 0}} 
        if ( LEVEL[y][x] === ITEM.Ghost )                        
          level[y][x] = ITEM.Food                         
        else if ( LEVEL[y][x] === ITEM.Pacman )                   
          level[y][x] = ITEM.Playground 
        else  
          level[y][x] = LEVEL[y][x]                               
      }
    }
    return { status: GAME_STATUS.Running, level, pacman, ghost }
  }
  
  
  export function gameReducer(state, action) {
    switch (action.type) {
      case ACTION.Restart:
        return getInitialState(); 
  
      case ACTION.Move:
        let d = { x: 0, y: 0 };
        if (CONTROL.Left === action.keyCode) d.x--;
        if (CONTROL.Right === action.keyCode) d.x++;
        if (CONTROL.Up === action.keyCode) d.y--;
        if (CONTROL.Down === action.keyCode) d.y++;
        return { ...state, pacman: { ...state.pacman, direction: d } };
  
      case ACTION.TimeTick:
        let isDone = true;
        for (let row of state.level)
          for (let item of row)
            if (item === ITEM.Food) isDone = false;
        if (isDone) return { ...state, status: GAME_STATUS.Done };
  
        // 1. Рух Pacman
        let newPacmanPosition = {
          x: state.pacman.position.x + state.pacman.direction.x,
          y: state.pacman.position.y + state.pacman.direction.y,
        };
  
        // Перевірка на стіну
        if (state.level[newPacmanPosition.y][newPacmanPosition.x] === ITEM.Wall)
          newPacmanPosition = { ...state.pacman.position };
  
        // 2. Рух привидів за допомогою BFS
        let newGhost = state.ghost.map((g) => {
          let nextStep = bfs(state.level, g, newPacmanPosition);
  
          if (nextStep) {
            if (nextStep.x === newPacmanPosition.x && nextStep.y === newPacmanPosition.y) {
              return { ...g, x: nextStep.x, y: nextStep.y };
            }
            return { ...g, x: nextStep.x, y: nextStep.y };
          }
          return g;
        });
  
        // 3. Перевірка на зіткнення з привидом
        if (newGhost.find((g) => g.x === newPacmanPosition.x && g.y === newPacmanPosition.y))
          return { ...state, pacman: { ...state.pacman, position: newPacmanPosition }, status: GAME_STATUS.GameOver };
  
        // 4. Оновлення рівня (видаляємо їжу, якщо Pacman пройшов по ній)
        let newLevel = state.level.map((row) => row.slice());
        newLevel[newPacmanPosition.y][newPacmanPosition.x] = ITEM.Playground;
  
        return { ...state, pacman: { ...state.pacman, position: newPacmanPosition }, level: newLevel, ghost: newGhost };
  
      default:
        return state;
    }
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
  