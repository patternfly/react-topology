import * as React from 'react';
import { InfoCircleIcon, MouseIcon } from '@patternfly/react-icons';

import './AreaDragHint.css';

const AreaDragHint: React.FC = () => {
  return (
    <div className="area-drag-hint__hint-container">
      <div className="area-drag-hint__hint-background">
        <div className="area-drag-hint">
          <InfoCircleIcon className="area-drag-hint__icon" />
          <span className="area-drag-hint__text">
            <table>
              <tbody>
                <tr>
                  <td className="area-drag-hint-shortcut__cell">
                    <span className="area-drag-hint-shortcut__command">
                      <kbd className="area-drag-hint-shortcut__kbd">Shift</kbd>
                    </span>
                    <span className="area-drag-hint-shortcut__command">
                      <kbd className="area-drag-hint-shortcut__kbd">
                        <MouseIcon /> Drag
                      </kbd>
                    </span>
                  </td>
                  <td className="area-drag-hint-shortcut__cell">Select nodes in area</td>
                </tr>
                <tr>
                  <td className="area-drag-hint-shortcut__cell">
                    <span className="area-drag-hint-shortcut__command">
                      <kbd className="area-drag-hint-shortcut__kbd">Ctrl</kbd>
                    </span>
                    <span className="area-drag-hint-shortcut__command">
                      <kbd className="area-drag-hint-shortcut__kbd">
                        <MouseIcon /> Drag
                      </kbd>
                    </span>
                  </td>
                  <td className="area-drag-hint-shortcut__cell">Zoom to selected area</td>
                </tr>
              </tbody>
            </table>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AreaDragHint;
