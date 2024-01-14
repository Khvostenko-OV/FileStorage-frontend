import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

export default function Login() {
  const { data, error, fetching, request } = useFetch();
  const [errMsg, setErr] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    if (data && data.ok) {
      setRedirect('..');
    } else if (data) {
      setErr(data.error_msg);
    }
  }, [data]);

  useEffect(() => { setErr(error) }, [error]);

  return (
    <div className='login_page'>
      {redirect && <Navigate to={redirect} relative='path'/>}
      <h2>Welcome to FileStorage</h2>
      <div className='admin_link' onClick={() => window.open(process.env.REACT_APP_ADMIN, '_blank')}>
        Admin panel
      </div>
      {errMsg && <div className='error_msg'>{errMsg}</div>}
      {fetching && <div className='fetching'>.</div>}
      
      <div className='edit_str'>
        <label>Your login: <input value={login} onChange={evt => setLogin(evt.target.value)}/></label>
      </div>
      <div className='edit_str'>
        <label>Password: <input value={password} onChange={evt => setPassword(evt.target.value)}/></label>
      </div>
      <button className='link-btn' onClick={() => request('login/','POST',{username: login, password:password})}>Sign in</button>
      <button className='link-btn' onClick={() => setRedirect('../register')}>Register</button>
    </div>
  )
}
