import React from 'react'

const ProfileSettings = () => {
  return (
    <section className='w-full h-full bg-none'>
      <div className='fixed ml-[35vw] z-50 h-[90vh] mx-auto bg-black w-[30vw]'>
          <label htmlFor='imageUpload' style={{ cursor: 'pointer' }}>
                <img
                  className='w-[10vw] h-[10vw] rounded-full'
                  src="blob:https://web.whatsapp.com/e628ab4e-7429-4b47-a4f6-f286d4e2c255"
                  alt='user-thumbnail'
                />
                <input
                  type='file'
                  id='imageUpload'
                  accept='image/*'
                  style={{ display: 'none' }}
                  onChange="blob:https://web.whatsapp.com/e628ab4e-7429-4b47-a4f6-f286d4e2c255"
                />
              </label>
      </div>
    </section>
  )
}

export default ProfileSettings