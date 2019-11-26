import * as test from 'tape';
import { Command, parseCommand } from '../../src/helpers/commands/parser';

const tests: [string, Command][] = [
  // new task
  [
    't @work This is a new task',
    { command: 't', tag: '@work', text: 'This is a new task' },
  ],
  [
    'task @longer-task This is another task',
    { command: 'task', tag: '@longer-task', text: 'This is another task' },
  ],
  // start task timer
  ['b 10', { command: 'b', id: '10' }],
  ['begin 12', { command: 'begin', id: '12' }],
  // check task as done
  ['c 7', { command: 'c', id: '7' }],
  ['check 9', { command: 'check', id: '9' }],
  // delete a task
  ['d 1', { command: 'd', id: '1' }],
  ['delete 3', { command: 'delete', id: '3' }],
  ['delete 3 5 79', { command: 'delete', id: '3 5 79' }],
  ['delete @tag', { command: 'delete', id: '@tag' }],
  ['delete done', { command: 'delete', id: 'done' }],
  // edit a task
  [
    'e 1 this is a new task description',
    { command: 'e', id: '1', text: 'this is a new task description' },
  ],
  [
    'edit 1 a new task description goes here',
    { command: 'edit', id: '1', text: 'a new task description goes here' },
  ],
  // archive a task
  ['a 1', { command: 'a', id: '1' }],
  ['archive 3', { command: 'archive', id: '3' }],
  ['archive 3 5 79', { command: 'archive', id: '3 5 79' }],
  ['archive @tag', { command: 'archive', id: '@tag' }],
  ['archive done', { command: 'archive', id: 'done' }],
  // move task to new tag
  ['mv 2 @new-tag', { command: 'mv', id: '2', tag: '@new-tag' }],
  [
    'move 3 @uncategorized',
    { command: 'move', id: '3', tag: '@uncategorized' },
  ],
  // flag a task
  ['fl 2', { command: 'fl', id: '2' }],
  ['flag 2', { command: 'flag', id: '2' }],
  // stop timer
  ['st 1', { command: 'st', id: '1' }],
  ['stop 1', { command: 'stop', id: '1' }],
  // switch task
  ['switch 13 12', { command: 'switch', id: '13 12' }],
  ['sw 1 2', { command: 'sw', id: '1 2' }],
  // other command
  ['help', { command: 'help' }],
  ['quickhelp', { command: 'quickhelp' }],
  ['today', { command: 'today' }],
  ['dark', { command: 'dark' }],
  ['light', { command: 'light' }],
  ['customize', { command: 'customize' }],
  ['list-archived', { command: 'list-archived' }],
];

tests.forEach(([input, expected]) => {
  test(input, t => {
    const result = parseCommand(input);
    t.equal(expected.command, result.command, 'should be correct command');
    t.is(expected.tag, result.tag, 'should have correct tag or tags');
    t.is(expected.text, result.text, 'should have correct text');
    t.is(expected.id, result.id, 'should have correct id or ids');
    t.end();
  });
});
