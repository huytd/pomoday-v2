import marked from 'marked';
import Queue from './queue';
import { serialize } from 'uri-js';

export const MAX_COMMAND_QUEUE_LENGTH = 10;

export const getHistoryQueue = (serialized?: any) => {
  let ret = new Queue<string>(MAX_COMMAND_QUEUE_LENGTH);
  if (serialized) {
    ret = ret.deserialize(serialized);
  }
  return ret;
};

export enum RowType {
  TAG,
  TASK,
  TEXT,
}

export enum TaskStatus {
  NONE,
  DONE,
  WIP,
  WAIT,
  FLAG,
}

export type Worklog = {
  start: number;
  end: number;
};

export type TaskItem = {
  id: number;
  tag: string;
  title: string;
  status: TaskStatus;
  logs: Worklog[];
};

export const getStatus = (status?: TaskStatus) => {
  switch (status) {
    case TaskStatus.DONE:
      return `<span class="text-lg text-green">✔</span>`;
    case TaskStatus.WIP:
      return `<span class="text-lg text-orange">*</span>`;
    case TaskStatus.WAIT:
      return `<span class="text-lg text-stall-dim">□</span>`;
    case TaskStatus.FLAG:
      return `<span class="text-lg text-tomato">■</span>`;
    default:
      return '';
  }
};

export const stopWorkLogging = (t: TaskItem) => {
  if (t.logs && t.logs.length) {
    const lastLog = t.logs[t.logs.length - 1];
    if (lastLog.start && !lastLog.end) {
      lastLog.end = Date.now();
    }
  } else {
    t.logs = [
      {
        start: Date.now(),
        end: Date.now(),
      } as Worklog,
    ];
  }
  return t;
};

export const pad = n => (n > 9 ? `${n}` : `0${n}`);

export const counterAsString = counter => {
  const days = ~~(counter / 86400);
  const remain = counter - days * 86400;
  const hrs = ~~(remain / 3600);
  const min = ~~((remain - hrs * 3600) / 60);
  const sec = ~~(remain % 60);
  return `${days > 0 ? days + ' days' : ''} ${
    hrs > 0 ? pad(hrs) + ':' : ''
  }${pad(min)}:${pad(sec)}`;
};

export const counterAsLog = counter => {
  const days = ~~(counter / 86400);
  const remain = counter - days * 86400;
  const hrs = ~~(remain / 3600);
  const min = ~~((remain - hrs * 3600) / 60);
  const sec = ~~(remain % 60);
  return `${days > 0 ? days + ' days ' : ''}${
    hrs > 0 ? pad(hrs) + ' hrs ' : ''
  }${min > 0 ? pad(min) + ' min ' : ''}${pad(sec) + ' sec '}`;
};

export const taskAsString = t =>
  marked(t)
    .replace('<p>', '')
    .replace('</p>', '');

const equalDate = (a, b) => new Date(a).getDate() === new Date(b).getDate();
export const isSameDay = (a, b) =>
  equalDate(a, b) && Math.abs(a - b) <= 86400000;
