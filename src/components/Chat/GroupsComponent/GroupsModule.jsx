/* eslint-disable react/prop-types */
import useChatStore from '../../../context/ChatStore'
import GroupSubmitchat from './GroupUtilities/Structures/GroupSubmitchat'
import GroupsHeader from './GroupUtilities/Structures/GroupsHeader'

const GroupsModule = ({ currentGroup, localuser }) => {
  const {
    toggleSideContactsStyle,
    toggleHamburguerStyle
  } = useChatStore()

  return (
    <section className='flex flex-col justify-start flex-1 h-full w-full'>
      <GroupsHeader localuser={localuser} currentGroup={currentGroup} toggleSideContactsStyle={toggleSideContactsStyle} toggleHamburguerStyle={toggleHamburguerStyle} />

      <div className='flex flex-col w-full h-full justify-end bg-[url("https://wallpapercave.com/wp/wp9599638.jpg")] bg-cover rounded-br-lg'>
        <section className='p-4 pb-6 overflow-auto'>
          <div className='flex justify-center text-lg text-neutral'>
            <h1 className='w-[30em] text-center bg-[#ffffffa6] rounded-3xl p-2'>Chatea con tus amigos, reacciona a sus mensajes y socializa con toda la comunida de pawsplorer</h1>
          </div>

        </section>
      </div>
      <GroupSubmitchat />
    </section>
  )
}

export default GroupsModule
