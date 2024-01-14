import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const newUser = {username: '', password: '', first_name:'', last_name:'', email:''}

export default function Register() {
  const { data, error, fetching, request } = useFetch();
  const [errMsg, setErr] = useState('');
  const [edit, setEdit] = useState(newUser);
  const [redirect, setRedirect] = useState('');

  const change = ({target}) => setEdit(prev => ({...prev, [target.name]: target.value}));

  const reset = () => {
    setEdit(newUser);
    setErr('');
  }

  const signUp = (evt) => {
    evt.preventDefault();
    setErr('');
    request('user/new/','POST',{...edit});
  }

  useEffect(() => {
    if (data && data.ok === 201) {
      request('login/','POST',{username: edit.username, password:edit.password})
    } else if (data && data.ok === 200) {
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
      <div className='title'>Register new user</div>
      {errMsg && <div className='error_msg'>{errMsg}</div>}
      {fetching && <div className='fetching' style={{top: '24px', left: '24px'}}>.</div>}

      <form name='register' onSubmit={signUp}>
        <div className='edit_str'>
          <label>Login*: <input name='username' value={edit.username} onChange={change} maxLength='20' required/></label>
        </div>
        <div className='edit_str'>
          <label>Password*: <input name='password' value={edit.password} onChange={change} required/></label>
        </div>
        <div className='edit_str'>
          <label>First Name: <input name='first_name' value={edit.first_name} onChange={change}/></label>
        </div>
        <div className='edit_str'>
          <label>Last Name: <input name='last_name' value={edit.last_name} onChange={change}/></label>
        </div>
        <div className='edit_str'>
          <label>Email: <input name='email' type='email' value={edit.email} onChange={change}/></label>
        </div>
        <button className='link-btn' type='submit'>Sign Up</button>
        <button className='cancel-btn' onClick={reset}>Reset</button>
        <button className='link-btn' onClick={() => setRedirect('../login')}>Login</button>
      </form>
    </div>
  )
}
