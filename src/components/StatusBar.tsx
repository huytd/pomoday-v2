import * as React from 'react';
import { StateContext } from './App';
import { useInterval } from '../helpers/hooks';
import { SYNC_TIMER } from '../helpers/utils';

export const StatusBar = props => {
  const [state, setState] = React.useContext(StateContext);
  const [duration, setDuration] = React.useState(0);

  useInterval(
    () => {
      setDuration(Date.now() - state.lastSync);
    },
    state.authToken ? 1000 : 0,
  );

  const lastSyncColor = duration => {
    if (duration < SYNC_TIMER / 2) {
      return 'bg-green';
    }
    if (duration > SYNC_TIMER / 2 && duration < SYNC_TIMER) {
      return 'bg-orange';
    }
    if (duration > SYNC_TIMER) {
      return 'bg-tomato';
    }
  };

  return (
    <>
      <div className="el-app-header flex flex-row text-xs py-1 px-2 bg-control justify-start border-b border-stall-light">
        <div className={'flex-1'}></div>
        {state.authToken && state.lastSync ? (
          <div className={'mx-3 flex flex-row'}>
            <div
              className={
                'w-2 h-2 rounded-full block self-center ' +
                lastSyncColor(duration)
              }
            />
            <div className={'text-stall-dim self-center ml-2'}>
              Last synced: {new Date(state.lastSync).toLocaleTimeString()}
            </div>
          </div>
        ) : null}
        <div className={'mx-3 flex flex-row'}>
          <div className="flex items-center justify-between xl:w-1/4">
            <div className="flex justify-start items-center text-stall-dim">
              <a
                className="hidden flex items-center hover:text-gray-700 mr-4"
                target={'_blank'}
                rel={'nofollow'}
                href="#">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <title>Powerpack</title>
                  <path d="M13,8 L13,0 L3,12 L7,12 L7,20 L17,8 L13,8 Z"></path>
                </svg>
              </a>
              <a
                className="block flex items-center hover:text-gray-700 mr-4"
                target={'_blank'}
                rel={'nofollow'}
                href="https://github.com/huytd/pomoday-v2">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <title>GitHub</title>
                  <path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"></path>
                </svg>
              </a>
              <a
                className="block flex items-center hover:text-gray-700 mr-4"
                target={'_blank'}
                rel={'nofollow'}
                href="https://twitter.com/pomoday_app">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <title>Twitter</title>
                  <path d="M6.29 18.25c7.55 0 11.67-6.25 11.67-11.67v-.53c.8-.59 1.49-1.3 2.04-2.13-.75.33-1.54.55-2.36.65a4.12 4.12 0 0 0 1.8-2.27c-.8.48-1.68.81-2.6 1a4.1 4.1 0 0 0-7 3.74 11.65 11.65 0 0 1-8.45-4.3 4.1 4.1 0 0 0 1.27 5.49C2.01 8.2 1.37 8.03.8 7.7v.05a4.1 4.1 0 0 0 3.3 4.03 4.1 4.1 0 0 1-1.86.07 4.1 4.1 0 0 0 3.83 2.85A8.23 8.23 0 0 1 0 16.4a11.62 11.62 0 0 0 6.29 1.84"></path>
                </svg>
              </a>
              <a
                className="block flex items-center hover:text-gray-700"
                target={'_blank'}
                rel={'nofollow'}
                href="https://github.com/huytd/pomoday-v2/wiki">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <title>Help</title>
                  <path d="M10,0.4c-5.302,0-9.6,4.298-9.6,9.6s4.298,9.6,9.6,9.6c5.301,0,9.6-4.298,9.6-9.601 C19.6,4.698,15.301,0.4,10,0.4z M9.849,15.599H9.798c-0.782-0.023-1.334-0.6-1.311-1.371c0.022-0.758,0.587-1.309,1.343-1.309 l0.046,0.002c0.804,0.023,1.35,0.594,1.327,1.387C11.18,15.068,10.625,15.599,9.849,15.599z M13.14,9.068 c-0.184,0.26-0.588,0.586-1.098,0.983l-0.562,0.387c-0.308,0.24-0.494,0.467-0.563,0.688c-0.056,0.174-0.082,0.221-0.087,0.576v0.09 H8.685l0.006-0.182c0.027-0.744,0.045-1.184,0.354-1.547c0.485-0.568,1.555-1.258,1.6-1.287c0.154-0.115,0.283-0.246,0.379-0.387 c0.225-0.311,0.324-0.555,0.324-0.793c0-0.334-0.098-0.643-0.293-0.916c-0.188-0.266-0.545-0.398-1.061-0.398 c-0.512,0-0.863,0.162-1.072,0.496c-0.216,0.341-0.325,0.7-0.325,1.067v0.092H6.386L6.39,7.841c0.057-1.353,0.541-2.328,1.435-2.897 C8.388,4.583,9.089,4.4,9.906,4.4c1.068,0,1.972,0.26,2.682,0.772c0.721,0.519,1.086,1.297,1.086,2.311 C13.673,8.05,13.494,8.583,13.14,9.068z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
