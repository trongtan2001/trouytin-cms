import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux';
import { BrowserRouter } from 'react-router-dom'
import { ClickToComponent } from 'click-to-react-component';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ClickToComponent />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);