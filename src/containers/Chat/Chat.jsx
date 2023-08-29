import {
  BsFillChatDotsFill,
  BsFillPeopleFill,
  BsFillDoorOpenFill,
  BsPersonFillAdd,
  BsFillSendFill
} from 'react-icons/bs'
import { Link } from '@tanstack/router'
import ConversationButton from '../../components/Chat/ConversationButton'
import useChatStore from '../../context/ChatStore'

const Chat = () => {
  const { sideContactsStyle, toggleSideContactsStyle, toggleHamburguerStyle } = useChatStore()

  return (
    <section className='h-[100vh] md:h-[95vh] md:my-5 flex w-full container rounded-xl'>
      <section className='hidden w-40 h-full bg-[#1B263B] md:flex flex-col justify-between items-center gap-18 p-4 py-8 rounded-l-lg'>
        <h1 className='font-bold text-white text-xl'>PawsPlorer Messenger</h1>
        <ul className='flex flex-col items-center justify-center gap-8'>
          <li>
            <Link className='btn btn-ghost'>
              <BsFillChatDotsFill className='text-white text-2xl' />
            </Link>
          </li>
          <li>
            <Link className='btn btn-ghost'>
              <BsFillPeopleFill className='text-white text-2xl' />
            </Link>
          </li>
          <li>
            <Link to='/home' className='btn btn-ghost'>
              <BsFillDoorOpenFill className='text-white text-2xl' />
            </Link>
          </li>
        </ul>
        <button>
          <img
            className='w-10 h-10 rounded-full'
            src='https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/242007867_1215216918952508_4103291446202515352_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHM5pBNTPTWnHt5tj8ntLBB_GtyjOC3qGH8a3KM4LeoYRJOu1-nX95P5g-GmRHKfhMUFrtnQEQQUVWuoM-Mh5bA&_nc_ohc=ePSg0-TQTkkAX9-VcKJ&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB5ZAHTxGPRCYpHy_9McxUQA-XKaib72pquD4wt-H90Zw&oe=64D49A32'
          />
        </button>
      </section>

      <section className='hidden md:w-60 lg:w-80 h-full bg-white md:flex flex-col justify-start items-center gap-18 p-4 py-8 pt-6'>
        <ul className='w-full flex flex-wrap items-center justify-around pb-2'>
          <li>
            <h2 className='font-bold text-slate-800 text-xl'>Conversations</h2>
          </li>
          <li>
            <button className='btn btn-ghost'>
              <BsPersonFillAdd className='text-slate-800 text-2xl' />
            </button>
          </li>
        </ul>

        <input
          type='text'
          placeholder='Buscar conversación'
          className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
        />

        <ul className='flex flex-col w-full items-center justify-center gap-4 pt-8'>
          <ConversationButton
            user='Ye'
            thumbnail='https://www.clipartkey.com/mpngs/m/267-2675110_kanye-west-avatar-kanye-avatar.png'
            lastMessage='I made that bitch famous'
          />
          <ConversationButton
            user='Ricardoarsv'
            thumbnail='https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/242007867_1215216918952508_4103291446202515352_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHM5pBNTPTWnHt5tj8ntLBB_GtyjOC3qGH8a3KM4LeoYRJOu1-nX95P5g-GmRHKfhMUFrtnQEQQUVWuoM-Mh5bA&_nc_ohc=ePSg0-TQTkkAX9-VcKJ&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB5ZAHTxGPRCYpHy_9McxUQA-XKaib72pquD4wt-H90Zw&oe=64D49A32'
            lastMessage='Quiero coger osos...'
          />
          <ConversationButton
            user='Diaxxi'
            thumbnail='https://scontent.fbga3-1.fna.fbcdn.net/v/t1.6435-9/72208406_123258812414328_8278854598991544320_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeGEjEee7gRiXEmdLusGMqqFxV9sgUixQXrFX2yBSLFBethd7ixyb-Lu2xhWB4SgikS-3PO8RFaPOa37PqE9m9eE&_nc_ohc=qv-h6R_hFywAX_W6FJe&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB8bJ5jKKy04_OfRlZfemSTdxojtkoGDU9-mWMXDFaBdw&oe=64FB5030'
            lastMessage='haters gonna hate'
          />
        </ul>
      </section>

      {/* movbile menu */}

      <section className={`z-10 md:hidden w-full   h-full bg-white flex flex-col justify-start items-center gap-18 p-4 ${sideContactsStyle} transition-transform`}>
        <ul className='w-full flex flex-wrap items-center justify-start pb-2 gap-4'>
          <li>
            <h2 className='font-bold text-slate-800 text-xl'>Conversations</h2>
          </li>
          <li>
            <button className='btn btn-ghost'>
              <BsPersonFillAdd className='text-slate-800 text-2xl' />
            </button>
          </li>
        </ul>

        <section className='w-full h-[80%]'>
          <input
            type='text'
            placeholder='Buscar conversación'
            className='input bg-gray-100 text-black rounded-md mt-4 w-full max-w-2xl placeholder:font-semibold'
          />
          <ul className='flex flex-col w-full items-center justify-center gap-4 pt-4'>
            <ConversationButton
              user='Ye'
              thumbnail='https://www.clipartkey.com/mpngs/m/267-2675110_kanye-west-avatar-kanye-avatar.png'
              lastMessage='I made that bitch famous'
            />
            <ConversationButton
              user='Ye'
              thumbnail='https://www.clipartkey.com/mpngs/m/267-2675110_kanye-west-avatar-kanye-avatar.png'
              lastMessage='I made that bitch famous'
            />
            <ConversationButton
              user='Ye'
              thumbnail='https://www.clipartkey.com/mpngs/m/267-2675110_kanye-west-avatar-kanye-avatar.png'
              lastMessage='I made that bitch famous'
            />
          </ul>
        </section>

        <section className='w-full bg-[#1B263B] flex flex-col justify-between items-center justify-self-end gap-4 p-4 rounded-lg'>
          <h1 className='font-bold text-white text-xl'>PawsPlorer Messenger</h1>
          <ul className='flex flex-row items-center justify-center'>
            <li>
              <Link className='btn btn-ghost'>
                <BsFillChatDotsFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <Link className='btn btn-ghost'>
                <BsFillPeopleFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <Link to='/home' className='btn btn-ghost'>
                <BsFillDoorOpenFill className='text-white text-2xl' />
              </Link>
            </li>
            <li>
              <button className='btn btn-ghost'>
                <img
                  className='w-10 h-10 rounded-full'
                  src='https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/242007867_1215216918952508_4103291446202515352_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHM5pBNTPTWnHt5tj8ntLBB_GtyjOC3qGH8a3KM4LeoYRJOu1-nX95P5g-GmRHKfhMUFrtnQEQQUVWuoM-Mh5bA&_nc_ohc=ePSg0-TQTkkAX9-VcKJ&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB5ZAHTxGPRCYpHy_9McxUQA-XKaib72pquD4wt-H90Zw&oe=64D49A32'
                />
              </button>
            </li>
          </ul>
        </section>
      </section>

      <section className='flex flex-col justify-start flex-1 h-full'>
        <section className='flex w-full items-center justify-between px-2 bg-white md:rounded-tr-lg'>
          <div className='flex'>
            <div className='flex items-center gap-2 py-4 md:gap-4 md:pt-4 md:pl-4 md:pb-4'>
              <img
                className='w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#8fd370]'
                src='https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/242007867_1215216918952508_4103291446202515352_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHM5pBNTPTWnHt5tj8ntLBB_GtyjOC3qGH8a3KM4LeoYRJOu1-nX95P5g-GmRHKfhMUFrtnQEQQUVWuoM-Mh5bA&_nc_ohc=ePSg0-TQTkkAX9-VcKJ&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB5ZAHTxGPRCYpHy_9McxUQA-XKaib72pquD4wt-H90Zw&oe=64D49A32'
              />
              <h2 className='font-bold text-lg text-black'>
                Ricardo Villanueva
              </h2>
            </div>
          </div>
          <label className='z-20 btn btn-sm btn-circle swap swap-rotate mr-2 md:hidden'>
            {/* this hidden checkbox controls the state */}
            <input
              type='checkbox' className='hidden' onClick={() => {
                toggleSideContactsStyle()
                toggleHamburguerStyle()
              }}
            />

            {/* hamburger icon */}
            <svg
              className='swap-off fill-current'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 512 512'
            >
              <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
            </svg>

            {/* close icon */}
            <svg
              className='swap-on fill-current'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 512 512'
            >
              <polygon points='400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49' />
            </svg>
          </label>
        </section>

        <section className='h-full'>
          <div className='flex flex-col w-full h-full justify-end bg-[url("https://wallpapercave.com/wp/wp4410779.png")] bg-cover rounded-br-lg'>
            <section className='p-4 pb-6'>
              <div className='chat chat-start'>
                <div className='chat-bubble'>
                  It's over Anakin, <br />I have the high ground.
                </div>
              </div>
              <div className='chat chat-end'>
                <div className='chat-bubble'>You underestimate my power!</div>
              </div>
            </section>

            <div className='p-4 pb-4 flex gap-4 items-center'>
              <input
                type='text'
                placeholder='Mensaje'
                className='input bg-white text-black rounded-md w-full max-w-2xl placeholder:font-semibold'
              />
              <button className='btn btn-ghost'>
                <BsFillSendFill className='text-[#0D1B2A] text-xl' />
              </button>
            </div>
          </div>
        </section>
      </section>
    </section>
  )
}

export default Chat
