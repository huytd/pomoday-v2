import * as React from 'react';
import { useEventListener, useInterval } from '../helpers/hooks';
import { TaskStatus, counterAsString, Worklog } from '../helpers/utils';

export const TimeSpent = props => {
  const task = props.task;
  const getTotalTime = () => {
    return (
      (task.logs || []).reduce((total, log: Worklog) => {
        if (log.end) {
          total += log.end - log.start;
        } else {
          total += Date.now() - log.start;
        }
        return total;
      }, 0) / 1000
    );
  };

  const updateAppVisibility = e => {
    if (task.status === TaskStatus.WIP) {
      if (document.visibilityState === 'visible') {
        setCounter(getTotalTime());
      }
    }
  };

  useEventListener('visibilitychange', updateAppVisibility);

  const [counter, setCounter] = React.useState(getTotalTime());

  useInterval(
    () => {
      // I can just call getTotalTime() here again to avoid the hassle of
      // catching visibility change and recalculating. But I don't think
      // looping thru the worklog every 1s is a smart solution.
      setCounter(counter + 1);
    },
    task.status === TaskStatus.WIP ? 1000 : 0,
  );

  switch (task.status) {
    case TaskStatus.WIP:
      return (
        <span className="el-time-counter time-wip block sm:inline-block text-sm text-orange">
          {counterAsString(counter)}
        </span>
      );
    case TaskStatus.DONE:
      return (
        <span className="el-time-counter time-done block sm:inline-block text-sm text-stall-dim">
          {counterAsString(counter)}
        </span>
      );
    default:
      return counter ? (
        <span className="el-time-counter time-started block sm:inline-block text-sm text-tomato">
          {counterAsString(counter)}
        </span>
      ) : null;
  }
};
