
import './App.css';
import { BrowserRouter as Router, Routes , Route, Link } from 'react-router-dom';
import Chess from './Chess';

function App() {
  return (
    
    <div className="App">
      <Router>
        <Link to="/">Home</Link> {" "}
        <Link to="/chess">Chess</Link>
        <Routes>
          <Route path='/chess' element={<Chess />}></Route>
        </Routes>
       </Router>
    </div>
  );
}

export default App;
