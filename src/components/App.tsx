import * as React from 'react';
import marked from 'marked';
import { useRef, useEffect } from 'react';

const StateContext = React.createContext<any>(null);

const useInterval = (callback, delay) => {
    const savedCallback = useRef();
    let handler = null;
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    // Set up the interval.
    useEffect(() => {
        function tick() {
          savedCallback.current();
        }
        if (delay !== 0) {
            handler = setInterval(tick, delay);
            return () => clearInterval(handler);
        }
        else {
            clearInterval(handler);
        }
    }, [delay]);
};

enum RowType {
  TAG,
  TASK,
  TEXT
};

enum TaskStatus {
  NONE,
  DONE,
  WIP,
  WAIT,
  FLAG
}

type Command = {
  command: string,
  tag?: string,
  text?: string,
  id?: number
} | null;

const parseTaskCommand = (str: string) => str.match(/^(t(?:ask)?)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))?(.*)/i);
const parseEditCommand = (str: string) => str.match(/^(e(?:dit)?)\s(\d+)(.*)/i);
const parseCheckCommand = (str: string) => str.match(/^(c(?:heck)?)\s(\d+)/i);
const parseBeginCommand = (str: string) => str.match(/^(b(?:egin)?)\s(\d+)/i);
const parseDeleteCommand = (str: string) => str.match(/^(d(?:elete)?)\s(\d+)/i);
const parseFlagCommand = (str: string) => str.match(/^(fl(?:ag)?)\s(\d+)/i);
const parseStopCommand = (str: string) => str.match(/^(st(?:op)?)\s(\d+)/i);
const parseHelpCommand = (str: string) => str.match(/^(close-help|help)/i);

const parseCommand = (input: string): Command => {
  const matchTask = parseTaskCommand(input);
  if (matchTask) {
    return {
      command: matchTask[1],
      tag: matchTask[2],
      text: matchTask[3].trim()
    } as Command;
  }

  const matchEdit = parseEditCommand(input);
  if (matchEdit) {
    return {
      command: matchEdit[1],
      id: parseInt(matchEdit[2]),
      text: matchEdit[3].trim()
    } as Command;
  }

  const matchOther = parseCheckCommand(input)  ||
                     parseBeginCommand(input)  ||
                     parseDeleteCommand(input) ||
                     parseFlagCommand(input)   ||
                     parseStopCommand(input);
  if (matchOther) {
    return {
      command: matchOther[1],
      id: parseInt(matchOther[2])
    }
  }

  const matchHelp = parseHelpCommand(input);
  if (matchHelp) {
    return {
      command: matchHelp[1]
    }
  }
  return null;
};

const getStatus = (status?: TaskStatus) => {
  switch (status) {
    case TaskStatus.DONE: return `<span class="text-lg text-green-600">✔</span>`;
    case TaskStatus.WIP: return `<span class="text-lg text-orange-500">*</span>`;
    case TaskStatus.WAIT: return `<span class="text-lg text-gray-500">□</span>`;
    case TaskStatus.FLAG: return `<span class="text-lg text-tomato-500">■</span>`;
    default: return "";
  }
};

type TaskItem = {
  id: number;
  tag: string;
  title: string;
  status: TaskStatus;
  timeSpent?: number;
};

const pad = n => n > 9 ? `${n}` : `0${n}`;
const counterAsString = (counter: number): string => {
    const hrs = ~~(counter / 3600);
    const min = ~~((counter - (hrs * 3600)) / 60);
    const sec = ~~(counter % 60);
    return `${hrs > 0 ? pad(hrs) + ':' : ''}${pad(min)}:${pad(sec)}`;
};

const TimeSpent = (props) => {
  const [state, setState] = React.useContext(StateContext);
  const id = props.id;
  const status = props.status;
  const [ timeSpent, setTimeSpent ] = React.useState(props.timeSpent || 0);

  useInterval(() => {
    setTimeSpent(timeSpent + 1);
    if (timeSpent % 5 === 0) {
      setState({
        ...state,
        tasks: state.tasks.map(t => {
          if (t.id === id) {
            t.timeSpent = timeSpent;
          }
          return t;
        })
      });
    }
  }, status === TaskStatus.WIP ? 1000 : 0);

  switch (status) {
    case TaskStatus.WIP:
      return <span className="block sm:inline-block text-sm text-orange-500">{counterAsString(timeSpent)}</span>;
    case TaskStatus.DONE:
      return <span className="block sm:inline-block text-sm text-gray-400">{counterAsString(timeSpent)}</span>;
    default:
      return timeSpent ? <span className="block sm:inline-block text-sm text-tomato-400">{counterAsString(timeSpent)}</span> : null;
  }
};

