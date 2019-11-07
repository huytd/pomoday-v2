import * as React from 'react';
import { StateContext } from './App';
import {
  isSameDay,
  TaskStatus,
  taskAsString,
  counterAsLog,
  getStatus,
} from '../helpers/utils';

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
            done:
              (l.end &&
                id === t.logs.length - 1 &&
                t.status === TaskStatus.DONE) ||
              false,
          });
        }
        return logs;
      }, []);
      tasks = tasks.concat(works);
    }
    return tasks;
  }, []);
  today.sort((a, b) => a.start - b.start);
  const totalTime =
    today.reduce((total, t) => total + ((t.end || now) - t.start), 0) / 1000;

  const todayAsString = () => {
    const [_, month, day, year] = new Date().toDateString().split(' ');
    return (
      <>
        <div className="font-bold">Today Overview</div>
        <div className="font-normal uppercase text-xs">{`${month} ${day}, ${year}`}</div>
      </>
    );
  };

  return (
    <>
      <div className="mb-4">{todayAsString()}</div>
      {today.map((t, i) => (
        <div className="mb-2 flex flex-row" key={i}>
          <div
            className={`text-right text-xs pr-3 mr-3 border-r-2 ${
              t.done
                ? 'border-green'
                : !t.end
                ? 'border-orange'
                : 'border-stall-dim'
            }`}>
            <span className="block text-stall-dim">
              {new Date(t.start).toLocaleTimeString()}
            </span>
            {t.end ? (
              <span className="block">
                {new Date(t.end).toLocaleTimeString()}
              </span>
            ) : null}
          </div>
          <div className="flex-1">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  getStatus(!t.done && !t.end ? TaskStatus.WIP : null) +
                  ' ' +
                  taskAsString(t.task),
              }}></div>
            <div className="text-xs text-stall-dim">
              {!t.end ? null : (
                <span>
                  {t.done ? <span className="text-green">✔</span> : null}{' '}
                  {counterAsLog((t.end - t.start) / 1000)}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="mt-4">
        Time spent:{' '}
        <span className="text-tomato">{counterAsLog(totalTime)}</span>
      </div>
    </>
  );
};
