import * as React from 'react';
import { TimeSpent } from './TimeSpent';
import { getStatus, taskAsString, TaskStatus } from '../helpers/utils';

export const TaskItemDisplay = props => {
  const task = props.task;
  const html = getStatus(task.status) + ' ' + taskAsString(task.title);
  return (
    <>
      <div className="el-task-id self-center w-12 text-right mr-2">
        {task.id}.{' '}
      </div>
      <div className="el-task-content self-center flex-1 text-left">
        <span
          className={`task-content inline-block ${
            task.status === TaskStatus.DONE
              ? 'el-task-done text-stall-light line-through'
              : 'el-task-normal'
          }`}
          dangerouslySetInnerHTML={{ __html: html }}></span>{' '}
        <TimeSpent task={task} />
      </div>
    </>
  );
};
