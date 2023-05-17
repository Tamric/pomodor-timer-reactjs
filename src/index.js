import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store'
import './index.css';
import Pomodoro from './Pomodoro';

const container = document.getElementById('root')
const root = createRoot(container);

root.render(
  <StrictMode>
    <Provider store={store}>
      <Pomodoro />
    </Provider>
  </StrictMode>
);

