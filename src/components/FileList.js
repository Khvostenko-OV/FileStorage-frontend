import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import UserMenu from './UserMenu';
import UserEdit from './UserEdit';
import UserDelete from './UserDelete';
import FileEdit from './FileEdit';
import FileDelete from './FileDelete';
import FileUpload from './FileUpload';
import LinkCreate from './LinkCreate';

export default function FileList() {
  const { data, fetching, error, redir, request } = useFetch();
  const [user, setUser] = useState({username: ''});
  const [files, setFiles] = useState([]);
  const [selectedFile, selectFile] = useState(undefined);
  const [uploadedFile, setUploadedFile] = useState(undefined);
  const [redirect, setRedirect] = useState('');

  const [action, setAction] = useState('');
  const closeAction = () => {
    setAction('');
    selectFile(undefined);
  }

  const changeFile = file => {
    const index = files.findIndex(elem => elem.id === file.id)
    if (index >= 0) {
      setFiles(files.with(index, file));
    } else {
        setFiles([...files, file]);
    }
  }

  const deleteFile = file => {
    setFiles(files.filter(elem => elem.id !== file.id))
  }

  function formatSize(bytes) {
    if (bytes < 1024) {
        return String(bytes);
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(1) + ' KB';
    } else {
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
  }
  
  useEffect(() => { request('storage/') }, []);
  useEffect(() => { setRedirect(redir) }, [redir]);

  useEffect(() => {
    if (action === 'logout') {
      request('logout/', 'POST', {}, '', '../login');
    }
  }, [action]);

  useEffect(() => {
    if (data && data.ok) {
      data.user && setUser(data.user);
      data.files && setFiles(data.files);
    } else if (data && data.error === 401) {
      console.log(`Request GET ${process.env.REACT_APP_BACKEND}storage/ | ${data.error_msg}`)
      setRedirect('../login');
    }
  }, [data]);

  return (
    <div className='files_page'>
      {redirect && <Navigate to={redirect}/>}
      {error && <div className='error_msg'>{error}</div>}
      {fetching && <div className='fetching' style={{top: '20px', left: '140px'}}>.</div>}
      
      {files && <>
        <div className='files_header'>
          <div className='title'>File Storage</div>
          {user.username && <div className='username click'  onClick={() => setAction('userMenu')}>User: {user.username}</div>}
          {!user.username && <div className='username click'  onClick={() => setRedirect('../login')}>Login{user.username}</div>}
          {(action === 'userMenu') && <UserMenu user={user} action={setAction} close={closeAction} />}
          {(action === 'editUser') && <UserEdit user={user} setUser={setUser} close={closeAction} />}
          {(action === 'deleteUser') && <UserDelete user={user} close={closeAction} />}
          <input type='file' name='file' value={uploadedFile? undefined : ''} onChange={evt => setUploadedFile(evt.target.files[0])}/>
          {uploadedFile && <span className='size'>{formatSize(uploadedFile.size)}</span>}
          <button className='link-btn' onClick={() => uploadedFile && setAction('uploadFile')}>Upload</button>
          {(action === 'uploadFile') && <FileUpload file={uploadedFile} changeFile={changeFile} setUpload={setUploadedFile} close={closeAction}/>}
          <span>Total files: {files.length}</span>

          <div className='file_item first'>
            <div className='file_num'>Num</div>
            <div className='file_name_1'>File name</div>
            <div className='file_size'>Size</div>
            <div className='file_date_1'>Created</div>
            <div className='file_down'>Download</div>
            <div className='file_link'>Create link</div>
            <div className='file_del'>Delete</div>
          </div>
        </div>

        <div className='file_list'>
          {files.map((file, index) => 
            <div key={file.id} className={file.size < 0? 'file_item fantom' : 'file_item'}>
              <div className='file_num'>{index + 1}</div>
              <div className='file_name click' onClick={() => { selectFile(file); setAction('editFile'); }}>
                {file.name}
                <span className='file_descr'>{file.description}</span>
              </div>
              <div className='file_size'>{formatSize(file.size)}</div>
              <div className='file_date'>{file.created_at.substring(0,19)}</div>
              <div className={file.size < 0? 'file_down' : 'file_down click'}>
                <a className={file.size < 0? 'disabled' : ''} href={process.env.REACT_APP_BACKEND + `storage/file/${file.id}/download/`}>⇓</a>
              </div>
              <div className={file.size < 0? 'file_down' : 'file_down click'} onClick={file.size < 0? null : () => { selectFile(file); setAction('createLink'); }}>🔗</div>
              <div className='file_del delete' onClick={() => { selectFile(file); setAction('deleteFile'); }}>X</div>
            </div>
          )}
        </div>

        {(action === 'editFile') && <FileEdit file={selectedFile} changeFile={changeFile} close={closeAction}/>}
        {(action === 'deleteFile') && <FileDelete file={selectedFile} deleteFile={deleteFile} close={closeAction}/>}
        {(action === 'createLink') && <LinkCreate file={selectedFile} close={closeAction}/>}
      </>}
    </div>
  )
}
