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
    if (duration < SYNC_TIMER) {
      return 'text-green';
    }
  };

  return (
    <>
      <div className="el-app-header flex flex-row text-xs py-1 px-2 bg-control justify-start border-b border-stall-light">
        <div className={'flex-1'}></div>
        <div className={'mx-3 flex flex-row'}>
          <div className="flex items-center py-1 justify-between xl:w-1/4">
            <div className="flex justify-start items-center text-stall-dim">
              {state.authToken && state.lastSync ? (
                <a
                  className={`block flex items-center hover:text-gray-700 ml-4 ${lastSyncColor(
                    duration,
                  )}`}
                  title={
                    'Last synced at ' +
                    new Date(state.lastSync).toLocaleTimeString()
                  }
                  target={'_blank'}
                  rel={'nofollow'}
                  href="#">
                  <svg
                    className="fill-current w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <g stroke="none" stroke-width="1" fill-rule="evenodd">
                      <g>
                        <path d="M16.8792928,9.09695343 C18.6654343,9.4976045 20,11.09295 20,13 C20,15.209139 18.209139,17 16,17 L5,17 C2.23857625,17 0,14.7614237 0,12 C0,9.58046798 1.71857515,7.56233069 4.00162508,7.09968852 C4.00054449,7.06659179 4,7.03335948 4,7 C4,5.34314575 5.34314575,4 7,4 C7.55384606,4 8.07263826,4.1500834 8.51792503,4.41179863 C9.4182103,3.53797709 10.6462795,3 12,3 C14.7614237,3 17,5.23857625 17,8 C17,8.37684164 16.9583108,8.74394625 16.8792928,9.09695343 Z"></path>
                      </g>
                    </g>
                  </svg>
                </a>
              ) : null}
              <a
                className="hidden flex items-center hover:text-gray-700 ml-4"
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
                className="block flex items-center hover:text-gray-700 ml-4"
                title={'Source code'}
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
                className="block flex items-center hover:text-gray-700 ml-4"
                title={'Follow us on Twitter'}
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
                className="block flex items-center hover:text-gray-700 ml-4"
                title={'Help'}
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
              <a
                className="block flex items-center hover:text-gray-700 ml-4"
                title={'Report a bug'}
                target={'_blank'}
                rel={'nofollow'}
                href="https://github.com/huytd/pomoday-v2/issues/new">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <title>Report a bug</title>
                  <g stroke="none" stroke-width="1" fill-rule="evenodd">
                    <g>
                      <path d="M15.3045988,14.8903852 C15.6126191,14.3102059 15.8280494,13.673533 15.9310427,13 L18.9970707,13 C19.5621186,13 20,12.5522847 20,12 C20,11.4438648 19.5509732,11 18.9970707,11 L16,11 L16,8.41421356 L19.0722962,5.3419174 C19.4582903,4.95592323 19.4615921,4.31945648 19.0710678,3.92893219 C18.6778209,3.53568523 18.0479285,3.53785794 17.6580826,3.92770383 L15.5608261,6.02496034 L4.4391739,6.02496034 L2.3419174,3.92770383 C1.95592323,3.54170967 1.31945648,3.5384079 0.928932188,3.92893219 C0.535685233,4.32217914 0.537857944,4.95207151 0.927703834,5.3419174 L4,8.41421356 L4,11 L1.00292933,11 C0.437881351,11 0,11.4477153 0,12 C0,12.5561352 0.449026756,13 1.00292933,13 L4.06906435,13 C4.17211321,13.6730161 4.38756247,14.3096774 4.69570598,14.8900805 L1.92770383,17.6580826 C1.54170967,18.0440768 1.5384079,18.6805435 1.92893219,19.0710678 C2.32217914,19.4643148 2.95207151,19.4621421 3.3419174,19.0722962 L5.92661633,16.4875972 C6.76466839,17.2628271 7.82437108,17.8025933 9,18.0001127 L9,9.03992409 C9,8.48397016 9.44386482,8.03328045 10,8.03328045 C10.5522847,8.03328045 11,8.4909374 11,9.03992409 L11,18.0000473 C12.1747032,17.8025694 13.2348613,17.26319 14.0735097,16.4877232 L16.6580826,19.0722962 C17.0440768,19.4582903 17.6805435,19.4615921 18.0710678,19.0710678 C18.4643148,18.6778209 18.4621421,18.0479285 18.0722962,17.6580826 L15.3045988,14.8903852 L15.3045988,14.8903852 Z M15,5 C15,2.23857625 12.7614237,0 10,0 C7.23857625,0 5,2.23857625 5,5 L15,5 Z"></path>
                    </g>
                  </g>
                </svg>
              </a>
              <a
                className="hidden flex items-center hover:text-gray-700 ml-4"
                title={'Setting'}
                target={'_blank'}
                rel={'nofollow'}
                href="#">
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <title>Setting</title>
                  <g stroke="none" stroke-width="1" fill-rule="evenodd">
                    <g>
                      <path d="M3.93830521,6.49683865 C3.63405147,7.02216933 3.39612833,7.5907092 3.23599205,8.19100199 L5.9747955e-16,9 L9.6487359e-16,11 L3.23599205,11.808998 C3.39612833,12.4092908 3.63405147,12.9778307 3.93830521,13.5031614 L2.22182541,16.363961 L3.63603897,17.7781746 L6.49683865,16.0616948 C7.02216933,16.3659485 7.5907092,16.6038717 8.19100199,16.7640079 L9,20 L11,20 L11.808998,16.7640079 C12.4092908,16.6038717 12.9778307,16.3659485 13.5031614,16.0616948 L16.363961,17.7781746 L17.7781746,16.363961 L16.0616948,13.5031614 C16.3659485,12.9778307 16.6038717,12.4092908 16.7640079,11.808998 L20,11 L20,9 L16.7640079,8.19100199 C16.6038717,7.5907092 16.3659485,7.02216933 16.0616948,6.49683865 L17.7781746,3.63603897 L16.363961,2.22182541 L13.5031614,3.93830521 C12.9778307,3.63405147 12.4092908,3.39612833 11.808998,3.23599205 L11,0 L9,0 L8.19100199,3.23599205 C7.5907092,3.39612833 7.02216933,3.63405147 6.49683865,3.93830521 L3.63603897,2.22182541 L2.22182541,3.63603897 L3.93830521,6.49683865 L3.93830521,6.49683865 Z M10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 L10,13 Z"></path>
                    </g>
                  </g>
                </svg>
              </a>
              {state.authToken && state.userName ? (
                <div className={'block ml-4 px-2 bg-white rounded-lg'}>
                  {state.userName}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
