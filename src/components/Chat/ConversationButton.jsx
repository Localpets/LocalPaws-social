import PropTypes from 'prop-types'

const ConversationButton = ({ user, lastMessage, thumbnail }) => {
  return (
    <li className='w-full'>
      <button className='btn-ghost p-2 rounded-lg w-full flex justify-left gap-2'>
        <div className='text-black'>
          <img className='w-12 h-12 rounded-full' src={thumbnail} />
        </div>
        <div className='flex flex-col items-start justify-center'>
          <div className='text-black font-bold text-md'>{user}</div>
          <div className='text-black text-sm'>{lastMessage}</div>
        </div>
      </button>
    </li>
  )
}

ConversationButton.propTypes = {
  user: PropTypes.string.isRequired,
  lastMessage: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired
}

export default ConversationButton

/*

https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/250384102_1535233720170261_7153752137054069088_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=8bfeb9&_nc_eui2=AeHezHK9JKmUNWFB7K84bqpu0FFHZU5R1fzQUUdlTlHV_L4waKg_s2XlwCrDacIghWuqF0N4DHWMOey9-p9bCBHq&_nc_ohc=GZigCuF6zg0AX-cGaT_&_nc_ht=scontent.fbga3-1.fna&oh=00_AfBZFxXVoJ3GMiCe30C2DsqiuD1gYAdjrsI6B8p4WbDimw&oe=64D8EAA8

Brayan57894

We go gym

*/
