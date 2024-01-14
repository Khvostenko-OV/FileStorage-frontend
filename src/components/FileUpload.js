import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import Confirm from './Confirm';

export default function FileUpload({ file, changeFile, setUpload,  close }) {
  const { data, fetching, error, request } = useFetch();
  const [name, setName] = useState(file.name);
  const [descr, setDescr] = useState('');
  const [errMsg, setErr] = useState('');

  const [confirm, setConfirm] = useState(undefined);
  const confirmClose = () => setConfirm(undefined);

  const sendFile = (force=false) => {
    const fd = new FormData();
    fd.append('file', file, name);
    fd.append('description', descr);
    force &&  fd.append('force', 'true'); 
    request('storage/upload/', 'POST', fd, '');
}

  useEffect(() => {
    if (data && data.ok) {
      changeFile(data.file);
      setUpload(undefined);
      close();
    } else if (data && data.error_msg.includes('exists')) {
      setConfirm({prompt: data.error_msg + ' Overwrite anyway?', ok: false});
    } else if (data) {
      setErr(data.error_msg);
    }
  }, [data]);

  useEffect(() => {
    if (confirm && confirm.ok) {
      sendFile(true);
      confirmClose();
    }
  }, [confirm]);

  useEffect(() => { setErr(error) }, [error]);

  return (
    <div className='file_edit'>
      <div className='title'>Upload file</div>
      {errMsg && <div className='error_msg'>{errMsg}</div>}
      {fetching && <div className='fetching'>.</div>}

      <div className='edit_str'>
        <label>File name: <input name='name' value={name} onChange={evt => setName(evt.target.value)}/></label>
      </div>
      <div className='edit_str'>
        <label>Description:
          <textarea className='file_description' rows='3' value={descr} onChange={evt => setDescr(evt.target.value)}></textarea>
        </label>
      </div>
      <div className='edit_str'>Size: {file.size}</div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={() => sendFile()}>Send</button>
      {confirm && <Confirm answerOk={() => setConfirm({ok: true})} prompt={confirm.prompt} close={confirmClose}/>}
    </div>
  )
}
