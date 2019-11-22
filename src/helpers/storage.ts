import * as firebase from 'firebase/app';
import 'firebase/firestore';

import {
    TaskItem,
    getHistoryQueue,
} from './utils';
import Queue from './queue';

interface PomoState {
    tasks: TaskItem[];
    showHelp: boolean;
    showToday: boolean;
    darkMode: boolean;
    sawTheInput: boolean;
    taskVisibility: {
        done: boolean;
        flagged: boolean;
        wait: boolean;
        wip: boolean;
    };
    history: Queue<string>;
    showCustomCSS: boolean;
    customCSS: string;
    showArchived: boolean;
}

export interface StorageAdapter {
    update(data: PomoState): void;
    /**
     * For changes from outside (other app instance, manually edit storage) only
     * and calling update from current app won't trigger this event
     * 
     * This should call handler first time to pass current state
     *
     * @param handler
     */
    onChange(handler: (data: PomoState) => void): void;
    offChange(): void;
}

export const defaultState: PomoState = {
    tasks: [] as TaskItem[],
    showHelp: true,
    showToday: false,
    darkMode: false,
    sawTheInput: false,
    taskVisibility: {
        done: true,
        flagged: true,
        wait: true,
        wip: true,
    },
    history: getHistoryQueue(),
    showCustomCSS: false,
    customCSS: '',
    showArchived: false,
};

function normalizeState(state: PomoState): PomoState {
    state = { ...state };
    for (let key in defaultState) {
        if (!state.hasOwnProperty(key)) {
            state[key] = defaultState[key];
        }
    }
    return state;
}

export class LocalStorageAdapter implements StorageAdapter {
    private state: PomoState;
    private key: string;
    private handler?: (data: PomoState) => void;
    private handleWrapper: (e: StorageEvent) => void;

    constructor(key: string) {
        this.key = key;

        this.handleWrapper = (e) => {
            if (e.key !== this.key) { return }

            this.state = this.getInitialState(e.newValue);
            this.handler && this.handler(this.state);
        };

        window.addEventListener('storage', this.handleWrapper);
        this.state = this.getInitialState();
    }

    update(data: PomoState) {
        window.localStorage.setItem(this.key, JSON.stringify(data));
        this.state = data;
    }

    onChange(handler: (data: PomoState) => void) {
        this.handler = handler;
        handler(this.state);
    }

    offChange() {
        this.handler = null;
    }

    private getInitialState(state?: string) {
        const saved = state || window.localStorage.getItem(this.key);

        if (!saved) {
            return defaultState;
        }

        try {
            const parsed = JSON.parse(saved);
            if (parsed) {
                return normalizeState(parsed);
            }
        } catch { }

        return defaultState;
    }
}

export class FirebaseStorageAdapter implements StorageAdapter {
    private state: PomoState;
    private handler?: (data: PomoState) => void;
    private handleWrapper: (snapshot: firebase.firestore.DocumentSnapshot) => void;
    private ref: firebase.firestore.DocumentReference;

    constructor(firebaseConfig) {
        this.state = defaultState;

        firebase.initializeApp(firebaseConfig);

        this.handleWrapper = (doc: firebase.firestore.DocumentSnapshot) => {
            const data = doc.data() as PomoState;
            this.state = normalizeState(data);
            this.handler && this.handler(this.state);
        }

        this.ref = firebase.firestore().collection('pomoday').doc('doc');
        this.ref.onSnapshot(this.handleWrapper)
    }

    update(data: PomoState) {
        if (data === defaultState) { return }
        this.ref.set(JSON.parse(JSON.stringify(data)));
    }

    onChange(handler: (data: PomoState) => void) {
        this.handler = handler;
        handler(this.state);
    }

    offChange(): void {
        this.handler = null;
    }
}
