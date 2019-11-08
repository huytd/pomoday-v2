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
          ? 'font-bold underline'
          : type === RowType.TEXT && !text.length
          ? 'p-3'
          : 'flex flex-row'
      }`}>
      {type === RowType.TASK ? (
        <TaskItemDisplay task={task} />
      ) : type === RowType.TEXT ? (
        <span
          className="inline-block"
          dangerouslySetInnerHTML={{ __html: marked(text) }}></span>
      ) : (
        text
      )}
      {sidetext ? (
        <span className="inline-block text-stall-dim ml-2">{sidetext}</span>
      ) : null}
    </div>
  );
};
