import marked from 'marked';
import Queue from './queue';
import Sherlock from 'sherlockjs';

export const KEY_TAB = 9;
export const KEY_RETURN = 13;
export const KEY_UP = 38;
export const KEY_RIGHT = 39;
export const KEY_DOWN = 40;
export const KEY_F = 70;
export const KEY_P = 80;
export const KEY_N = 78;
export const KEY_INPUT = 73;
export const KEY_SLASH = 191;
export const KEY_ESC = 27;

export const MAX_COMMAND_QUEUE_LENGTH = 10;
export const SYNC_TIMER = 1000;
export const AUTO_SYNC_TIMER = 5000;

const encodeHtmlEntities = str => {
  var buf = [];
  for (var i = str.length - 1; i >= 0; i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};

const decodeHtmlEntities = str =>
  str.replace(/&#(\d+);/g, function(match, dec) {
    return String.fromCharCode(dec);
  });

export const getHistoryQueue = (serialized?: any) => {
  let ret = new Queue<string>(MAX_COMMAND_QUEUE_LENGTH);
  if (!serialized) {
    serialized = {
      store: [
        'task @tag-name Task content here',
        'begin [task-id]',
        'stop [task-id]',
        'edit [task-id] New task description',
        'move [task-id] @new-tag',
        'archive [task-id]',
        'restore [task-id]',
        'dark',
        'light',
      ],
      length: 10,
    };
  }
  ret = ret.deserialize(serialized);
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
  archived: boolean;
  lastaction: number;
};

export const createTask = (
  id: number,
  tag: string,
  task: string,
  status: TaskStatus,
  logs?: Worklog[],
): TaskItem => {
  return {
    id: id,
    tag: tag,
    title: task,
    status: status,
    logs: logs || [],
    archived: false,
    lastaction: Date.now(),
  };
};

export const getStatus = (status: TaskStatus | null, absolute: boolean) => {
  switch (status) {
    case TaskStatus.DONE:
      return `<span style="${absolute ? 'margin-top: -5px;' : ''}" class="${
        absolute ? 'absolute top-0 left-0' : ''
      } text-lg text-green">✔</span>`;
    case TaskStatus.WIP:
      return `<span style="${absolute ? 'margin-top: -5px;' : ''}" class="${
        absolute ? 'absolute top-0 left-0' : ''
      } text-lg text-orange">*</span>`;
    case TaskStatus.WAIT:
      return `<span style="${absolute ? 'margin-top: -5px;' : ''}" class="${
        absolute ? 'absolute top-0 left-0' : ''
      } text-lg text-stall-dim">□</span>`;
    case TaskStatus.FLAG:
      return `<span style="${absolute ? 'margin-top: -5px;' : ''}" class="${
        absolute ? 'absolute top-0 left-0' : ''
      } text-lg text-tomato">■</span>`;
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

const processInlineTag = input =>
  input.replace(
    /#(?=\S*['-]?)([0-9a-zA-Z'-]+)/g,
    '<span class="inline-tag">#$1</span>',
  );

const processFilterMatchingTag = (input, search) =>
  search
    ? input.replace(
        new RegExp(search, 'ig'),
        matched => '<span class="inline-filter-tag">' + matched + '</span>',
      )
    : input;

export const taskAsString = (t, search?: string) => {
  const decoded = decodeHtmlEntities(
    marked(t)
      .replace('<p>', '')
      .replace('</p>', ''),
  );
  if (search) {
    return processFilterMatchingTag(decoded, search);
  } else {
    return processInlineTag(decoded);
  }
};

const equalDate = (a, b) => new Date(a).getDate() === new Date(b).getDate();
export const isSameDay = (a, b) =>
  equalDate(a, b) && Math.abs(a - b) <= 86400000;

export const findCommon = (items: string[]): string => {
  if (items && items.length) {
    const minLength = items.reduce(
      (l, i) => (l < i.length ? i.length : l),
      items[0].length,
    );
    let len = 0;
    for (len = 0; len < minLength; len++) {
      const base = items[0].charAt(len);
      let allMatched = true;
      for (let j = 1; j < items.length; j++) {
        if (items[j].charAt(len) !== base) {
          allMatched = false;
          break;
        }
      }
      if (!allMatched) {
        break;
      }
    }
    return items[0].substr(0, len);
  }
  return '';
};

export type ParsedEvent = {
  title: string;
  start?: number;
  end?: number;
};

export const parseEventInTask = (input): ParsedEvent => {
  const parsed = Sherlock.parse(input);
  return {
    title: parsed.eventTitle,
    start: parsed.startDate,
    end: parsed.endDate,
  };
};
