import * as React from 'react';
import './App.css';

import Home from './body/home';

const App : React.FC = () => (
  <div id='bingo_div'>
    <h2 className='aCenter t_money_font'> 
      <b className='red'> TypeScript </b> 
      : <b className='blue'> Bingo ! </b> 
    </h2>

    <Home />
  </div>
)

export default App;
