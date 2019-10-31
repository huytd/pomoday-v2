import * as React from 'react';
import {StateContext} from './App';
import {parseCommand} from '../helpers/commands';
import { TaskStatus, stopWorkLogging, TaskItem, getHistoryQueue, MAX_COMMAND_QUEUE_LENGTH } from '../helpers/utils';
import Queue from '../helpers/queue';

const KEY_RETURN = 13;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_P = 80;
const KEY_N = 78;

export const InputBox = props => {
    const inputRef = React.useRef(null);
    const [state, setState] = React.useContext(StateContext);
    let historyIndex = -1;
    const history: Queue<string> = getHistoryQueue(state.history);

    const onKeyDown = e => {
      if (inputRef && inputRef.current) {
        const key = e.which || e.keyCode;
        const meta = e.ctrlKey || e.metaKey;
        // UP KEY
        if (key === KEY_UP || (meta && key === KEY_P)) {
          if (historyIndex < MAX_COMMAND_QUEUE_LENGTH - 1) {
            historyIndex++;
            const historyValue = history.peek(historyIndex);
            if (historyValue) {
              inputRef.current.value = historyValue;
            }
          }
        }
        // DOWN KEY
        if (key === KEY_DOWN || (meta && key === KEY_N)) {
          if (historyIndex > 0) {
            historyIndex--;
            const historyValue = history.peek(historyIndex);
            if (historyValue) {
              inputRef.current.value = historyValue;
            }
          }
        }
      }
    };

    const onKeyPress = e => {
      if (inputRef && inputRef.current) {
        const key = e.which || e.keyCode;
        if (!state.sawTheInput) {
          setState({
            ...state,
            sawTheInput: true
          });
        }
        // ENTER KEY
        if (key === KEY_RETURN) {
          const cmd = parseCommand(inputRef.current.value);
          let tasksToUpdate = null;
          let updateCandidate = {
              ...state,
            };
          if (cmd) {
            switch (cmd.command.toLowerCase()) {
              case "mv":
              case "move":
                tasksToUpdate = state.tasks.map(t => {
                  if (t.id === cmd.id) {
                    t.tag = cmd.tag;
                  }
                  return t;
                });
                break;
              case "b":
              case "begin":
                tasksToUpdate = state.tasks.map(t => {
                  if (t.id === cmd.id) {
                    if (t.status !== TaskStatus.WIP) {
                      t.status = TaskStatus.WIP;
                      t.logs = (t.logs || []).concat({ start: Date.now(), end: 0 });
                    }
                  }
                  return t;
                });
                break;
              case "c":
              case "check":
                tasksToUpdate = state.tasks.map(t => {
                  if (t.id === cmd.id) {
                    t.status = t.status === TaskStatus.DONE ? TaskStatus.WAIT : TaskStatus.DONE;
                    if (t.status === TaskStatus.DONE) {
                      t = stopWorkLogging(t);
                    }
                  }
                  return t;
                });
                break;
              case "d":
              case "delete":
                tasksToUpdate = state.tasks.reduce((tasks, t) => {
                  if (t.id !== cmd.id) {
                    tasks.push(t);
                  }
                  return tasks;
                }, []);
                break;
              case "fl":
              case "flag":
                tasksToUpdate = state.tasks.map(t => {
                  if (t.id === cmd.id) {
                    t.status = t.status === TaskStatus.FLAG ? TaskStatus.WAIT : TaskStatus.FLAG;
                    t = stopWorkLogging(t);
                  }
                  return t;
                });
                break;
              case "st":
              case "stop":
                tasksToUpdate = state.tasks.map(t => {
                  if (t.id === cmd.id) {
                    if (t.status === TaskStatus.WIP) {
                      t.status = TaskStatus.WAIT;
                      t = stopWorkLogging(t);
                    }
                  }
                  return t;
                });
                break;
              case "t":
              case "task":
                const tag = cmd.tag || "@uncategorized";
                const task = cmd.text;
                if (task && task.length) {
                  const nextId = state.tasks.reduce((maxId: number, t: TaskItem) => {
                    if (t.id > maxId) {
                      maxId = t.id;
                    }
                    return maxId;
                  }, 0);
                  tasksToUpdate = state.tasks.concat({
                    id: nextId + 1,
                    tag: tag,
                    title: task,
                    status: TaskStatus.WAIT
                  } as TaskItem);
                }
                break;
              case "e":
              case "edit": {
                const id = cmd.id;
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
              case "help":
                updateCandidate = {
                  ...updateCandidate,
                  showHelp: true
                };
                break;
              case "close-help":
                updateCandidate = {
                  ...updateCandidate,
                  showHelp: false
                };
                break;
              case "today":
                updateCandidate = {
                  ...updateCandidate,
                  showToday: !state.showToday
                };
                break;
              case "dark":
                updateCandidate = {
                  ...updateCandidate,
                  darkMode: true
                };
                break;
              case "light":
                updateCandidate = {
                  ...updateCandidate,
                  darkMode: false
                };
                break;
            }
          }
          if (tasksToUpdate) {
            updateCandidate = {
              ...updateCandidate,
              tasks: tasksToUpdate
            };
          }
          setState({
            ...updateCandidate,
            history: history.push(inputRef.current.value)
          });
          inputRef.current.value = "";
        }
      }
    };

    return <div className="bg-control w-full h-10 text-sm fixed bottom-0 left-0">
        <div className="w-full h-full relative h-8">
            <input ref={inputRef} className="bg-transparent w-full h-full p-2 px-3 absolute top-0 left-0 z-10" tabIndex={0} autoFocus={true} onKeyPress={onKeyPress} onKeyDown={onKeyDown} placeholder="Enter your command here. Press UP/DOWN for the previous commands." />
            <input className="bg-transparent w-full h-full p-2 px-3 absolute top-0 left-0 z-0 pointer-events-none opacity-25" disabled={true} value={""} />
        </div>
    </div>;
};
