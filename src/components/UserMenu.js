export default function UserMenu({ user, action, close }) {
  return (
    <div className='user_menu' onMouseLeave={close}>
      <div className='title'>{user.username}</div>
      <div className='user_fullname'>{user.first_name} {user.last_name}</div>
      {user.is_admin && 
        <div className='click' onClick={() => window.open(process.env.REACT_APP_BACKEND + 'admin/', '_blank')}>
          Admin panel
        </div>
      }
      <div className='click' onClick={() => action('logout')}>Logout</div>
      <div className='click' onClick={() => action('editUser')}>Edit</div>
      <div className='delete' onClick={() => action('deleteUser')}>Delete</div>
    </div>
  )
}
