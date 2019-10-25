import * as React from 'react';
import marked from 'marked';

enum RowType {
  TAG,
  TASK,
  TEXT
};

enum TaskStatus {
  NONE,
  DONE,
  WIP,
  WAIT
}

type Command = {
  command: string,
  tag?: string,
  text?: string,
  id?: number
} | null;

const parseTaskCommand = (str: string) => str.match(/(t(?:ask)?)\s(@(?:\S*['-]?)(?:[0-9a-zA-Z'-]+))?(.*)/);
const parseCheckCommand = (str: string) => str.match(/(c(?:heck)?)\s(\d+)/);
const parseBeginCommand = (str: string) => str.match(/(b(?:egin)?)\s(\d+)/);
const parseHelpCommand = (str: string) => str.match(/(close-help|help)/);

const parseCommand = (input: string): Command => {
  const matchTask = parseTaskCommand(input);
  if (matchTask) {
    return {
      command: matchTask[1],
      tag: matchTask[2],
      text: matchTask[3].trim()
    } as Command;
  }

  const matchCheck = parseCheckCommand(input);
  if (matchCheck) {
    return {
      command: matchCheck[1],
      id: parseInt(matchCheck[2])
    }
  }

  const matchBegin = parseBeginCommand(input);
  if (matchBegin) {
    return {
      command: matchBegin[1],
      id: parseInt(matchBegin[2])
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
    case TaskStatus.DONE: return <span className="text-green-600">✔</span>;
    case TaskStatus.WIP: return <span className="text-orange-500">…</span>;
    case TaskStatus.WAIT: return <span className="text-gray-500">□</span>;
    default: return null;
  }
};

type TaskItem = {
  id: number;
  tag: string;
  title: string;
  status: TaskStatus;
};

const TaskItemDisplay = props => {
  const title = props.title;
  const status = props.status;
  const counter = props.counter;
  console.log(props);
  return <>
    <div className="w-12 text-right mr-2">{counter}. </div>
    <div className="flex-1 text-left">{getStatus(status)} <span className="inline-block" dangerouslySetInnerHTML={{__html: title}}></span></div>
  </>;
};

const Row = (props) => {
  const type = props.type;
  const title = props.title || "";
  const status = props.status || undefined;
  const counter = props.counter || undefined;
  return <div className={`row ${type === RowType.TAG ? 'font-bold underline' : (type === RowType.TEXT && !title.length ? 'p-3' : 'flex flex-row')}`}>
    {type === RowType.TASK ? <TaskItemDisplay title={marked(title)} status={status} counter={counter} /> : ( type === RowType.TEXT ? <span className="inline-block" dangerouslySetInnerHTML={{__html: marked(title)}}></span> : title)}
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
          switch (cmd.command) {
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
            case "t":
            case "task":
              const tag = cmd.tag || "@uncategorized";
              const task = cmd.text;
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

  return <div className="w-full h-full flex flex-col">
    <div className="p-2 bg-gray-100 text-sm"></div>
    <div className="flex-1 flex flex-row">
      <div className="flex-1 p-5">
        {Object.keys(taskGroups).map((g, i) => [
          <Row key={`tag-${i}`} type={RowType.TAG} title={g} />,
          taskGroups[g].map((t, j) => <Row key={`tag-${i}-inner-task-${j}`} type={RowType.TASK} status={t.status} title={t.title} counter={t.id} />),
          <Row key={`tag-${i}-separator-${i}`} type={RowType.TEXT} title="" />
        ])}
        <Row type={RowType.TEXT} title={`${(summary.done/state.tasks.length * 100 || 0).toFixed(0)}% of all tasks complete.`} />
        <Row type={RowType.TEXT} title={`<span class="text-green-500">${summary.done}</span> done · <span class="text-orange-500">${summary.wip}</span> in-progress · <span class="text-purple-500">${summary.pending}</span> waiting`} />
      </div>
      {state.showHelp ? <div className="w-2/6 p-5 text-sm text-gray-500 text-left border-l" style={{transition: 'all 0.5s'}}>
        Type the command in the input box below, starting with:<br/>
        &nbsp; <b>t</b> or <b>task</b>: Add a new task<br/>
        &nbsp; <b>c</b> or <b>check</b>: Check to mark a task as done<br/>
        &nbsp; <b>b</b> or <b>begin</b>: Start working on a task<br/>
        <br/>
        Example:<br/>
        &nbsp; t @work This is a new task<br/>
        &nbsp; task @longer-tag This is another task<br/>
        &nbsp; b 10<br/>
        &nbsp; begin 12<br/>
        &nbsp; c 7<br/>
        &nbsp; check 9<br/>
        <br/>
        Other commands:<br/>
        &nbsp; <b>close-help</b>: Close this help text<br/>
        &nbsp; <b>help</b>: Show this help text<br/>
      </div> : null}
    </div>
    <input ref={inputRef} className="bg-gray-300 p-2 text-sm" tabIndex={0} autoFocus={true} onKeyPress={onKeyPress} placeholder="enter anything here..." />
  </div>;
};
