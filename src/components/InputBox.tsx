import * as React from 'react';
import {StateContext} from './App';
import {parseCommand} from '../helpers/commands';
import { TaskStatus, stopWorkLogging, TaskItem, createHistoryQueue } from '../helpers/utils';
import { updateElementAccess } from 'typescript';

export const InputBox = props => {
    const inputRef = React.useRef(null);
    const [state, setState] = React.useContext(StateContext);

    const onKeyPress = e => {
    if (inputRef && inputRef.current) {
      const key = e.which || e.keyCode;
      if (!state.sawTheInput) {
        setState({
          ...state,
          sawTheInput: true
        });
      }
      if (key === 13) {
        const cmd = parseCommand(inputRef.current.value);
        let tasksToUpdate = null;
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
              setState({
                ...state,
                showHelp: true
              });
              break;
            case "close-help":
              setState({
                ...state,
                showHelp: false
              });
              break;
            case "today":
              setState({
                ...state,
                showToday: !state.showToday
              });
              break;
            case "dark":
              setState({
                ...state,
                darkMode: true
              });
              break;
            case "light":
              setState({
                ...state,
                darkMode: false
              });
              break;
          }
        }
        let updateCandidate = {
            ...state,
        };
        if (tasksToUpdate) {
            updateCandidate = {
                ...updateCandidate,
                tasks: tasksToUpdate
            };
        }
        // TODO: History when deserialized now become an object without any interface, not a Queue
        const history = state.history || createHistoryQueue();
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
            <input ref={inputRef} className="bg-transparent w-full h-full p-2 px-3 absolute top-0 left-0 z-10" tabIndex={0} autoFocus={true} onKeyPress={onKeyPress} placeholder="enter anything here..." />
            <input className="bg-transparent w-full h-full p-2 px-3 absolute top-0 left-0 z-0 pointer-events-none opacity-25" disabled={true} value={""} />
        </div>
    </div>;
};