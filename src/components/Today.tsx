import * as React from 'react';
import {StateContext} from './App';
import {isSameDay, TaskStatus, taskAsString, counterAsLog} from '../helpers/utils';

export const Today = props => {
  const [state] = React.useContext(StateContext);
  const now = Date.now();
  const today = state.tasks.reduce((tasks, t) => {
    if (t.logs) {
      const works = t.logs.reduce((logs, l, id) => {
        if (l.start && isSameDay(now, l.start)) {
          logs.push({
            task: t.title,
            start: l.start,
            end: l.end,
            done: l.end && id === t.logs.length - 1 && t.status === TaskStatus.DONE || false
          });
        }
        return logs;
      }, []);
      tasks = tasks.concat(works);
    }
    return tasks;
  }, []);
  today.sort((a, b) => a.start - b.start);
  const totalTime = today.reduce((total, t) => total + ((t.end || now) - t.start), 0) / 1000;
  return <>
    <div className="font-bold text-black dark:text-white mb-4">Today Activities</div>
    {today.map((t, i) => <div className="text-black dark:text-white mb-2 flex flex-row" key={i}>
      <div className="w-8 text-right mr-2">{i + 1}.</div>
      <div className="flex-1">
        <div dangerouslySetInnerHTML={{__html: taskAsString(t.task)}}></div>
        <div className="text-xs text-gray-500 dark:text-gray-600">{(new Date(t.start)).toLocaleTimeString()} - {!t.end ? <span className="text-orange-500 dark:text-orange-300">ON GOING</span> : <span>{counterAsLog((t.end - t.start) / 1000)}</span>} {t.done ? [<span key={`separator--${i}`}>- </span>, <span key={`status-text--${i}`} className="text-green-600 dark:text-lime-400">FINISHED</span>] : null}</div>
      </div>
    </div>)}
    <div className="text-black dark:text-white mt-4">Total time spent: <span className="text-tomato-500 dark:text-tomato-400">{counterAsLog(totalTime)}</span></div>
  </>;
};

