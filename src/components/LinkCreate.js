import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';

export default function LinkCreate({ file, close }) {
  const [duration, setDuration] = useState({days: 30, hours:0, minutes: 0});
  const [link, setLink] = useState(undefined);
  const { data, fetching, error, request } = useFetch();
  const [errMsg, setErr] = useState('');

  const change = ({target}) => setDuration(prev => ({...prev, [target.name]: target.value}));

  const create = () => {
    request('storage/file/link/', 'POST', 
      {file_id: file.id, duration: duration.days*1440 + duration.hours*60 + duration.minutes}
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(link.href);
  }

  useEffect(() => {
    if (data && data.ok) {
      setLink(data.link);
    } else if (data) {
      setErr(data.error_msg);
    }
  }, [data]);


  useEffect(() => { setErr(error) }, [error]);

  if (link) return (
    <div className='link_create'>
      <div className='title'>Download link for file '{file.name}'</div>
      <div className='edit_str'>{link.href} <button className='cancel-btn' title='Copy link' onClick={copyLink}>📋</button></div>
      <div className='edit_str'>Expired at: {link.expire_at? link.expire_at.substring(0,19) + ' UTC' : 'never'}</div>
      <button className='cancel-btn' onClick={close}>Close</button>
    </div>
  )

  return (
    <div className='link_create'>
      <div className='title'>Download link for file '{file.name}'</div>
      {errMsg && <div className='error_msg'>{errMsg}</div>}
      {fetching && <div className='fetching'>.</div>}

      <div>Expired after (0.0.0 - never)</div>
      <div className='edit_str'>
        <label>Days:<input className='number3' type='number' name='days' value={duration.days} onChange={change}/></label>
        <label> Hours:<input className='number2' type='number' name='hours' value={duration.hours} onChange={change}/></label>
        <label> Mins:<input className='number2' type='number' name='minutes' value={duration.minutes} onChange={change}/></label>
      </div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={create}>Create</button>
    </div>
  )
}
