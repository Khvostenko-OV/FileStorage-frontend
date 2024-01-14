export default function Confirm({answerOk, prompt, close}) {
  return (
    <div className='confirm'>
      <div className='title'>{prompt}</div>
      <button className='cancel-btn' onClick={close}>Cancel</button>
      <button className='link-btn' onClick={answerOk}>OK</button>
    </div>
  )
}
