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

  return (
    <textarea
      ref={customCSSRef}
      onKeyPress={processEnterKey}
      onChange={updateCustomCSS}
      className="flex-1 bg-transparent resize-none"
      placeholder="Enter custom CSS styles here...">
      {state.customCSS}
    </textarea>
  );
};
