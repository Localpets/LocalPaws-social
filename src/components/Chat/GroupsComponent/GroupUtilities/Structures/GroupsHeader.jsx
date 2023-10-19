import { useEffect, useState } from 'react'
import { fetchParticipants } from '../FetchParticipants'
import { getContacts } from '../../../utilities/FetchUsers_Contacs'
import LoadingGif from '../../../../LoadingState/LoadingGif'
import { handleAddParticipant } from '../Handlers/HandleAddParticipant'
import { handleKickParticipantGroup } from '../Handlers/HandleKickParticipantGroup'
import { useSocket } from '../../../../../socket/socket'

/* eslint-disable react/prop-types */
const GroupsHeader = ({ localuser, currentGroup, toggleSideContactsStyle, toggleHamburguerStyle }) => {
  const [openContacs, setOpenContacs] = useState(false)
  const [openChangeMembers, setOpenChangeMembers] = useState(false)
  const [addUser, setAddUser] = useState(false)
  const [loadingcontacts, setLoadingcontacts] = useState(true)
  const [groupParticipants, setGroupParticipants] = useState([])
  const [contacs, setContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState(new Set())

  const socket = useSocket()

  useEffect(() => {
    console.log(currentGroup)
    fetchParticipants(currentGroup.id, setGroupParticipants)
    getContacts(setContacts, setLoadingcontacts, localuser)

    if (socket) {
      socket.on('updateMembers', () => {
        fetchParticipants(currentGroup.id, setGroupParticipants)
      })
    }
  }, [currentGroup, currentGroup.id, localuser, socket])

  const handleKickParticipant = (participantId) => {
    handleKickParticipantGroup(currentGroup.id, participantId, socket, localuser)
  }
  const HandleAddParticipant = () => {
    handleAddParticipant(selectedContacts, setSelectedContacts, setAddUser, currentGroup.id, socket, localuser)
  }

  const toggleContactSelection = (contactId) => {
    const updatedSelectedContacts = new Set(selectedContacts)
    if (updatedSelectedContacts.has(contactId)) {
      updatedSelectedContacts.delete(contactId)
    } else {
      updatedSelectedContacts.add(contactId)
    }
    setSelectedContacts(updatedSelectedContacts)
  }

  const userRole = groupParticipants.find(participant => participant.user_id === localuser.user_id)?.rol

  return (
    <section className='flex w-full items-center justify-between px-2 bg-neutral'>
      <div className='flex'>
        <div className='flex items-center gap-2 py-4 md:gap-4 md:pt-4 md:pl-4 md:pb-4'>
          {openContacs
            ? (
              <section className='p-2 flex gap-4 max-h-26 '>
                {!openChangeMembers && (
                  <div className='flex flex-col bg-white rounded-xl justify-center items-center p-1'>
                    <h1 className='text-black bg-base-200 p-1 w-full rounded-xl text-center'>Configuracion: <i className='fa-solid fa-gear fa-spin' /></h1>

                    <div className='rounded-full my-2 bg-black w-24 h-24' />
                    <input
                      type='text'
                      name='' id=''
                      className='rounded-xl border-none ring-0'
                      placeholder='Digite el nuevo nombre de grupo'
                    />
                  </div>
                )}

                <div className={openChangeMembers ? 'flex gap-2 rounded-xl h-full' : 'flex flex-col h-full rounded-xl'}>
                  <button
                    className='flex'
                    onClick={() => {
                      setOpenChangeMembers(!openChangeMembers)
                    }}
                  >
                    <h1 className='text-black bg-base-200 p-1 w-full rounded-xl'>{openChangeMembers ? 'Salir' : 'Gestionar Miembros'}</h1>

                  </button>
                  {openChangeMembers && (
                    <div className='w-full'>
                      <div className='flex gap-2 items-center justify-around p-1 bg-white text-center rounded-xl w-64'>
                        <h1>Miembros</h1>
                        <div className='flex gap-2'>
                          <button
                            className='bg-slate-200 rounded-full p-1 w-8'
                            onClick={() => {
                              setAddUser(!addUser)
                            }}
                          >{addUser
                            ? (
                              <i className='fa-solid fa-xmark' />
                              )
                            : (
                              <i className='fa-solid fa-plus' />
                              )}

                          </button>
                          {addUser &&
                            <button
                              className='bg-slate-200 rounded-full p-1 w-8'
                              onClick={
                                HandleAddParticipant
                              }
                            >
                              <i className='fa-solid fa-check' />
                            </button>}
                        </div>

                      </div>
                      {!addUser
                        ? (
                          <ul className='text-white h-22 max-h-20 w-64 max-w-64 overflow-y-auto gap-2 p-1 rounded-xl'>
                            {groupParticipants.map((participant) => (
                              <div className='flex' key={participant.user_id}>
                                <li className='bg-white flex justify-between w-full m-1 rounded-xl p-1 text-black'>{participant.username}
                                  {participant.user_id === localuser.user_id
                                    ? (
                                      <h1 className='px-1'>tu</h1>
                                      )
                                    : (
                                      <button
                                        onClick={() => {
                                          handleKickParticipant(participant.user_id)
                                        }}
                                      >
                                        <i className='fa-solid fa-user-xmark' />
                                      </button>
                                      )}

                                </li>

                              </div>

                            ))}
                          </ul>
                          )
                        : (
                          <ul>
                            <li className='absolute flex flex-col border-neutral border-2 gap-1 justify-start bg-base-200 rounded-xl overflow-y-auto p-2 h-26 max-h-26'>
                              {!loadingcontacts
                                ? (
                                    contacs.map((contact) => {
                                      const isSelected = selectedContacts.has(contact.user_id)
                                      return (
                                        <div key={contact.user_id} className=''>
                                          <button
                                            type='button'
                                            className={`w-full p-2 flex items-center justify-between rounded-xl ${isSelected ? 'bg-green-200 hover:bg-red-200' : 'bg-white hover:bg-slate-100'}`}
                                            onClick={() => toggleContactSelection(contact.user_id)}
                                          >
                                            <div className='flex items-center gap-4'>
                                              <img src={contact.thumbnail} className='w-10 h-10 rounded-full' />
                                              <h1>{contact.username}</h1>
                                            </div>
                                            <div className='flex'>
                                              <i className={`fa text-neutral text-xl aria-hidden='true ${isSelected ? 'fa-xmark' : 'fa-plus'}`} />
                                            </div>
                                          </button>
                                        </div>
                                      )
                                    })
                                  )
                                : (
                                  <div className='flex items-center justify-center gap-2'>
                                    <LoadingGif />
                                  </div>
                                  )}
                            </li>
                          </ul>
                          )}

                    </div>

                  )}
                </div>

              </section>

              )
            : currentGroup.image
              ? (
                <div className='flex gap-3 items-center'>
                  <img
                    className='w-10 h-10 md:w-14 md:h-14 rounded-full text-white'
                    src={currentGroup.image}
                    alt={currentGroup.name[0]}
                  />
                  <div className='flex flex-col gap-4'>
                    <div className='font-bold text-lg text-white'>
                      <h2>{currentGroup.name}</h2>
                    </div>
                  </div>
                </div>
                )
              : (
                <div>
                  <div className='flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-white'>
                    <h1 className='text-black text-3xl'>{currentGroup.name[0]}</h1>
                    <h1 className='text-black bg-base-200 p-1 w-full rounded-xl'>Miembros</h1>
                  </div>

                  <div className='flex flex-col gap-4'>
                    <div className='font-bold text-lg text-white'>
                      <h2>{currentGroup.name}</h2>
                    </div>
                  </div>
                </div>

                )}

        </div>
      </div>
      <div className='flex flex-col my-2 md:my-0 gap-2'>
        {userRole === 'admin' &&
        (!openContacs
          ? (
            <label className='z-20 btn btn-sm btn-circle '>

              <input
                type='checkbox' className='hidden' onClick={() => {
                  setOpenContacs(!openContacs)
                }}
              />

              <i className='fa fa-chevron-circle-down' aria-hidden='true' />

            </label>
            )
          : (
            <label className='z-20 btn btn-sm btn-circle'>

              <input
                type='checkbox' className='hidden' onClick={() => {
                  setOpenContacs(!openContacs)
                }}
              />

              <i className='fa fa-minus-circle' aria-hidden='true' />

            </label>

            ))}

        <label className='z-20 btn btn-sm btn-circle swap swap-rotate md:hidden'>
          <input
            type='checkbox' className='hidden' onClick={() => {
              toggleSideContactsStyle()
              toggleHamburguerStyle()
            }}
          />

          <svg
            className='swap-off fill-current'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 512 512'
          >
            <path d='M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z' />
          </svg>

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
      </div>

    </section>
  )
}
export default GroupsHeader
