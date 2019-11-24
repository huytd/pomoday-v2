import * as React from 'react';
import { StateContext } from './App';
import {
  findCommon,
  getHistoryQueue,
  KEY_DOWN,
  KEY_ESC,
  KEY_F,
  KEY_INPUT,
  KEY_N,
  KEY_P,
  KEY_RETURN,
  KEY_RIGHT,
  KEY_TAB,
  KEY_UP,
  MAX_COMMAND_QUEUE_LENGTH,
} from '../helpers/utils';
import Queue from '../helpers/queue';
import { parseCommand } from '../helpers/commands/parser';
import {
  archiveCommand,
  beginCommand,
  checkCommand,
  deleteCommand,
  editTaskCommand,
  flagCommand,
  hideCommand,
  insertTaskCommand,
  moveCommand,
  otherCommand,
  restoreCommand,
  showCommand,
  stopCommand,
  tagRenameCommand,
} from '../helpers/commands/actions';
import { useEventListener } from '../helpers/hooks';

export const InputBox = props => {
  const inputRef = React.useRef(null);
  const suggestRef = React.useRef(null);
  const [state, setState] = React.useContext(StateContext);
  let historyIndex = -1;
  const history: Queue<string> = getHistoryQueue(state.history);
  let suggestion = '';

  const processInput = e => {
    if (suggestRef && suggestRef.current) {
      const value = inputRef.current.value;
      if (value) {
        const matched = history.match(i => i.indexOf(value) === 0);
        suggestion = findCommon(matched);
        if (suggestion) {
          suggestRef.current.value = suggestion;
        } else {
          suggestRef.current.value = '';
        }
      } else {
        suggestRef.current.value = '';
      }
    }
  };

  const onKeyDown = e => {
    if (inputRef && inputRef.current) {
      if (!state.sawTheInput) {
        setState({
          ...state,
          sawTheInput: true,
        });
      }
      const key = e.which || e.keyCode;
      const meta = e.ctrlKey || e.metaKey;
      // TAB or RIGHT or Ctrl + F to pickup the suggestion
      if (key === KEY_TAB || key === KEY_RIGHT || (meta && key == KEY_F)) {
        if (suggestion) {
          inputRef.current.value = suggestion;
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      }
      // UP KEY
      else if (key === KEY_UP || (meta && key === KEY_P)) {
        if (historyIndex < MAX_COMMAND_QUEUE_LENGTH - 1) {
          historyIndex++;
          const historyValue = history.peek(historyIndex);
          if (historyValue) {
            inputRef.current.value = historyValue;
          }
        }
      }
      // DOWN KEY
      else if (key === KEY_DOWN || (meta && key === KEY_N)) {
        if (historyIndex > 0) {
          historyIndex--;
          const historyValue = history.peek(historyIndex);
          if (historyValue) {
            inputRef.current.value = historyValue;
          }
        }
      }
      // ENTER KEY
      else if (key === KEY_RETURN) {
        const cmd = parseCommand(inputRef.current.value);
        let tasksToUpdate = null;
        let updateCandidate = {
          ...state,
        };
        if (cmd) {
          const ids = cmd.id
            ? (cmd.id.match(/\d+/g) || []).map(s => parseInt(s))
            : null;
          switch (cmd.command.toLowerCase()) {
            case 'mv':
            case 'move':
              tasksToUpdate = moveCommand(tasksToUpdate, state, ids, cmd);
              break;
            case 'b':
            case 'begin':
              tasksToUpdate = beginCommand(tasksToUpdate, state, ids);
              break;
            case 'c':
            case 'check':
              tasksToUpdate = checkCommand(tasksToUpdate, state, ids);
              break;
            case 'd':
            case 'delete':
              tasksToUpdate = deleteCommand(tasksToUpdate, ids, cmd, state);
              break;
            case 'fl':
            case 'flag':
              tasksToUpdate = flagCommand(tasksToUpdate, state, ids);
              break;
            case 'st':
            case 'stop':
              tasksToUpdate = stopCommand(tasksToUpdate, state, ids);
              break;
            case 'a':
            case 'archive':
              tasksToUpdate = archiveCommand(ids, cmd, tasksToUpdate, state);
              break;
            case 're':
            case 'restore':
              tasksToUpdate = restoreCommand(ids, cmd, tasksToUpdate, state);
              break;
            case 't':
            case 'task':
              tasksToUpdate = insertTaskCommand(cmd, state, tasksToUpdate);
              break;
            case 'e':
            case 'edit':
              tasksToUpdate = editTaskCommand(ids, cmd, tasksToUpdate, state);
              break;
            case 'tr':
            case 'tagre':
            case 'tagrename':
              tasksToUpdate = tagRenameCommand(cmd, tasksToUpdate, state);
              break;
            /* Visibility */
            case 'hide':
              updateCandidate = hideCommand(updateCandidate, cmd);
              break;
            case 'show':
              updateCandidate = showCommand(updateCandidate, cmd);
              break;
            /* Single command */
            default:
              updateCandidate = otherCommand(updateCandidate, cmd, state);
              break;
          }
        }
        if (tasksToUpdate) {
          updateCandidate = {
            ...updateCandidate,
            tasks: tasksToUpdate,
          };
        }
        setState({
          ...updateCandidate,
          history: history.push(inputRef.current.value),
        });
        inputRef.current.value = '';
      }
    }
  };

  const focusInput = event => {
    if (state.showHelp || state.showQuickHelp) {
      event.preventDefault();
    }
    const inputIsFocused = inputRef.current === document.activeElement;
    const activeIsEditor =
      document.activeElement.tagName.match(/input|textarea/i) !== null;
    if (event.keyCode === KEY_INPUT && !inputIsFocused && !activeIsEditor) {
      inputRef.current.focus();
    }
    if (event.keyCode === KEY_ESC && inputIsFocused) {
      inputRef.current.blur();
    }
  };

  useEventListener('keyup', focusInput);

  return (
    <div className="el-editor bg-control w-full h-10 text-sm fixed bottom-0 left-0">
      <div className="w-full h-full relative h-8">
        {state.sawTheInput ? null : (
          <div className="absolute bottom-0 left-0 ml-2 mb-8 z-50 flex flex-row bg-orange pulse w-4 h-4 rounded-full shadow-xl"></div>
        )}
        <input
          ref={inputRef}
          className="bg-transparent w-full h-full p-2 px-3 absolute top-0 left-0 z-10 border-l-4 border-transparent focus:border-green focus:bg-focus"
          tabIndex={0}
          autoFocus={true}
          disabled={
            (state.userWantToLogin && !state.authToken) ||
            state.showHelp ||
            state.showQuickHelp
          }
          onKeyPress={processInput}
          onKeyUp={processInput}
          onKeyDown={onKeyDown}
          placeholder="Press 'i' or 'Tab' to start typing..."
        />
        <input
          ref={suggestRef}
          className="bg-transparent border-l-4 border-transparent w-full h-full p-2 px-3 absolute top-0 left-0 z-0 pointer-events-none opacity-25"
          disabled={true}
          value={''}
        />
      </div>
    </div>
  );
};
