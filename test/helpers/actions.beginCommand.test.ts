import * as test from 'tape';
import { TaskItem, TaskStatus } from '../../src/helpers/utils';
import { beginCommand } from '../../src/helpers/commands/actions';

const state = {
  tasks: [
    {
      id: 1,
      tag: '@pomoday',
      title: 'test task',
      status: TaskStatus.WAIT,
      logs: [],
      archived: false,
    } as TaskItem,
    {
      id: 2,
      tag: '@work',
      title: 'test work task',
      status: TaskStatus.DONE,
      logs: [],
      archived: false,
    } as TaskItem,
  ],
};

test('begin single task', t => {
  const output = beginCommand([], state, [1]);
  t.equal(output[0].status, TaskStatus.WIP);
  t.equal(output[0].logs.length, 1);
  t.end();
});

test('begin many task', t => {
  const output = beginCommand([], state, [1, 2]);
  t.equal(output[0].status, TaskStatus.WIP);
  t.equal(output[0].logs.length, 1);
  t.equal(output[1].status, TaskStatus.WIP);
  t.equal(output[1].logs.length, 1);
  t.end();
});
