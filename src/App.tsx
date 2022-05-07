
import './App.css';

import Chess from './Chess';
import { initState } from './Reducer';
import { toProps } from './StateToProps';

const initProps = toProps(initState);
function App() {
  return (
    <div className="App">
      <Chess  />
      
    </div>
  );
}

export default App;
