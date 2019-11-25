import * as React from 'react';
import { StateContext } from './App';
import { useInterval } from '../helpers/hooks';
import { SYNC_TIMER } from '../helpers/utils';

export const SyncStatus = props => {
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
      <div className="flex flex-row text-xs py-1 px-2 bg-control justify-end border-b border-stall-light">
        {state.authToken ? (
          <div className={'mx-3 flex flex-row'}>
            <div
              className={'w-2 h-2 bg-green rounded-full block self-center'}
            />
            <div className={'text-stall-dim self-center ml-2'}>
              server connected
            </div>
          </div>
        ) : null}
        {state.lastSync ? (
          <div className={'mx-3 flex flex-row'}>
            <div
              className={
                'w-2 h-2 rounded-full block self-center ' +
                lastSyncColor(duration)
              }
            />
            <div className={'text-stall-dim self-center ml-2'}>
              Last Synced: {new Date(state.lastSync).toLocaleTimeString()}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
