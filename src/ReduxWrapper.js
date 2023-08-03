import "./App.css";
import { Provider } from "react-redux";
import { useStore } from "./redux";
import App from "./App";

function ReduxWrapper() {
  const store = useStore();
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default ReduxWrapper;
