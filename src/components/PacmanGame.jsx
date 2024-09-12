import { useReducer, useEffect, useState } from 'react';
import { gameReducer, getInitialState, ACTION, GAME_STATUS, SPEED, CONTROL, ITEM, COLOR, LEVELS } from './gameReducer';
import { useInterval } from './useInterval';
import Box from './Box';

export default function PacmanGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [state, dispatch] = useReducer(gameReducer, getInitialState(levelIndex));

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

  function handleLevelChange(e) {
    const newLevelIndex = parseInt(e.target.value);
    setLevelIndex(newLevelIndex); 
    dispatch({ type: ACTION.ChangeLevel, levelIndex: newLevelIndex });
  }

  return (
    <div className="PacmanGame">
      <div>
        <label>Choose Level: </label>
        <select value={levelIndex} onChange={handleLevelChange}>
          {LEVELS.map((_, index) => (
            <option key={index} value={index}>
              Level {index + 1}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => dispatch({ type: ACTION.Restart })}>Restart level</button>
      {state.status === GAME_STATUS.GameOver && <h3>Killed, try again!</h3>}
      {state.status === GAME_STATUS.Done && (
        <div>
          {state.levelIndex + 1 < LEVELS.length ? (
            <div>
              <h3>Level completed! Proceed to the next level.</h3>
              <button onClick={() => dispatch({ type: ACTION.NextLevel })}>Next Level</button>
            </div>
          ) : (
            <h3>All levels completed! Congratulations!</h3>
          )}
        </div>
      )}

      {[...state.level].map((row, y) => {
        return (
          <div key={y} style={{ display: 'block', lineHeight: 0 }}>
            {row.map((col, x) => (
              <Box key={`${y}-${x}`} content={state.level[y][x]} color={getBoxColor(state, x, y)} />
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
