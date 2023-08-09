import './App.css';
import Classifier from './components/Classifier/Classifier';
import ImageList from './components/ImageList/ImageList';
import Navigation from './components/Navigation/Navigation';
import {Route, BrowserRouter, Routes} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className='App'>
      <Routes>
            <Route exact path='/' Component={Classifier} />
            <Route path='/list' Component={ImageList} />    
            <Route exact path='*' Component={Classifier} />  
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
