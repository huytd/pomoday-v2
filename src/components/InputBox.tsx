import * as React from 'react';
import { StateContext } from './App';
import { parseCommand } from '../helpers/commands';
import {
  TaskStatus,
  stopWorkLogging,
  TaskItem,
  getHistoryQueue,
  MAX_COMMAND_QUEUE_LENGTH,
  findCommon,
  KEY_TAB,
  KEY_RIGHT,
  KEY_F,
  KEY_UP,
  KEY_P,
  KEY_DOWN,
  KEY_N,
  KEY_RETURN,
  KEY_INPUT,
  KEY_ESC,
} from '../helpers/utils';
import Queue from '../helpers/queue';

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
              tasksToUpdate = state.tasks.map(t => {
                if (ids.indexOf(t.id) !== -1) {
                  t.tag = cmd.tag;
                }
                return t;
              });
              break;
            case 'b':
            case 'begin':
              tasksToUpdate = state.tasks.map(t => {
                if (ids.indexOf(t.id) !== -1) {
                  if (t.status !== TaskStatus.WIP) {
                    t.status = TaskStatus.WIP;
                    t.logs = (t.logs || []).concat({
                      start: Date.now(),
                      end: 0,
                    });
                  }
                }
                return t;
              });
              break;
            case 'c':
            case 'check':
              tasksToUpdate = state.tasks.map(t => {
                if (ids.indexOf(t.id) !== -1) {
                  t.status =
                    t.status === TaskStatus.DONE
                      ? TaskStatus.WAIT
                      : TaskStatus.DONE;
                  if (t.status === TaskStatus.DONE) {
                    t = stopWorkLogging(t);
                  }
                }
                return t;
              });
              break;
            case 'd':
            case 'delete':
              if (!ids.length) {
                // Delete by tag
                const tag = (cmd.id.match(/^(@.*)/) || []).pop();
                if (tag) {
                  tasksToUpdate = state.tasks.reduce((tasks, t: TaskItem) => {
                    if (t.tag !== tag) {
                      tasks.push(t);
                    }
                    return tasks;
                  }, []);
                }
                // Delete by status
                const status = (
                  cmd.id.match(
                    /^(finished|done|flag|flagged|ongoing|wip|wait|pending)/,
                  ) || []
                ).pop();
                if (status) {
                  let taskStatus = null;
                  switch (status) {
                    case 'finished':
                    case 'done':
                      taskStatus = TaskStatus.DONE;
                      break;
                    case 'flag':
                    case 'flagged':
                      taskStatus = TaskStatus.FLAG;
                      break;
                    case 'ongoing':
                    case 'wip':
                      taskStatus = TaskStatus.WIP;
                      break;
                    case 'wait':
                    case 'pending':
                      taskStatus = TaskStatus.WAIT;
                      break;
                  }
                  tasksToUpdate = state.tasks.reduce((tasks, t: TaskItem) => {
                    if (taskStatus) {
                      if (t.status !== taskStatus) {
                        tasks.push(t);
                      }
                    }
                    return tasks;
                  }, []);
                }
              } else {
                // Delete by id
                tasksToUpdate = state.tasks.reduce((tasks, t) => {
                  if (ids.indexOf(t.id) === -1) {
                    tasks.push(t);
                  }
                  return tasks;
                }, []);
              }
              break;
            case 'fl':
            case 'flag':
              tasksToUpdate = state.tasks.map(t => {
                if (ids.indexOf(t.id) !== -1) {
                  t.status =
                    t.status === TaskStatus.FLAG
                      ? TaskStatus.WAIT
                      : TaskStatus.FLAG;
                  t = stopWorkLogging(t);
                }
                return t;
              });
              break;
            case 'st':
            case 'stop':
              tasksToUpdate = state.tasks.map(t => {
                if (ids.indexOf(t.id) !== -1) {
                  if (t.status === TaskStatus.WIP) {
                    t.status = TaskStatus.WAIT;
                    t = stopWorkLogging(t);
                  }
                }
                return t;
              });
              break;
            case 'a':
            case 'archive':
              tasksToUpdate = state.tasks.map(t => {
                if (ids.indexOf(t.id) !== -1) {
                  if (!t.archived) {
                    t.archived = true;
                  } else {
                    t.archived = false;
                  }
                }
                return t;
              });
              break;
            case 't':
            case 'task':
              const tag = cmd.tag || '@uncategorized';
              const task = cmd.text;
              if (task && task.length) {
                const nextId = state.tasks.reduce(
                  (maxId: number, t: TaskItem) => {
                    if (t.id > maxId) {
                      maxId = t.id;
                    }
                    return maxId;
                  },
                  0,
                );
                tasksToUpdate = state.tasks.concat({
                  id: nextId + 1,
                  tag: tag,
                  title: task,
                  status: TaskStatus.WAIT,
                } as TaskItem);
              }
              break;
            case 'e':
            case 'edit':
              {
                const id = ids[0];
                const task = cmd.text;
                if (task && task.length) {
                  tasksToUpdate = state.tasks.map(t => {
                    if (t.id === id) {
                      t.title = task;
                    }
                    return t;
                  });
                }
              }
              break;
            case 'tr':
            case 'tagre':
            case 'tagrename':
              {
                const [from, to] = cmd.tag.split(' ');
                tasksToUpdate = state.tasks.map(t => {
                  if (t.tag.match(from)) {
                    t.tag = to;
                  }
                  return t;
                });
              }
              break;
            /* Visibility */
            case 'hide':
              switch (cmd.text) {
                case 'finished':
                case 'done':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      done: false,
                    },
                  };
                  break;
                case 'flag':
                case 'flagged':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      flagged: false,
                    },
                  };
                  break;
                case 'ongoing':
                case 'wip':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      wip: false,
                    },
                  };
                  break;
                case 'pending':
                case 'wait':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      wait: false,
                    },
                  };
                  break;
              }
              break;
            case 'show':
              switch (cmd.text) {
                case 'finished':
                case 'done':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      done: true,
                    },
                  };
                  break;
                case 'flag':
                case 'flagged':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      flagged: true,
                    },
                  };
                  break;
                case 'wip':
                case 'ongoing':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      wip: true,
                    },
                  };
                  break;
                case 'pending':
                case 'wait':
                  updateCandidate = {
                    ...updateCandidate,
                    taskVisibility: {
                      ...updateCandidate.taskVisibility,
                      wait: true,
                    },
                  };
                  break;
              }
              break;
            /* Single command */
            case 'help':
              updateCandidate = {
                ...updateCandidate,
                showHelp: true,
              };
              break;
            case 'close-help':
              updateCandidate = {
                ...updateCandidate,
                showHelp: false,
              };
              break;
            case 'today':
              updateCandidate = {
                ...updateCandidate,
                showToday: !state.showToday,
              };
              break;
            case 'dark':
              updateCandidate = {
                ...updateCandidate,
                darkMode: true,
              };
              break;
            case 'light':
              updateCandidate = {
                ...updateCandidate,
                darkMode: false,
              };
              break;
            case 'customize':
              updateCandidate = {
                ...updateCandidate,
                showCustomCSS: !updateCandidate.showCustomCSS,
              };
              break;
            case 'list-archived':
              updateCandidate = {
                ...updateCandidate,
                showArchived: !updateCandidate.showArchived,
              };
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

  React.useEffect(() => {
    document.addEventListener('keyup', focusInput, false);

    return () => {
      document.removeEventListener('keyup', focusInput, false);
    };
  }, []);

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
