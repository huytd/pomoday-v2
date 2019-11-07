import * as React from 'react';
import { Row } from './Row';
import { Today } from './Today';
import {
  TaskItem,
  TaskStatus,
  RowType,
  getHistoryQueue,
} from '../helpers/utils';
import { InputBox } from './InputBox';
import { GoogleAnalytics } from './GoogleAnalytics';

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
    sawTheInput: false,
    history: getHistoryQueue(),
  };
};

export const App = () => {
  const [state, setState] = React.useState(getInitialState());

  React.useEffect(() => {
    window.localStorage.setItem('pomoday', JSON.stringify(state));
  }, [state]);

  const taskGroups = state.tasks.reduce((groups, t) => {
    if (!groups[t.tag]) {
      groups[t.tag] = [];
    }
    groups[t.tag].push(t);
    return groups;
  }, {});

  const summary = state.tasks.reduce(
    (stats, t) => {
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
    },
    {
      done: 0,
      wip: 0,
      pending: 0,
    },
  );

  return (
    <StateContext.Provider value={[state, setState]}>
      <div
        className={`w-full h-full relative flex flex-col font-mono text-foreground bg-background ${
          state.darkMode ? 'dark' : 'light'
        }`}>
        <div className="flex-1 flex flex-col sm:flex-row pb-10 bg-background">
          <div className="flex-1 p-5">
            {Object.keys(taskGroups).map((g, i) => [
              <Row key={`tag-${i}`} type={RowType.TAG} text={g} />,
              taskGroups[g].map((t, j) => (
                <Row
                  key={`tag-${i}-inner-task-${j}-${t.id}`}
                  type={RowType.TASK}
                  task={t}
                />
              )),
              <Row
                key={`tag-${i}-separator-${i}`}
                type={RowType.TEXT}
                text=""
              />,
            ])}
            <Row
              type={RowType.TEXT}
              text={`${((summary.done / state.tasks.length) * 100 || 0).toFixed(
                0,
              )}% of all tasks complete.`}
            />
            <Row
              type={RowType.TEXT}
              text={`<span class="text-green">${summary.done}</span> done · <span class="text-orange">${summary.wip}</span> in-progress · <span class="text-purple">${summary.pending}</span> waiting`}
            />
          </div>
          {state.showToday ? (
            <div className="w-full mb-20 sm:mb-0 sm:w-2/6 p-5 text-sm text-left border-l border-control">
              <Today />
            </div>
          ) : null}
          {state.showHelp ? (
            <div
              className="w-full mb-20 sm:mb-0 sm:w-2/6 p-5 text-sm text-left border-l border-control"
              style={{ transition: 'all 0.5s' }}>
              Type the command in the input box below, starting with:
              <br />
              &nbsp; <b>t</b> or <b>task</b>&nbsp;&nbsp;&nbsp; Add a new task
              <br />
              &nbsp; <b>b</b> or <b>begin</b>&nbsp;&nbsp; Start working on a
              task
              <br />
              &nbsp; <b>c</b> or <b>check</b>&nbsp;&nbsp; Check to mark a task
              as done
              <br />
              &nbsp; <b>d</b> or <b>delete</b>&nbsp; Delete a task
              <br />
              &nbsp; <b>e</b> or <b>edit</b>&nbsp; Edit a task title
              <br />
              &nbsp; <b>mv</b> or <b>move</b>&nbsp;&nbsp; Move a task to another
              tag
              <br />
              &nbsp; <b>fl</b> or <b>flag</b>&nbsp;&nbsp; Toggle a flag
              <br />
              &nbsp; <b>st</b> or <b>stop</b>&nbsp;&nbsp; Stop working on a task
              <br />
              &nbsp; <b>tr</b> or <b>tagre</b> or <b>tagrename</b> @tag-a
              @tag-b: Rename a tag
              <br />
              &nbsp; <b>today</b>: Show today activities
              <br />
              &nbsp; <b>dark</b>: Enable dark mode
              <br />
              &nbsp; <b>light</b>: Enable light mode
              <br />
              <br />
              Example:
              <br />
              &nbsp; <code>t @work This is a new task</code>
              <br />
              &nbsp; <code>task @longer-tag This is another task</code>
              <br />
              &nbsp; <code>b 10</code> or <code>begin 12</code>
              <br />
              &nbsp; <code>c 7</code>&nbsp; or <code>check 9</code>
              <br />
              &nbsp; <code>d 3</code>&nbsp; or <code>delete 3</code>
              <br />
              &nbsp; <code>e 1 this is a new task description</code>
              <br />
              &nbsp; <code>mv 2 @new-tag</code> or{' '}
              <code>move 2 @uncategorized</code>
              <br />
              &nbsp; <code>fl 2</code> or <code>flag 2</code>
              <br />
              &nbsp; <code>st 1</code> or <code>stop 1</code>
              <br />
              &nbsp; <code>edit 1 a new task description goes here</code>
              <br />
              &nbsp; <code>tr @work @play</code>
              <br />
              <br />
              Other commands:
              <br />
              &nbsp; <b>close-help</b>: Close this help text
              <br />
              &nbsp; <b>help</b>: Show this help text
              <br />
            </div>
          ) : null}
        </div>
        <InputBox />
      </div>
      <GoogleAnalytics />
    </StateContext.Provider>
  );
};
