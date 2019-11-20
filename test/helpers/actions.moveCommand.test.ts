import * as test from 'tape';
import { TaskItem, TaskStatus } from '../../src/helpers/utils';
import { moveCommand } from '../../src/helpers/commands/actions';

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
    {
      id: 3,
      tag: '@work',
      title: 'test second work task',
      status: TaskStatus.WIP,
      logs: [],
      archived: false,
    } as TaskItem,
  ],
};

test('move single task', t => {
  const output = moveCommand([], state, [1], { tag: '@work' });
  t.equal(output[0].tag, '@work');
  t.end();
});

test('move many task', t => {
  const output = moveCommand([], state, [2, 3], { tag: '@pomoday' });
  t.equal(output[1].tag, '@pomoday');
  t.equal(output[2].tag, '@pomoday');
  t.end();
});
