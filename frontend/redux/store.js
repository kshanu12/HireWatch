import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import peopleSlice from "./slice/peopleSlice";



import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  peopleData: peopleSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);





// export const store = configureStore({
//   reducer: rootReducer,
// });

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);
