import React from 'react';

import Element from '../base/Element';
import ElementTitle from '../base/ElementTitle';
import ElementId from '../base/ElementId';
import DateTime from '../base/DateTime';

const TestbedElement = ({testbed, setCurrent, current}) =>
     <Element element={testbed}
              type="testbed"
              setCurrent={setCurrent}
              current={current}
              status={testbed.status.online ? 'online' : 'offline'}
              icon={testbed.type == 'AM' ? 'testbed' : 'registry'}
     >
         <ElementTitle label={testbed.name} detail={testbed.hostname} />
         <ElementId id={testbed.id} />

         <div className="elementDetail">
             <span className="elementLabel">API</span>
             &nbsp;{testbed.api.protocol}
             &nbsp;{testbed.api.type}
             &nbsp;&nbsp;
             <span className="elementLabel">version</span> {testbed.api.version}
             <br />
             <span className="elementLabel">URL</span> {testbed.url}
         </div>
         <div className="row elementDate">
             <div className="col-sm-3">
                 <span className="elementLabel">Last update</span>
                 <br />
                 <DateTime timestamp={null} />
             </div>
         </div>
     </Element>;


TestbedElement.propTypes = {
    testbed: React.PropTypes.object.isRequired,
};

TestbedElement.defaultProps = {
    current: false
};

export default TestbedElement;
