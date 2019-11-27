import * as React from 'react';
import { TimeSpent } from './TimeSpent';
import { getStatus, taskAsString, TaskStatus } from '../helpers/utils';

export const TaskItemDisplay = props => {
  const task = props.task;
  const html = getStatus(task.status) + ' ' + taskAsString(task.title);
  return (
    <div className={'flex flex-row'}>
      <div className="el-task-id pt-1 self-center w-8 text-xs text-right text-stall-light mr-3 pr-2 border-control2nd border-r-2">
        {task.id}
      </div>
      <div className="el-task-content pt-1 self-center flex-1 text-left">
        <span className={`task-content inline-block relative pl-5`}>
          <span
            className={
              task.status === TaskStatus.DONE
                ? 'el-task-done inline-block text-stall-light line-through'
                : 'el-task-normal inline-block'
            }
            dangerouslySetInnerHTML={{
              __html: getStatus(task.status) + taskAsString(task.title),
            }}
          />
        </span>{' '}
        <TimeSpent task={task} />
      </div>
    </div>
  );
};
