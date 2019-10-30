import * as React from 'react';
import {Row} from './Row';
import {Today} from './Today';
import {TaskItem, TaskStatus, stopWorkLogging, RowType} from '../helpers/utils';
import {parseCommand} from '../helpers/commands';

export const StateContext = React.createContext<any>(null);

const getInitialState = () => {
  if (window.localStorage) {
    const saved = window.localStorage.getItem('pomoday');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          return parsed;
        }
      } catch {}
    }
  }
  return {
    tasks: [] as TaskItem[],
    showHelp: true,
    showToday: false,
    darkMode: false,
    sawTheInput: false
  };
};

export const App = () => {
  const inputRef = React.useRef(null);
  const [ state, setState ] = React.useState(getInitialState());

  React.useEffect(() => {
    window.localStorage.setItem('pomoday', JSON.stringify(state));
  }, [state]);

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
        if (cmd) {
          switch (cmd.command.toLowerCase()) {
            case "mv":
            case "move":
              const mupdated = state.tasks.map(t => {
                if (t.id === cmd.id) {
                  t.tag = cmd.tag;
                }
                return t;
              });
              setState({
                ...state,
                tasks: mupdated
              });
              break;
            case "b":
            case "begin":
              const bupdated = state.tasks.map(t => {
                if (t.id === cmd.id) {
                  if (t.status !== TaskStatus.WIP) {
                    t.status = TaskStatus.WIP;
                    t.logs = (t.logs || []).concat({ start: Date.now(), end: 0 });
                  }
                }
                return t;
              });
              setState({
                ...state,
                tasks: bupdated
              });
              break;
            case "c":
            case "check":
              const cupdated = state.tasks.map(t => {
                if (t.id === cmd.id) {
                  t.status = t.status === TaskStatus.DONE ? TaskStatus.WAIT : TaskStatus.DONE;
                  if (t.status === TaskStatus.DONE) {
                    t = stopWorkLogging(t);
                  }
                }
                return t;
              });
              setState({
                ...state,
                tasks: cupdated
              });
              break;
            case "d":
            case "delete":
              const dupdated = state.tasks.reduce((tasks, t) => {
                if (t.id !== cmd.id) {
                  tasks.push(t);
                }
                return tasks;
              }, []);
              setState({
                ...state,
                tasks: dupdated
              });
              break;
            case "fl":
            case "flag":
              const flupdated = state.tasks.map(t => {
                if (t.id === cmd.id) {
                  t.status = t.status === TaskStatus.FLAG ? TaskStatus.WAIT : TaskStatus.FLAG;
                  t = stopWorkLogging(t);
                }
                return t;
              });
              setState({
                ...state,
                tasks: flupdated
              });
              break;
            case "st":
            case "stop":
              const stupdated = state.tasks.map(t => {
                if (t.id === cmd.id) {
                  if (t.status === TaskStatus.WIP) {
                    t.status = TaskStatus.WAIT;
                    t = stopWorkLogging(t);
                  }
                }
                return t;
              });
              setState({
                ...state,
                tasks: stupdated
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
                setState({
                  ...state,
                  tasks: state.tasks.concat({
                    id: nextId + 1,
                    tag: tag,
                    title: task,
                    status: TaskStatus.WAIT
                  } as TaskItem)
                })
              }
              break;
            case "e":
            case "edit": {
              const id = cmd.id;
              const task = cmd.text;
              if (task && task.length) {
                setState({
                  ...state,
                  tasks: state.tasks.map(t => {
                    if (t.id === id) {
                      t.title = task;
                    }
                    return t;
                  })
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
        inputRef.current.value = "";
      }
    }
  };

  const taskGroups = state.tasks.reduce((groups, t) => {
    if (!groups[t.tag]) {
      groups[t.tag] = [];
    }
    groups[t.tag].push(t);
    return groups;
  }, {});

  const summary = state.tasks.reduce((stats, t) => {
    switch (t.status) {
      case TaskStatus.WAIT:
        stats.pending += 1;
        break;
      case TaskStatus.DONE:
        stats.done += 1;
        break;
      case TaskStatus.WIP:
        stats.wip += 1;
        break;
    }
    return stats;
  }, {
    done: 0,
    wip: 0,
    pending: 0
  })

  return <StateContext.Provider value={[state, setState]}>
    <div className={`w-full h-full relative flex flex-col font-mono text-foreground bg-background ${state.darkMode ? 'dark' : 'light'}`}>
      <div className="flex-1 flex flex-col sm:flex-row pb-10 bg-background">
        <div className="flex-1 p-5">
          {Object.keys(taskGroups).map((g, i) => [
            <Row key={`tag-${i}`} type={RowType.TAG} text={g} />,
            taskGroups[g].map((t, j) => <Row key={`tag-${i}-inner-task-${j}-${t.id}`} type={RowType.TASK} task={t} />),
            <Row key={`tag-${i}-separator-${i}`} type={RowType.TEXT} text="" />
          ])}
          <Row type={RowType.TEXT} text={`${(summary.done/state.tasks.length * 100 || 0).toFixed(0)}% of all tasks complete.`} />
          <Row type={RowType.TEXT} text={`<span class="text-green">${summary.done}</span> done · <span class="text-orange">${summary.wip}</span> in-progress · <span class="text-purple">${summary.pending}</span> waiting`} />
        </div>
        {state.showToday ? <div className="w-full mb-20 sm:mb-0 sm:w-2/6 p-5 text-sm text-left border-l border-control">
          <Today />
        </div> : null}
        {state.showHelp ? <div className="w-full mb-20 sm:mb-0 sm:w-2/6 p-5 text-sm text-left border-l border-control" style={{transition: 'all 0.5s'}}>
        Type the command in the input box below, starting with:<br/>
        &nbsp; <b>t</b> or <b>task</b>&nbsp;&nbsp;&nbsp; Add a new task<br/>
        &nbsp; <b>b</b> or <b>begin</b>&nbsp;&nbsp; Start working on a task<br/>
        &nbsp; <b>c</b> or <b>check</b>&nbsp;&nbsp; Check to mark a task as done<br/>
        &nbsp; <b>d</b> or <b>delete</b>&nbsp; Delete a task<br/>
        &nbsp; <b>e</b> or <b>edit</b>&nbsp; Edit a task title<br/>
        &nbsp; <b>mv</b> or <b>move</b>&nbsp;&nbsp; Move a task to another tag<br/>
        &nbsp; <b>fl</b> or <b>flag</b>&nbsp;&nbsp; Toggle a flag<br/>
        &nbsp; <b>st</b> or <b>stop</b>&nbsp;&nbsp; Stop working on a task<br/>
        &nbsp; <b>today</b>: Show today activities<br/>
        &nbsp; <b>dark</b>: Enable dark mode<br/>
        &nbsp; <b>light</b>: Enable light mode<br/>
        <br/>
        Example:<br/>
        &nbsp; <code>t @work This is a new task</code><br/>
        &nbsp; <code>task @longer-tag This is another task</code><br/>
        &nbsp; <code>b 10</code> or <code>begin 12</code><br/>
        &nbsp; <code>c 7</code>&nbsp; or <code>check 9</code><br/>
        &nbsp; <code>d 3</code>&nbsp; or <code>delete 3</code><br/>
        &nbsp; <code>e 1 this is a new task description</code><br/>
        &nbsp; <code>mv 2 @new-tag</code> or <code>move 2 @uncategorized</code><br/>
        &nbsp; <code>fl 2</code> or <code>flag 2</code><br/>
        &nbsp; <code>st 1</code> or <code>stop 1</code><br/>
        &nbsp; <code>edit 1 a new task description goes here</code><br/>
        <br/>
        Other commands:<br/>
        &nbsp; <b>close-help</b>: Close this help text<br/>
        &nbsp; <b>help</b>: Show this help text<br/>
      </div> : null}
    </div>
    { state.sawTheInput ? null : <div className="absolute bottom-0 left-0 ml-2 mb-8 z-50 flex flex-row bg-orange pulse w-4 h-4 rounded-full shadow-xl"></div> }
    <input ref={inputRef} className={`bg-control w-full p-2 px-3 text-sm fixed bottom-0 left-0`} tabIndex={0} autoFocus={true} onKeyPress={onKeyPress} placeholder="enter anything here..." />
  </div>
  </StateContext.Provider>;
};
