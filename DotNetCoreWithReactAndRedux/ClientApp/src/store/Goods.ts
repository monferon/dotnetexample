import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface GoodsState {
    isLoading: boolean;
    startDateIndex?: number;
    goods: Goods[];
}

export interface Goods {
    id: number;
    name: string;
    count: number;
    idCategories: number;
    productInfo: string;
    info: Info[];

}

export interface Info {
    id: number;
    dt: Date;
    price: number;
}


// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestGoodsAction {
    type: 'REQUEST_GOODS';
    startDateIndex: number;
}

interface ReceiveGoodsAction {
    type: 'RECEIVE_GOODS';
    startDateIndex: number;
    goods: Goods[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestGoodsAction | ReceiveGoodsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestGoods: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.goods && startDateIndex !== appState.goods.startDateIndex) {
            fetch(`api/goods`)
                .then(response => response.json() as Promise<Goods[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_GOODS', startDateIndex: startDateIndex, goods: data });
                });

            dispatch({ type: 'REQUEST_GOODS', startDateIndex: startDateIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: GoodsState = { goods: [], isLoading: false };

export const reducer: Reducer<GoodsState> = (state: GoodsState | undefined, incomingAction: Action): GoodsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_GOODS':
            return {
                startDateIndex: action.startDateIndex,
                goods: state.goods,
                isLoading: true
            };
        case 'RECEIVE_GOODS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
                    goods: action.goods,
                    isLoading: false
                };
            }
            break;
    }

    return state;
};
