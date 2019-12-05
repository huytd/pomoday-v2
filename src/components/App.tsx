import * as React from 'react';
import { Row } from './Row';
import { Today } from './Today';
import {
  AUTO_SYNC_TIMER,
  createTask,
  getHistoryQueue,
  RowType,
  SYNC_TIMER,
  TaskItem,
  TaskStatus,
} from '../helpers/utils';
import { InputBox } from './InputBox';
import { GoogleAnalytics } from './GoogleAnalytics';
import { CodeEditor } from './CodeEditor';
import { ArchivedList } from './ArchivedList';
import { HelpDialog } from './HelpDialog';
import { AuthDialog } from './AuthDialog';
import { pullFromDB, pushToDB } from '../helpers/api';
import { StatusBar } from './StatusBar';
import { QuickHelp } from './QuickHelp';
import { useEventListener, useInterval } from '../helpers/hooks';

export const StateContext = React.createContext<any>(null);

const tutorialTasks: TaskItem[] = [
  createTask(1, '@demo', "Let's learn the basic of Pomoday:", TaskStatus.FLAG),
  createTask(2, '@demo', 'This is a task', TaskStatus.WAIT),
  createTask(3, '@demo', 'This is an ongoing task', TaskStatus.WIP, [
    { start: Date.now(), end: 0 },
  ]),
  createTask(4, '@demo', 'This is a finished task', TaskStatus.DONE, [
    { start: Date.now() - 1.5 * 60 * 60 * 1000, end: Date.now() },
  ]),
  createTask(
    5,
    '@demo',
    'You can open the command input by pressing `i` or `I`',
    TaskStatus.WAIT,
  ),
  createTask(
    6,
    '@demo',
    'In the command input, you can create a new task by entering the task content. Yes, markdown is\n\nsupported! You can also create a task with a tag, type `@<tag-name>` at the beginning.',
    TaskStatus.WAIT,
  ),
  createTask(
    7,
    '@demo',
    'Type `b` or `begin` followed by the `task id` to start the timer on a task.',
    TaskStatus.WAIT,
  ),
  createTask(
    8,
    '@demo',
    'Type `st` or `stop` followed by the `task id` to stop the timer.',
    TaskStatus.WAIT,
  ),
  createTask(
    9,
    '@demo',
    'Now, try use `c` or `check` followed by the `task id` to mark a task as done.',
    TaskStatus.WAIT,
  ),
  createTask(
    10,
    '@demo',
    'Type `e` or `edit`, followed by the `task id` to edit task content.',
    TaskStatus.WAIT,
  ),
  createTask(
    11,
    '@demo',
    "To see how your day's going, type `today`. Try it!",
    TaskStatus.WAIT,
  ),
  createTask(
    12,
    '@demo',
    "That's all! Now, type `delete @demo` to remove all of this tutorial content and start using Pomoday!",
    TaskStatus.FLAG,
  ),
];

const defaultState = {
  tasks: tutorialTasks,
  showHelp: false,
  showQuickHelp: true,
  showToday: false,
  darkMode: false,
  sawTheInput: false,
  taskVisibility: {
    done: true,
    flagged: true,
    wait: true,
    wip: true,
  },
  history: getHistoryQueue(),
  showCustomCSS: false,
  customCSS: '',
  showArchived: false,
  userWantToLogin: false,
  authToken: '',
  serverUrl: '',
  lastSync: 0,
  filterBy: '',
};

const getInitialState = () => {
  if (window.localStorage) {
    const saved = window.localStorage.getItem('pomoday');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          for (let key in defaultState) {
            if (!parsed.hasOwnProperty(key)) {
              parsed[key] = defaultState[key];
            }
          }
          return parsed;
        }
      } catch {}
    }
  }
  return defaultState;
};

let pushInProgress = false;
const syncTasks = async (state, setState, isPull) => {
  if (!isPull) {
    if (state.tasks.length) {
      pushInProgress = true;
      const data = await pushToDB(
        state.tasks,
        state.serverUrl,
        state.authToken,
      );
      pushInProgress = false;
      setState({
        ...state,
        tasks: data.tasks,
        lastSync: Date.now(),
      });
    }
  } else {
    if (!pushInProgress) {
      const data = await pullFromDB(state.serverUrl, state.authToken);
      setState({
        ...state,
        tasks: data.tasks,
        lastSync: Date.now(),
      });
    }
  }
};

