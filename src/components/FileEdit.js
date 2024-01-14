import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';

export default function FileEdit({ file, changeFile, close }) {
  const { data, fetching, error, request } = useFetch();
  const [edit, setEdit] = useState(file);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErr] = useState('');

  const change = ({target}) => setEdit(prev => ({...prev, [target.name]: target.value}));

  const saveChanges = () => {
    if (file.name !== edit.name || file.description !== edit.description) {
      setErr('');
      request(`storage/file/${file.id}/`, 'PATCH', {filename: edit.name, description: edit.description});
      setSaving(true);
    } else close();
  }

  useEffect(() => { request(`storage/file/${file.id}/`) }, []);

  useEffect(() => {
    if (data && loading && data.ok) {
      setEdit(data.file);
      changeFile(data.file);
      setLoading(false);
    } else if  (data && saving && data.ok) {
      changeFile(data.file);
      setSaving(false);
      close();
    } else if (data) {
      setErr(data.error_msg);
    }
  }, [data]);

  useEffect(() => { setErr(error) }, [error]);

  return (
    <div className='file_edit'>
      <div className='title'>Edit file</div>
      {fetching && <div className='fetching'>.</div>}
      {errMsg && <div className='error_msg'>{errMsg}</div>}

      {loading && <>
        <div className='edit_str'>
          <label>File name: <input name='name' value={edit.name} readOnly/></label>
        </div>
        <div className='edit_str'>
          <label>Description:
            <textarea className='file_description' rows='3' name='description' value={edit.description} readOnly></textarea>
          </label>
        </div>
      </>}
      
      {!loading && <>
        {(edit.size < 0) && <div className='error_msg'>{`File '${file.name}' not found!`}</div>}
        <div className='edit_str'>
          <label>File name: <input name='name' value={edit.name} onChange={change}/></label>
        </div>
        <div className='edit_str'>
          <label>Description:
            <textarea className='file_description' rows='3' name='description' value={edit.description} onChange={change}></textarea>
          </label>
        </div>
      </>}

      <div className='edit_str'>Size: {edit.size}</div>
      <div className='edit_str'>Created: {edit.created_at.substring(0,19)}</div>
      <div className='edit_str'>Updated: {edit.updated_at.substring(0,19)}</div>
      <div className='edit_str'>Total downloads: {edit.downloads}</div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={saveChanges}>Save</button>
    </div>
  )
}
