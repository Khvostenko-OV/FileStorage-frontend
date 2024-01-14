import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';

export default function FileDelete({ file, deleteFile, close }) {
  const { data, fetching, error, request } = useFetch();
  const [errMsg, setErr] = useState('');

  useEffect(() => {
    if (data && data.ok) {
      deleteFile(file);
      close();
    } else if (data) {
      setErr(data.error_msg);
    }
  }, [data]);

  useEffect(() => { setErr(error) }, [error]);

  return (
    <div className='file_delete'>
      <div className='title'>Delete file '{file.name}'?</div>
      {errMsg && <div className='error_msg'>{errMsg}</div>}
      {fetching && <div className='fetching'>.</div>}

      <div className='edit_str'>
        <pre>{file.description}</pre>
      </div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={() => {request(`storage/file/${file.id}/`, 'DELETE')}}>Delete</button>
    </div>
  )
}
