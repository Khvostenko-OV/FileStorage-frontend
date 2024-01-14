import { useState } from 'react';

export default function PassInput({setPass, close, prompt}) {
  const [value, setValue] = useState('');

  return (
    <div className='pass_input'>
      <div>{prompt}</div>
      <div className='edit_str'><input value={value} onChange={(evt) => setValue(evt.target.value)}/></div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={() => {value && setPass(value)}}>OK</button>
    </div>
  )
}
