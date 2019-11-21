import * as React from 'react';
import { StateContext } from './App';
import { TaskItem, RowType } from '../helpers/utils';
import { Row } from './Row';

export const ArchivedList = props => {
  const [state] = React.useContext(StateContext);
  const archivedItems = state.tasks.filter(t => t.archived);
  const taskGroups = archivedItems.reduce(
    (groups, t: TaskItem) => {
      if (!groups.display[t.tag]) {
        groups.display[t.tag] = [];
      }
      groups.display[t.tag].push(t);
      return groups;
    },
    {
      display: {},
      hidden: [],
    },
  );
  return (
    <div className="el-archived-list w-full flex flex-col">
      <div className="mb-4">
        <div className="el-sideview-header text-stall-dim font-bold text-lg">
          Archived
        </div>
        <div className="el-sideview-sub-header text-xs text-stall-dim font-normal uppercase">
          {archivedItems.length} tasks
        </div>
      </div>
      <div className="h-full overflow-y-auto">
        {Object.keys(taskGroups.display).map((g, i) => [
          <Row key={`tag-${i}`} type={RowType.TAG} text={g} />,
          taskGroups.display[g].map((t, j) => (
            <Row
              key={`tag-${i}-inner-task-${j}-${t.id}`}
              type={RowType.TASK}
              task={t}
            />
          )),
          <Row key={`tag-${i}-separator-${i}`} type={RowType.TEXT} text="" />,
        ])}
      </div>
    </div>
  );
};
