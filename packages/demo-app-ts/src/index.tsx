import { createRoot } from 'react-dom/client';
import '@patternfly/react-core/dist/styles/base.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
