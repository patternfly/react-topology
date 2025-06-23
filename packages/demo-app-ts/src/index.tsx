import { createRoot } from 'react-dom/client';
import '@patternfly/react-core/dist/styles/base.css';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
