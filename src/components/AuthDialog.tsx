import * as React from 'react';
import { StateContext } from './App';
import { KEY_ESC } from '../helpers/utils';
import { authenticateUser } from '../helpers/api';

enum UIAuthState {
  WAIT,
  LOADING,
}

export const AuthDialog = props => {
  const [state, setState] = React.useContext(StateContext);
  const [uiState, setUIState] = React.useState({
    status: UIAuthState.WAIT,
    errorMessage: '',
  });
  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const serverRef = React.useRef(null);

  const doLogin = () => {
    const username =
      usernameRef && usernameRef.current && usernameRef.current.value;
    const password =
      passwordRef && passwordRef.current && passwordRef.current.value;
    const server = serverRef && serverRef.current && serverRef.current.value;
    if (username && password && server) {
      setUIState({
        status: UIAuthState.LOADING,
        errorMessage: '',
      });
      authenticateUser(username, password, server)
        .then(authToken => {
          setState({
            ...state,
            authToken: authToken,
            userWantToLogin: false,
            serverUrl: server,
          });
        })
        .catch(() => {
          setUIState({
            status: UIAuthState.WAIT,
            errorMessage:
              'Failed to login. Please check your username, password and server, then try again.',
          });
        });
    } else {
      setUIState({
        status: UIAuthState.WAIT,
        errorMessage: 'Please fill out all the information above.',
      });
    }
  };

  const processKey = e => {
    if (e.keyCode === KEY_ESC) {
      setState({
        ...state,
        userWantToLogin: false,
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
    <div className="bg-white p-5 text-left absolute top-0 left-0 right-0 bottom-0">
      {uiState.status === UIAuthState.WAIT ? (
        <>
          <div className={'p-3'}>
            Please enter your username as password here:
          </div>
          <div className={'p-3 inline-block'}>
            <div className={'my-2 flex flex-row'}>
              <span className={'w-4/12'}>Username:</span>
              <input
                ref={usernameRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'text'}
              />
            </div>
            <div className={'my-2 flex flex-row'}>
              <span className={'w-4/12'}>Password:</span>
              <input
                ref={passwordRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'password'}
              />
            </div>
            <div className={'my-2 flex flex-row'}>
              <span className={'w-4/12'}>Server:</span>
              <input
                ref={serverRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'text'}
                defaultValue={process.env.API_URL || ''}
              />
            </div>
            <div className={'my-2 float-right'}>
              <button
                onClick={doLogin}
                className={'px-5 py-1 bg-green text-white'}>
                Login
              </button>
            </div>
          </div>
          <div className={'p-3 text-tomato'}>{uiState.errorMessage}</div>
          <div className={'p-3'}>
            After login, your data will be automatically synced to the server.
            <br />
            Press <code>ESC</code> key to cancel login and close this dialog.
          </div>
        </>
      ) : null}
      {uiState.status === UIAuthState.LOADING ? (
        <div className={'p-3'}>Connecting to server...</div>
      ) : null}
    </div>
  );
};
