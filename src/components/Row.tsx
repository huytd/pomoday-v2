import * as React from 'react';
import marked from 'marked';
import { TaskItemDisplay } from './TaskItemDisplay';
import { RowType } from '../helpers/utils';

export const Row = props => {
  const type = props.type;
  const text = props.text || '';
  const sidetext = props.sidetext || '';
  const task = props.task || undefined;
  return (
    <div
      className={`row ${
        type === RowType.TAG
          ? 'el-tag font-bold inline-block px-3 py-1 mb-2 bg-control rounded-lg'
          : type === RowType.TEXT && !text.length
          ? 'el-space p-3'
          : 'el-text flex flex-row'
      }`}>
      {type === RowType.TASK ? (
        <TaskItemDisplay task={task} />
      ) : type === RowType.TEXT ? (
        <span
          className="el-text inline-block"
          dangerouslySetInnerHTML={{ __html: marked(text) }}
        />
      ) : (
        text
      )}
      {sidetext ? (
        <span className="el-side-text inline-block text-stall-dim ml-2">
          {sidetext}
        </span>
      ) : null}
    </div>
  );
};
