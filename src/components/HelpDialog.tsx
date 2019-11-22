import * as React from 'react';
import { KEY_ESC } from '../helpers/utils';
import { StateContext } from './App';
import marked from 'marked';

const HELP_TEXT = `
# How to use

At the bottom of the screen is the **command bar**, you can press \`i\` or \`tab\` to focus on it.

Everything you can do in Pomoday are done via this command bar, let me teach you some basic commands:

## Working with tasks

Remember when I said Pomoday is a task management app? So the first thing we will talk about is task management!

### Create a task

You can create a task by start typing \`t\` or \`task\` command, followed by a \`tag\`, and a task description. 
If you skip the tag, your task will be created as an \`@uncategorized\` tag.

For example:

\`\`\`
t @work Setup a meeting with Mr. Baldhead
or
task Call utility company
\`\`\`    

The number before each task is the task's \`id\`, you'll need this \`id\` for the other commands below.

### Edit or delete

To edit the content of a task, you can use \`e\` or \`edit\` command, using the following syntax:

\`\`\`
e 5 new task description here
or
edit 5 new task description here
\`\`\`

To delete a task, just use \`d\` or \`delete\` command, you can delete multiple tasks at once, or just a single task:

\`\`\`
d 1
or
delete 2 5 4
\`\`\`

You can also delete a task using its status, like \`done\`, \`wait\`, \`wip\`,...

### Move task to another tag

Sometimes, you might want to change the tag of a task, for example, if you have an \`@uncategorized\` task, and later on you want to put it into \`@work\`, you can use the \`move\` or \`mv\` command:

\`\`\`
move 5 @new-tag
or 
mv 5 @new-tag
\`\`\`

But for this, you'll have to do it task by task, what if you want to move a huge amount of tasks at once?

### Rename a tag

You can use \`tagre\` or \`tagrename\` or \`tr\` to rename a tag to another name:

\`\`\`
tr @old-tag @new-tag
or
tagre @old-tag @new-tag
or
tagrename @old-tag @new-tag
\`\`\`

Next, we'll see how to archive a task.

### Archive a task

You might want to archive a task if there is a lot of tasks on the screen already and most of them are not needed anymore (done tasks,...), but you don't want to delete them.

The two commands \`archive\` (or \`a\`) and \`restore\` (or \`re\`) will help you on this:

\`\`\`
# Archive a task
archive 1
or
a 56

# Restore archived task
re 50
restore 1
\`\`\`

You can see all of your archived tasks with the \`list-archived\` command.

## Time tracking

Pomoday come with a built-in time tracker, you can start the timer for each task separately using \`begin\` (or \`b\`) command.
When the timer is running, you can stop it using \`stop\` (or \`st\`) command. Marking a task as done (\`check\` or \`c\`) or
flag it (\`flag\` or \`fl\`) will also stop the timer.

Start a timer for one or multiple tasks:

\`\`\`
b 5
or
begin 3 9 23
\`\`\`

Stop the timer for one or multiple tasks:

\`\`\`
st 5
or
stop 3 9 23
\`\`\`

Mark a task as finished:

\`\`\`
c 9
or
check 1 2 5
\`\`\`

That's everything you need to know about Pomoday!

## Other commands

- – You can customize the UI using CSS via \`customize\` command.
- – Show a timeline to get an overview of your day with \`today\` command.
- – Toggle the visibility of tasks based on its status by typing \`show\` or \`hide\` following with a task status (\`done\`, \`wip\`, \`\flagged\`, \`wait\`,...).

`;

const TOC_TEXT = `
## Table of Contents

1. [Working with tasks](#working-with-tasks)
  - 1.1 [Create a task](#create-a-task)
  - 1.2 [Edit or delete](#edit-or-delete)
  - 1.3 [Move task to another tag](#move-task-to-another-tag)
  - 1.4 [Rename a tag](#rename-a-tag)
  - 1.5 [Archive a task](#archive-a-task)
2. [Time tracking](#time-tracking)
3. [Other commands](#other-commands)

`;

/*

      <br />
      &nbsp; <b>t</b> or <b>task</b>&nbsp;&nbsp;&nbsp; Add a new task
      <br />
      &nbsp; <b>b</b> or <b>begin</b>&nbsp;&nbsp; Start working on a
      task
      <br />
      &nbsp; <b>c</b> or <b>check</b>&nbsp;&nbsp; Check to mark a task
      as done
      <br />
      &nbsp; <b>d</b> or <b>delete</b>&nbsp; Delete a task
      <br />
      &nbsp; <b>e</b> or <b>edit</b>&nbsp; Edit a task title
      <br />
      &nbsp; <b>mv</b> or <b>move</b>&nbsp;&nbsp; Move a task to another
      tag
      <br />
      &nbsp; <b>fl</b> or <b>flag</b>&nbsp;&nbsp; Toggle a flag
      <br />
      &nbsp; <b>st</b> or <b>stop</b>&nbsp;&nbsp; Stop working on a task
      <br />
      &nbsp; <b>tr</b> or <b>tagre</b> or <b>tagrename</b> @tag-a
      @tag-b: Rename a tag
      <br />
      &nbsp; <b>today</b>: Show/hide today's activities
      <br />
      &nbsp; <b>dark</b>: Enable dark mode
      <br />
      &nbsp; <b>light</b>: Enable light mode
      <br />
      <br />
      Example:
      <br />
      &nbsp; <code>t @work This is a new task</code>
      <br />
      &nbsp; <code>task @longer-tag This is another task</code>
      <br />
      &nbsp; <code>b 10</code> or <code>begin 12</code>
      <br />
      &nbsp; <code>c 7</code>&nbsp; or <code>check 9</code>
      <br />
      &nbsp; <code>d 3</code>&nbsp; or <code>delete 3</code>
      <br />
      &nbsp; <code>e 1 this is a new task description</code>
      <br />
      &nbsp; <code>mv 2 @new-tag</code> or{' '}
      <code>move 2 @uncategorized</code>
      <br />
      &nbsp; <code>fl 2</code> or <code>flag 2</code>
      <br />
      &nbsp; <code>st 1</code> or <code>stop 1</code>
      <br />
      &nbsp; <code>edit 1 a new task description goes here</code>
      <br />
      &nbsp; <code>tr @work @play</code>
      <br />
      <br />
      Other commands:
      <br />
      &nbsp; <b>close-help</b>: Close this help text
      <br />
      &nbsp; <b>help</b>: Show this help text
      <br />

 */

export const HelpDialog = props => {
  const [state, setState] = React.useContext(StateContext);

  const processKey = e => {
    if (e.keyCode === KEY_ESC) {
      setState({
        ...state,
        showHelp: false,
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener('keyup', processKey, false);

    return () => {
      document.removeEventListener('keyup', processKey, false);
    };
  }, []);

  return (
    <div className="el-sideview bg-white overflow-hidden p-10 mb-5 text-left absolute top-0 left-0 right-0 bottom-0">
      <div className="flex flex-row h-full">
        <div className="markdown-content h-full lg:w-3/5 text-justify overflow-y-auto">
          <div dangerouslySetInnerHTML={{ __html: marked(HELP_TEXT) }} />
        </div>
        <div
          style={{ transition: 'all 0.5s' }}
          className="markdown-content opacity-50 hover:opacity-100 flex-1 ml-5 text-justify flex flex-col">
          <div
            className={'flex-1'}
            dangerouslySetInnerHTML={{ __html: marked(TOC_TEXT) }}
          />
          <div className={'text-xs'}>
            Enter <code>close-help</code> or press <code>ESC</code> to close
            this help.
          </div>
        </div>
      </div>
    </div>
  );
};
