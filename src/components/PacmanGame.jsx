import { useReducer, useEffect } from 'react';
import { gameReducer, getInitialState, ACTION, GAME_STATUS, SPEED, CONTROL, ITEM, COLOR } from './gameReducer';
import { useInterval } from './useInterval';
import Box from './Box';

export default function PacmanGame() {
  let [state, dispatch] = useReducer(gameReducer, getInitialState());

  useInterval(() => { 
    if (state.status === GAME_STATUS.Running) {
      dispatch({ type: ACTION.TimeTick }); 
    }
  }, state.status === GAME_STATUS.Running ? SPEED : null);

  useEffect(() => {
    function handleGameAction(e) {
      if ([CONTROL.Left, CONTROL.Right, CONTROL.Up, CONTROL.Down].includes(e.keyCode)) {
        e.preventDefault();
        dispatch({ type: ACTION.Move, keyCode: e.keyCode });
      }
    }

    document.addEventListener('keydown', handleGameAction);

    return () => {
      document.removeEventListener('keydown', handleGameAction);
    };
  }, []);

  return (
    <div className="PacmanGame">
      <div>React Pacman. controls: LEFT, RIGHT, UP, DOWN. <br />characters: green=pacman, red=ghost, darkgrey=food, lightgrey=no food, black=wall</div>
      <button onClick={() => dispatch({ type: ACTION.Restart })}>Restart level</button>
      {state.status === GAME_STATUS.GameOver && <h3>Killed, try again!</h3>}
      {state.status === GAME_STATUS.Done && <h3>Level completed!</h3>}
      {[...state.level].map((row, y) => {
        return (
          <div key={y} style={{ display: 'block', lineHeight: 0 }}>
            {row.map((col, x) => (
              <Box
                key={`${y}-${x}`}
                content={state.level[y][x]}
                color={getBoxColor(state, x, y)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function getBoxColor(state, x, y) {
  return COLOR[
    state.pacman.position.x === x && state.pacman.position.y === y
      ? ITEM.Pacman
      : state.ghost.find((g) => g.x === x && g.y === y)
      ? ITEM.Ghost
      : [ITEM.Wall, ITEM.Playground, ITEM.Food].includes(state.level[y][x])
      ? state.level[y][x]
      : null
  ];
}
