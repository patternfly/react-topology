import React from 'react';
import { createRoot } from 'react-dom/client';
import '@patternfly/react-core/dist/styles/base.css';
import './index.css';
import App from './App';
import '@patternfly/patternfly/patternfly-theme-dark.css';
import '@patternfly/patternfly/patternfly-addons.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
