import * as React from 'react';
import { KEY_ESC } from '../helpers/utils';
import { StateContext } from './App';
import marked from 'marked';
import { useEventListener } from '../helpers/hooks';

const QUICK_HELP_TEXT = [
  "<img src='https://pomoday-cdn.now.sh/logo.png' style='border: none; box-shadow: none; width: 50%; margin: 10px auto;' /><p style='margin: 5px 0;'>Welcome to Pomoday, a keyboard-only task management application that help you be more productive!</p><p style='margin: 5px 0;'>Let's get started!</p>",
  '**#1:** Type any key to start.\n![](https://pomoday-cdn.now.sh/quickhelp/quickhelp-01.gif)',
  '**#2:** Type `t` or `task` to create a new task.\n![](https://pomoday-cdn.now.sh/quickhelp/quickhelp-02.gif)',
  '**#3:** You can start a task timer with `b` or `begin` command. Stop it with `st` or `stop` command.\n![](https://pomoday-cdn.now.sh/quickhelp/quickhelp-03.gif)',
  '**#4:** You can flag a task with `fl` or `flag`. Or delete it with `d` or `delete` command.\n![](https://pomoday-cdn.now.sh/quickhelp/quickhelp-04.gif)',
  "🎉 That's all of the basic you need! You can type `help` to learn more about Pomoday anytime! Now press `ESC` to close this help and go try it yourself!",
];

export const QuickHelp = props => {
  const [state, setState] = React.useContext(StateContext);
  const [page, setPage] = React.useState(0);

  const nextPage = () => {
    if (page < QUICK_HELP_TEXT.length - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const closeHelp = () => {
    setState({
      ...state,
      showQuickHelp: false,
    });
  };

  const processKey = e => {
    if (e.keyCode === KEY_ESC) {
      closeHelp();
    }
    if (
      e.key === 'j' ||
      e.key === 'l' ||
      e.key === 'ArrowDown' ||
      e.key === 'ArrowLeft'
    ) {
      nextPage();
    }
    if (
      e.key === 'k' ||
      e.key === 'h' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowRight'
    ) {
      prevPage();
    }
  };

  useEventListener('keyup', processKey);

  return (
    <div className="el-backdrop overflow-hidden absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
      <div className="bg-background relative rounded-lg shadow-lg p-5 w-auto m-10 sm:m-0 sm:w-3/12 h-auto">
        <div className={'block sm:hidden fixed bottom-0 right-0 m-5 z-50'}>
          <button
            onClick={closeHelp}
            className={
              'sm:hidden text-3xl bg-tomato text-white rounded-full shadow-lg w-16 h-16'
            }>
            ✕
          </button>
        </div>
        <div
          className={'markdown-content relative flex flex-col el-quickhelp'}
          dangerouslySetInnerHTML={{ __html: marked(QUICK_HELP_TEXT[page]) }}
        />
        <div
          className={
            'border-t hidden sm:block border-control pt-3 text-xs text-stall-dim'
          }>
          Press <b>J</b>/<b>K</b> or <b>UP</b>/<b>DOWN</b> for next/previous
          pages. <b>ESC</b> to close this help.
        </div>
        <div className={'border-t sm:hidden border-control pt-3 text-xs'}>
          <div className={'flex flex-row'}>
            {page < QUICK_HELP_TEXT.length - 1 ? (
              <>
                <button
                  onClick={prevPage}
                  className={'flex-1 bg-stall-light py-2 mx-1 rounded-lg'}>
                  &lt; Previous
                </button>
                <button
                  onClick={nextPage}
                  className={'flex-1 bg-stall-light py-2 mx-1 rounded-lg'}>
                  Next &gt;
                </button>
              </>
            ) : (
              <button
                onClick={closeHelp}
                className={'flex-1 bg-stall-light py-2 mx-1 rounded-lg'}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