export const App = () => {
  const [state, setState] = React.useState(getInitialState());
  const mainViewRef = React.useRef(null);

  React.useEffect(() => {
    window.localStorage.setItem('pomoday', JSON.stringify(state));
  }, [state]);

  React.useEffect(() => {
    if (state.authToken && Date.now() - state.lastSync >= SYNC_TIMER) {
      (async () => {
        await syncTasks(state, setState, false);
      })();
    }
  }, [state.tasks, state.authToken]);

  useInterval(
    () => {
      if (state.authToken && Date.now() - state.lastSync >= SYNC_TIMER) {
        (async () => {
          await syncTasks(state, setState, true);
        })();
      }
    },
    state.authToken ? AUTO_SYNC_TIMER : 0,
  ); // Auto sync

  const getVisibilityStatusText = (): string[] => {
    const hidden = Object.keys(state.taskVisibility)
      .reduce((arr, k) => {
        if (state.taskVisibility[k] === false) {
          arr.push(k);
        }
        return arr;
      }, [])
      .map(t => {
        if (t === 'done') return 'Finished';
        if (t === 'flagged') return 'Flagged';
        if (t === 'wait') return 'Pending';
        if (t === 'wip') return 'On Going';
      });
    return hidden;
  };

  const taskGroups = [...state.tasks]
    .sort((a, b) => a.id - b.id)
    .filter(t => t.status !== TaskStatus.NONE)
    .filter(t => !t.archived)
    .filter(t =>
      state.filterBy
        ? t.title.match(new RegExp(state.filterBy, 'ig')) !== null ||
          t.tag.match(new RegExp(state.filterBy, 'ig')) !== null
        : true,
    )
    .reduce(
      (groups, t: TaskItem) => {
        if (!groups.display[t.tag]) {
          groups.display[t.tag] = [];
        }
        if (
          (t.status === TaskStatus.DONE && state.taskVisibility.done) ||
          (t.status === TaskStatus.FLAG && state.taskVisibility.flagged) ||
          (t.status === TaskStatus.WAIT && state.taskVisibility.wait) ||
          (t.status === TaskStatus.WIP && state.taskVisibility.wip)
        ) {
          groups.display[t.tag].push(t);
        } else {
          groups.hidden.push(t);
        }
        return groups;
      },
      {
        display: {},
        hidden: [],
      },
    );

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

  const showEmpty =
    summary.done === 0 && summary.pending === 0 && summary.wip === 0;

  const countDone = (group, g) => {
    return (
      group.hidden.filter(t => t.tag === g && t.status === TaskStatus.DONE)
        .length +
      group.display[g].filter(t => t.status === TaskStatus.DONE).length
    );
  };

  const countTotal = (group, g) => {
    return (
      taskGroups.display[g].length +
      group.hidden.filter(t => t.tag === g).length
    );
  };

  const processHotKey = e => {
    if (mainViewRef && mainViewRef.current) {
      if (!document.activeElement.tagName.match(/body/i)) return;
      if (
        state.showHelp ||
        state.showQuickHelp ||
        (state.userWantToLogin && !state.authToken)
      )
        return;
      switch (e.key) {
        case 'Escape':
          if (state.filterBy) {
            setState({
              ...state,
              filterBy: '',
            });
          }
          break;
        case 'j':
        case 'ArrowDown':
          mainViewRef.current.scroll(0, mainViewRef.current.scrollTop + 100);
          break;
        case 'k':
        case 'ArrowUp':
          mainViewRef.current.scroll(0, mainViewRef.current.scrollTop - 100);
          break;
        default:
          break;
      }
    }
  };

  useEventListener('keydown', processHotKey);

  return (
    <StateContext.Provider value={[state, setState]}>
      <style dangerouslySetInnerHTML={{ __html: state.customCSS }} />
      <div
        className={`w-screen h-screen relative flex flex-col font-mono text-foreground bg-background draggable ${
          state.darkMode ? 'dark' : 'light'
        }`}>
        <StatusBar />
        {/* Filtering */}
        {state.filterBy ? (
          <div className={'p-5'}>
            Search result for: "<b>{state.filterBy}"</b>
            <br />
            Press <code>ESC</code> to go back.
          </div>
        ) : null}
        <div className="flex-1 flex flex-col sm:flex-row bg-background overflow-hidden no-drag">
          {/* Task List */}
          {showEmpty ? (
            <div className={'el-main-view flex-1 p-5 h-full relative'}>
              <div className={'empty-image w-full h-full'} />
              <div
                className={
                  'absolute flex flex-col leading-relaxed justify-center items-center top-0 left-0 right-0 bottom-0 text-center text-lg sm:text-xl text-foreground'
                }>
                <div>Need to get some work done?</div>
                <div>Let's add some task!</div>
              </div>
            </div>
          ) : (
            <div
              ref={mainViewRef}
              className="el-main-view flex-1 p-5 h-full overflow-y-auto">
              {taskGroups.hidden.length ? (
                <div className="pb-5 text-stall-dim">
                  {taskGroups.hidden.length} tasks in{' '}
                  {getVisibilityStatusText().join(', ')} group are hidden.
                </div>
              ) : null}
              <div>
                {Object.keys(taskGroups.display).map((g, i) => [
                  <Row
                    key={`tag-${i}`}
                    type={RowType.TAG}
                    text={g}
                    matching={state.filterBy || undefined}
                    sidetext={`[${countDone(taskGroups, g)}/${countTotal(
                      taskGroups,
                      g,
                    )}]`}
                  />,
                  taskGroups.display[g].map((t, j) => (
                    <Row
                      key={`tag-${i}-inner-task-${j}-${t.id}`}
                      type={RowType.TASK}
                      task={t}
                      matching={state.filterBy || undefined}
                    />
                  )),
                  <Row
                    key={`tag-${i}-separator-${i}`}
                    type={RowType.TEXT}
                    text=""
                  />,
                ])}
                <Row
                  customClass={'text-sm'}
                  type={RowType.TEXT}
                  text={`${(
                    (summary.done / state.tasks.length) * 100 || 0
                  ).toFixed(0)}% of all tasks complete.`}
                />
                <Row
                  customClass={'text-sm'}
                  type={RowType.TEXT}
                  text={`<span class="text-green">${summary.done}</span> done · <span class="text-orange">${summary.wip}</span> in-progress · <span class="text-purple">${summary.pending}</span> waiting`}
                />
                <Row type={RowType.TEXT} text={''} />
              </div>
            </div>
          )}
          {/* Today */}
          {state.showToday ? (
            <div className="el-sideview w-full h-full absolute sm:relative top-0 left-0 right-0 bottom-0 sm:top-auto sm:left-auto sm:right-auto sm:bottom-auto overflow-y-auto sm:w-2/6 p-5 text-left border-l border-control">
              <Today />
            </div>
          ) : null}
          {/* Help */}
          {state.showHelp ? <HelpDialog /> : null}
          {state.showQuickHelp ? <QuickHelp /> : null}
          {/* Custom CSS */}
          {state.showCustomCSS ? (
            <div className="el-sideview w-full h-full absolute sm:relative top-0 left-0 right-0 bottom-0 sm:top-auto sm:left-auto sm:right-auto sm:bottom-auto overflow-y-auto sm:w-2/6 p-5 text-left border-l border-control flex">
              <CodeEditor />
            </div>
          ) : null}
          {/* Archived List */}
          {state.showArchived ? (
            <div className="el-sideview w-full h-full absolute sm:relative top-0 left-0 right-0 bottom-0 sm:top-auto sm:left-auto sm:right-auto sm:bottom-auto overflow-y-auto sm:w-2/6 p-5 text-left border-l border-control flex">
              <ArchivedList />
            </div>
          ) : null}
          {!state.authToken && state.userWantToLogin ? <AuthDialog /> : null}
        </div>
        <InputBox />
      </div>
      <GoogleAnalytics />
    </StateContext.Provider>
  );
};
