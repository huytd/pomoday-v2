import * as React from 'react';
import { StateContext } from './App';
import { KEY_RETURN } from '../helpers/utils';

export const CodeEditor = props => {
  const [state, setState] = React.useContext(StateContext);
  const customCSSRef = React.useRef(null);

  const updateCustomCSS = () => {
    if (customCSSRef && customCSSRef.current) {
      setState({
        ...state,
        customCSS: customCSSRef.current.value,
      });
    }
  };

  const processEnterKey = e => {
    if (customCSSRef && customCSSRef.current) {
      const el = customCSSRef.current;
      const key = e.which || e.keyCode;
      if (key === KEY_RETURN) {
        const pos = el.selectionStart;
        const txt = el.value;
        const lines = txt.substr(0, pos).split('\n');
        const lineNr = lines.length;
        const prevLine = lines[lineNr - 1];
        const spaces = (prevLine.match(/^\s+/) || [0])[0].length || 0;
        if (spaces) {
          const indent = Array(spaces + 1).join(' ');
          const left = txt.substr(0, pos);
          const right = txt.substr(pos);
          const newPos = pos + spaces + 1;
          el.value = left + '\n' + indent + right;
          el.selectionStart = newPos;
          el.selectionEnd = newPos;
          e.preventDefault();
        }
      }
    }
  };

  const closeDialog = () => {
    setState({
      ...state,
      showCustomCSS: false,
    });
  };

  return (
    <>
      <div className={'block sm:hidden fixed bottom-0 right-0 m-5 z-50'}>
        <button
          onClick={closeDialog}
          className={
            'sm:hidden text-3xl bg-tomato text-white rounded-full shadow-lg w-16 h-16'
          }>
          ✕
        </button>
      </div>
      <div className={'flex-1 flex flex-col'}>
        <div className="mb-4">
          <div className="el-sideview-header text-stall-dim font-bold text-lg">
            Customization
          </div>
        </div>
        <textarea
          ref={customCSSRef}
          onKeyPress={processEnterKey}
          onChange={updateCustomCSS}
          className="flex-1 bg-transparent resize-none focus:outline-none"
          placeholder="Enter custom CSS styles here..."
          value={state.customCSS}
        />
      </div>
    </>
  );
};
