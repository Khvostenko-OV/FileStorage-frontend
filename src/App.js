import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import FileList from './components/FileList';
import Login from './components/Login';
import Register from './components/Register';
import Page404 from './components/Page404';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className='body'>
        <Routes>
          <Route path="/" exact element={<Navigate to='files'/>}/>
          <Route path="/files" element={<FileList/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="*" element={<Page404/>}/>
        </Routes>
      </div>
    </Router>
  );
}
