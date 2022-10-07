
import './App.css';
import { BrowserRouter as Router, Routes , Route, Link } from 'react-router-dom';
import Chess from './chess/Chess';
import Sudoku from './sudoku/Sudoku';

function App() {
  return (
    
    <div className="App">
      <Router>
        <Link to="/">Home</Link> {" "}
        <Link to="/chess">Chess</Link>
        <Link to="/sudoku">Sudoku</Link>
        <Routes>
          <Route path='/chess' element={<Chess />}></Route>
        </Routes>
        <Routes>
          <Route path='/sudoku' element={<Sudoku />}></Route>
        </Routes>
       </Router>
    </div>
  );
}

export default App;
