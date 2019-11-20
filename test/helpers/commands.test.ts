import * as test from 'tape';
import { Command, parseCommand } from '../../src/helpers/commands/parser';

const tests: [string, Command][] = [
  [
    't @work This is a new task',
    { command: 't', tag: '@work', text: 'This is a new task' },
  ],
  [
    'task @longer-task This is another task',
    { command: 'task', tag: '@longer-task', text: 'This is another task' },
  ],
  ['b 10', { command: 'b', id: '10' }],
  ['begin 12', { command: 'begin', id: '12' }],
  ['c 7', { command: 'c', id: '7' }],
  ['check 9', { command: 'check', id: '9' }],
  ['d 1', { command: 'd', id: '1' }],
  ['delete 3', { command: 'delete', id: '3' }],
  [
    'e 1 this is a new task description',
    { command: 'e', id: '1', text: 'this is a new task description' },
  ],
  [
    'edit 1 a new task description goes here',
    { command: 'edit', id: '1', text: 'a new task description goes here' },
  ],
  ['mv 2 @new-tag', { command: 'mv', id: '2', tag: '@new-tag' }],
  [
    'move 3 @uncategorized',
    { command: 'move', id: '3', tag: '@uncategorized' },
  ],
  ['fl 2', { command: 'fl', id: '2' }],
  ['flag 2', { command: 'flag', id: '2' }],
  ['st 1', { command: 'st', id: '1' }],
  ['stop 1', { command: 'stop', id: '1' }],
  ['help', { command: 'help' }],
  ['close-help', { command: 'close-help' }],
  ['today', { command: 'today' }],
  ['dark', { command: 'dark' }],
  ['light', { command: 'light' }],
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
