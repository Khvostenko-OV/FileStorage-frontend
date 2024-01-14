import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import PassInput from './PassInput';

export default function UserEdit({ user, setUser, close }) {
  const [edit, setEdit] = useState({...user, password: ''});
  const [oldPass, setOldPass] = useState('');
  const { data, fetching, error, request } = useFetch();
  const [errMsg, setErr] = useState('');

  const [passInput, showPassInput] = useState(false);
  const closePassInput = () => showPassInput(false);

  const change = ({target}) => setEdit(prev => ({...prev, [target.name]: target.value}));

  const saveUser = () => {
    if (edit.password && !oldPass) {
      showPassInput(true);
    } else {
      setErr('');
      request('user/', 'PATCH', {...edit, old_password: oldPass});
    }
  }

  useEffect(() => {
    if (data && data.ok) {
      setUser(data.user);
      close();
    } else if (data) {
      setOldPass('');
      setErr(data.error_msg);
    }
  }, [data]);

  useEffect(() => {
    if (oldPass) {
      closePassInput();
      saveUser();
    }
  }, [oldPass]);

  useEffect(() => { setErr(error) }, [error]);

  return (
    <div className='user_edit'>
      <div className='title'>Edit user</div>
      {errMsg && <div className='error_msg'>{errMsg}</div>}
      {fetching && <div className='fetching'>.</div>}

      <div className='edit_str'>
        <label>Login: <input name='username' value={edit.username} onChange={change} maxLength='20'/></label>
      </div>
      <div className='edit_str'>
        <label>Password: <input name='password' value={edit.password} onChange={change}/></label>
      </div>
      <div className='edit_str'>
        <label>First Name: <input name='first_name' value={edit.first_name} onChange={change}/></label>
      </div>
      <div className='edit_str'>
        <label>Last Name: <input name='last_name' value={edit.last_name} onChange={change}/></label>
      </div>
      <div className='edit_str'>
        <label>Email: <input name='email' value={edit.email} onChange={change}/></label>
      </div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={saveUser}>Save</button>
      {passInput && <PassInput setPass={setOldPass} close={closePassInput} prompt='To change password please enter old password:'/>}
    </div>
  )
}