const TaskItemDisplay = props => {
  const title = props.title;
  const status = props.status;
  const id = props.id;
  const timeSpent = props.timeSpent;
  const html = getStatus(status) + ' ' + title.replace('<p>', '').replace('</p>', '');
  return <>
    <div className="w-12 text-right mr-2">{id}. </div>
    <div className="flex-1 text-left">
      <span className={`task-content inline-block ${status === TaskStatus.DONE ? 'text-gray-500 line-through' : ''}`} dangerouslySetInnerHTML={{__html: html}}></span>
      {' '}
      <TimeSpent id={id} status={status} timeSpent={timeSpent} />
    </div>
  </>;
};

const Row = (props) => {
  const type = props.type;
  const title = props.title || "";
  const status = props.status || undefined;
  const id = props.id || undefined;
  const timeSpent = props.timeSpent || undefined;
  return <div className={`row ${type === RowType.TAG ? 'font-bold underline' : (type === RowType.TEXT && !title.length ? 'p-3' : 'flex flex-row')}`}>
    {type === RowType.TASK ? <TaskItemDisplay title={marked(title)} status={status} id={id} timeSpent={timeSpent} /> : ( type === RowType.TEXT ? <span className="inline-block" dangerouslySetInnerHTML={{__html: marked(title)}}></span> : title)}
  </div>;
};

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
    showHelp: true
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
      if (key === 13) {
        const cmd = parseCommand(inputRef.current.value);
        if (cmd) {
          switch (cmd.command.toLowerCase()) {
            case "b":
            case "begin":
              const bupdated = state.tasks.map(t => {
                if (t.id === cmd.id) {
                  t.status = TaskStatus.WIP;
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
                  t.status = TaskStatus.FLAG;
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
                  t.status = TaskStatus.WAIT;
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
    <div className="w-full h-full flex flex-col font-mono">
      <div className="p-2 bg-gray-100 text-sm"></div>
      <div className="flex-1 flex flex-col sm:flex-row">
        <div className="flex-1 p-5">
          {Object.keys(taskGroups).map((g, i) => [
            <Row key={`tag-${i}`} type={RowType.TAG} title={g} />,
              taskGroups[g].map((t, j) => <Row key={`tag-${i}-inner-task-${j}`} type={RowType.TASK} status={t.status} title={t.title} id={t.id} timeSpent={t.timeSpent} />),
                <Row key={`tag-${i}-separator-${i}`} type={RowType.TEXT} title="" />
          ])}
          <Row type={RowType.TEXT} title={`${(summary.done/state.tasks.length * 100 || 0).toFixed(0)}% of all tasks complete.`} />
          <Row type={RowType.TEXT} title={`<span class="text-green-500">${summary.done}</span> done · <span class="text-orange-500">${summary.wip}</span> in-progress · <span class="text-purple-500">${summary.pending}</span> waiting`} />
        </div>
        {state.showHelp ? <div className="w-full mb-20 sm:mb-0 sm:w-2/6 p-5 text-sm text-gray-700 sm:text-gray-500 text-left border-l" style={{transition: 'all 0.5s'}}>
        Type the command in the input box below, starting with:<br/>
        &nbsp; <b>t</b> or <b>task</b>&nbsp;&nbsp;&nbsp; Add a new task<br/>
        &nbsp; <b>b</b> or <b>begin</b>&nbsp;&nbsp; Start working on a task<br/>
        &nbsp; <b>c</b> or <b>check</b>&nbsp;&nbsp; Check to mark a task as done<br/>
        &nbsp; <b>d</b> or <b>delete</b>&nbsp; Delete a task<br/>
        &nbsp; <b>fl</b> or <b>flag</b>&nbsp;&nbsp; Flag a task<br/>
        &nbsp; <b>st</b> or <b>stop</b>&nbsp;&nbsp; Stop working on a task<br/>
        <br/>
        Example:<br/>
        &nbsp; <code>t @work This is a new task</code><br/>
        &nbsp; <code>task @longer-tag This is another task</code><br/>
        &nbsp; <code>b 10</code> or <code>begin 12</code><br/>
        &nbsp; <code>c 7</code>&nbsp; or <code>check 9</code><br/>
        &nbsp; <code>d 3</code>&nbsp; or <code>delete 3</code><br/>
        &nbsp; <code>fl 2</code> or <code>flag 2</code><br/>
        &nbsp; <code>st 1</code> or <code>stop 1</code><br/>
        &nbsp; <code>e 1 this is a new task description</code><br/>
        &nbsp; <code>edit 1 a new task description goes here</code><br/>
        <br/>
        Other commands:<br/>
        &nbsp; <b>close-help</b>: Close this help text<br/>
        &nbsp; <b>help</b>: Show this help text<br/>
      </div> : null}
    </div>
    <input ref={inputRef} className="bg-gray-300 w-full p-2 text-sm fixed bottom-0 left-0" tabIndex={0} autoFocus={true} onKeyPress={onKeyPress} placeholder="enter anything here..." />
  </div>
  </StateContext.Provider>;
};
