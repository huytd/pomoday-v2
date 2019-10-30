import * as React from 'react';
import {useInterval} from '../helpers/hooks';
import {TaskStatus, counterAsString, Worklog} from '../helpers/utils';

export const TimeSpent = (props) => {
  const task = props.task;
  const totalTime = (task.logs || []).reduce((total, log: Worklog) => {
    if (log.end) {
      total += log.end - log.start;
    }
    else {
      total += Date.now() - log.start;
    }
    return total;
  }, 0) / 1000;

  const [counter, setCounter] = React.useState(totalTime);

  if (~~totalTime !== counter) {
    setCounter(~~totalTime);
  }

  useInterval(() => {
    setCounter(counter + 1);
  }, task.status === TaskStatus.WIP ? 1000 : 0);

  switch (task.status) {
    case TaskStatus.WIP:
      return <span className="block sm:inline-block text-sm text-orange">{counterAsString(counter)}</span>;
    case TaskStatus.DONE:
      return <span className="block sm:inline-block text-sm text-stall-dim">{counterAsString(counter)}</span>;
    default:
      return counter ? <span className="block sm:inline-block text-sm text-tomato">{counterAsString(counter)}</span> : null;
  }
};

