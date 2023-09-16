import { useState, useEffect } from 'react'
import {makeRequest} from '../../library/axios'

const RightBar = () => {
  const [localuser, setLocaluser] = useState([])
  const [userlist, setUserlist] = useState ([])
  const [userFollows, setUserFollows] = useState ([])

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setLocaluser(user);
      console.log("Mi usuario es: ", localuser);
    }
  }, [setLocaluser]);
  
  useEffect(() => {
    const getUserlist = async () => {
      try {
        const res = await makeRequest.get(`/user/find/all`);
        setUserlist(res.data.data);
        console.log("Estos son los usuarios:", userlist);
      } catch (err) {
        console.error(err);
      }
    };
  
    getUserlist();
  
    const getfollowers = async () => {
      if (localuser.userId) {
        try {
          const res = await makeRequest.get(`/follow/find/followed/${localuser.userId}`);
          const fetchedFollows = res.data.follows; // Obtener el valor actualizado
          setUserFollows(fetchedFollows);
          console.log("Estos son los usuarios encontrados", fetchedFollows); // Usar el valor actualizado
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log("El usuario no está definido");
      }
    };
  
    getfollowers();
  }, [setUserlist, localuser, setUserFollows]);
  
   


  const FollowClick = async (user) => {
   
    await makeRequest.post("/follow/create",{
      "followedId": localuser.userId,
      "followerId": user.user_id
    })
      .then(() => {
        console.log("Usuarios seguidos correctamente: ", localuser.userId, user.user_id)
      })
      
      .catch(err => console.log(err));
  };

  const UnFollowClick = async (user) => {
    await makeRequest.delete(`/follow/delete/${user.user_id}/${localuser.userId}`)
      .then( ()=> {
        console.log("Pawseguidor eliminado correctamente", localuser.userId, user.user_id)
      })
      .catch(err => console.log(err));
  };
  
 


  return (
    <section className='hidden fixed right-0 w-[20%] xl:flex xl:flex-col items-center justify-center gap-5 h-auto text-[#0D1B2AS] text-left mt-10 mr-8'>
      <div className='bg-white w-full h-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4'>
        <h3 className='text-[#0D1B2AS] font-bold dark:border-dim-200'>
          Personas populares
        </h3>
        <div>
        <div className='p-2 dark:border-dim-200 flex flex-col justify-between items-start'>
          {userlist.map(user => {
            const currentuser = userFollows.find((follows) => localuser.userId === follows.user_id);
            const followeduser = userFollows ? userFollows.find((follows) => follows.user_id === user.user_id) : null;
            console.log(followeduser);

            return ( 
              <div key={user.user_id}>
                {currentuser ? (
                  <p>Este es mi usuario</p>
                ) : (
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center '>
                      <img
                        className='w-10 h-10 rounded-full'
                        src={user.thumbnail}
                        alt={user.username}
                      />
                      <div className='ml-2 text-sm'>
                        <h5 className='text-[#0D1B2A] font-bold'>
                          {user.first_name} {user.last_name}
                        </h5>
                        <p className='text-gray-400'>{user.username}</p>
                      </div>                 
                    </div>
                    {followeduser ? (
                      <button
                        className='ml-auto content-end'
                        onClick={() => {
                          UnFollowClick(user);
                        }}
                      >
                        Siguiendo
                      </button>
                    ) : (
                      <button
                        className='ml-auto content-end'
                        onClick={() => {
                          FollowClick(user);
                        }}
                      >
                        Seguir
                      </button> 
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

          
          <div className='text-blue-400 cursor-pointer p-2'>Ver más</div>
        </div>
      </div>
      <div className='bg-white w-full h-auto text-[#0D1B2AS] text-left border-2 rounded-lg border-[#E0E1DD] px-4 py-4'>
        <h3 className='text-[#0D1B2AS] font-bold dark:border-dim-200'>
          Veterinarias populares
        </h3>
        <div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>veterinaria prinx</h5>
                <p className='text-gray-400'>@Vet_Prinx</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Veterinaria leon</h5>
                <p className='text-gray-400'>@vet_leon</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='p-2 dark:border-dim-200 flex justify-between items-center'>
            <div className='flex items-center '>
              <img
                className='w-10 h-10 rounded-full '
                src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                alt=''
              />
              <div className='ml-2 text-sm'>
                <h5 className='text-[#0D1B2A] font-bold'>Fundación Veterinaria Labrador</h5>
                <p className='text-gray-400'>@fundacionlabrador</p>
              </div>
            </div>
            <span className='text-right text-solid text-[#415A77] cursor-pointer ml-auto'>Seguir</span>
          </div>
          <div className='text-blue-400 cursor-pointer p-2'>Ver más</div>
        </div>
      </div>
    </section>
  )
}

export default RightBar