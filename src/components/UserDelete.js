import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import PassInput from './PassInput';

export default function UserDelete({ user, close }) {
  const [password, setPassword] = useState('');
  const { data, error, fetching, request } = useFetch();
  const [errMsg, setErr] = useState('');
  const [redirect, setRedirect] = useState('');

  useEffect(() => {
    if (password) {
      setErr('');
      request('user/', 'DELETE', {password: password});
    }
  }, [password]);

  useEffect(() => {
    if (data && data.ok) {
      setRedirect('../login');
    } else if (data) {
      setErr(data.error_msg);
    }
  }, [data]);


  useEffect(() => { setErr(error) }, [error]);

  return (
    <div className='user_delete'>
      {redirect && <Navigate to={redirect} relative='path'/>}
      <PassInput setPass={setPassword} close={close} 
                prompt={`To delete user '${user.username}' and remove all files please enter password:`}/>
      {fetching && <div className='fetching'>.</div>}
      {errMsg && <div className='error_delete'>{errMsg}</div>}
    </div>
  )
}
