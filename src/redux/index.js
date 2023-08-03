import { combineReducers } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { reducer as form } from "redux-form";
import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { persistReducer, persistStore } from "redux-persist";
import { connectRouter } from "connected-react-router";
import storage from "redux-persist/lib/storage";
import user from "./state/user";
import settings from "./state/settings";
import sui from "./state/sui";
import search from "./state/search";
import creators from "./state/creators";
import loading from "./state/loading";
import initialValues from "./state/initialValues";

export const mergeAction = (state, action) => {
  var copy = Object.assign({}, action);
  delete copy.type;
  return { ...state, ...copy };
};

export const history = createBrowserHistory();

const middlewares = [thunk, routerMiddleware(history)];

const persistConfig = {
  key: "primary",
  whitelist: ["Dashboard"],
  storage,
};

const reducers = (history) =>
  combineReducers({
    creators,
    form,
    initialValues,
    router: connectRouter(history),
    search,
    settings,
    sui,
    user,
    loading,
  });

const rootReducer = (state, action) => {
  //  if (action && action.type === CREDENTIAL_CLEAR) {
  //    const { routing } = state;
  //    state = { routing };
  //  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer(history));
let store;

const makeStore = (preloadedState = undefined) => {
  return createStore(
    persistedReducer,
    preloadedState,
    composeWithDevTools({
      trace: true,
      traceLimit: 25,
    })(applyMiddleware(...middlewares))
  );
};

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });

    // Reset the current store
    store = undefined;
  }

  // Create the store once in the client
  if (!store) {
    store = _store;
  }

  return _store;
};

store = initializeStore();

export default store;

export const persistor = persistStore(store);

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState]);
}
