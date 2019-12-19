import * as React from 'react';
import { useEventListener, useInterval } from '../helpers/hooks';
import { TaskStatus, counterAsString, Worklog } from '../helpers/utils';

export const TimeSpent = props => {
  const task = props.task;
  const logs = task.logs || [];

  const totalSpent =
    logs.reduce((total, log: Worklog) => {
      if (log.end) {
        total += log.end - log.start;
      }
      return total;
    }, 0) / 1000;

  const getOnGoingSpent = () => {
    const last = logs[logs.length - 1];
    if (last && !last.end) {
      return totalSpent + (Date.now() - last.start) / 1000;
    }
    return totalSpent;
  };

  const [counter, setCounter] = React.useState(getOnGoingSpent());

  useInterval(
    () => {
      setCounter(getOnGoingSpent());
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
