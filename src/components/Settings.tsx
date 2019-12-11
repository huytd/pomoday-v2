import * as React from 'react';
import { KEY_ESC } from '../helpers/utils';
import { StateContext } from './App';
import { useEventListener } from '../helpers/hooks';

export const Settings = props => {
  const [state, setState] = React.useContext(StateContext);

  const close = () => {
    setState({
      ...state,
      showSettings: false,
    });
  };

  const processKey = e => {
    if (e.keyCode === KEY_ESC) {
      close();
    }
  };

  useEventListener('keyup', processKey);

  return (
    <div className="el-backdrop overflow-hidden absolute top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
      <div className="bg-background relative rounded-lg shadow-lg p-5 m-10 sm:m-0 w-8/12 lg:w-3/12 h-auto">
        <div className={'block sm:hidden fixed bottom-0 right-0 m-5 z-50'}>
          <button
            onClick={close}
            className={
              'sm:hidden text-3xl bg-tomato text-white rounded-full shadow-lg w-16 h-16'
            }>
            ✕
          </button>
        </div>
        <h1 className={'text-lg font-bold mb-5'}>Settings</h1>
        {/* Dark mode */}
        {/*<div className={"block flex flex-row mt-3"}>*/}
        {/*  <span className={"mr-5"}>Use system preference for Dark Mode</span>*/}
        {/*  <input type={"checkbox"} checked={state.settings.autoDarkMode} onChange={(e) => {*/}
        {/*    setState({*/}
        {/*      ...state,*/}
        {/*      settings: {*/}
        {/*        ...state.settings,*/}
        {/*        autoDarkMode: e.target.checked*/}
        {/*    }*/}
        {/*  });*/}
        {/*  }} />*/}
        {/*</div>*/}
        {/*<div className={"block flex text-xs flex-row text-stall-dim"}>Automatically turn Dark Mode on or off when your system changes.</div>*/}
        {/* Sticky input */}
        <div className={'block flex flex-row mt-3'}>
          <span className={'mr-5'}>Sticky Input Box</span>
          <input
            type={'checkbox'}
            checked={state.settings.stickyInput}
            onChange={e => {
              setState({
                ...state,
                settings: {
                  ...state.settings,
                  stickyInput: e.target.checked,
                },
              });
            }}
          />
        </div>
        <div className={'block flex text-xs flex-row text-stall-dim'}>
          Always show the command input at the bottom of the screen
        </div>
        {/* Command hint box */}
        <div className={'block flex flex-row mt-3'}>
          <span className={'mr-5'}>Display command hint popup</span>
          <input
            type={'checkbox'}
            checked={state.settings.hintPopup}
            onChange={e => {
              setState({
                ...state,
                settings: {
                  ...state.settings,
                  hintPopup: e.target.checked,
                },
              });
            }}
          />
        </div>
        <div className={'block flex text-xs flex-row text-stall-dim'}>
          Display the command hint box at the bottom right of the screen
        </div>

        {/* End of settings */}
        <div className={'block border-t border-stall-light pt-5 mt-5'}>
          All settings are automatically saved. Press <code>ESC</code> to close
          this dialog.
        </div>
      </div>
    </div>
  );
};
