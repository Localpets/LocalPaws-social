// import React from 'react'

const Profile = () => {
    return (
      <>
        <div className='flex items-center mt-4 pt-4 justify-center gap-20'>
          <img
            className='w-[10vw] h-30 rounded-full'
            src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
          />
  
          <div className='flex flex-col gap-2'>
            <h1 className='text-[1em] text-left'>Ricardo Villanueva</h1>
            <div className="flex gap-4 text-[0.8em]">
                <h2 className=''><span className='font-bold'>12</span> Seguidores</h2>
                <h2 className=''><span className='font-bold'>25</span> Seguidos</h2>
            </div>
            <div className="max-w-[35vw]">
                <h2 className="font-bold text-left">Biografia</h2>
                <p className="text-[0.9em] text-left">Hola,me llamo ricardo, me gusta el anime y leer novelas de chinos coreanos cogiendo vacas. Espero te guste mi actitud</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8 m-8 pl-24 pt-2 mt-8  mb-8">
            <div>
                <img
                    className='w-[5vw] h-30 rounded-full'
                    src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
                />
                <h1>Me</h1>
            </div>

            <div>
                <img
                    className='w-[5vw] h-30 rounded-full'
                    src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
                />
                <h1>Amigos</h1>
            </div>

            <div>
                <img
                    className='w-[5vw] h-30 rounded-full'
                    src='https://pbs.twimg.com/profile_images/1636962643876478977/MZB-blU6_400x400.jpg'
                />
                <h1>Familia</h1>
            </div>
                
        </div>

        <section className="m-8 mx-12">
            <div className="border-t-2 border-white">
                <h1 className="mt-2 mb-2 font-bold">Publicaciones</h1>
            </div>
            
                <div className="grid gap-1 grid-cols-3 grid-rows-3">
                    <img 
                    className="w-[40vw] h-[40vh]"
                    src="https://scontent.fbga3-1.fna.fbcdn.net/v/t1.6435-9/99292525_1141995882827382_6809892482868838400_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=e3f864&_nc_eui2=AeFf7LYzyBE_tjX_1MKxdmOp-Hzx0-cTisj4fPHT5xOKyDRrQGaF8SFlGXWlokWazzVXfC_EhKtu2AFwzR68E0M6&_nc_ohc=mBTRzHT-MqoAX87DRoA&_nc_ht=scontent.fbga3-1.fna&oh=00_AfCFFLal2e6TMl4jwxxmpOQ3GLNUJ8uC87jd54kUCIajCw&oe=64F7DA7F"
                    />

                    <img 
                    className="w-[40vw] h-[40vh]"
                    src="https://scontent.fbga3-1.fna.fbcdn.net/v/t1.6435-9/74337447_959461524414153_3143768661689368576_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=8bfeb9&_nc_eui2=AeG8nXoU3APm9zldhnLHwfIqSlOhADjzbgdKU6EAOPNuB6Hfnoz1_JA6aaSr51TCxn7tdC0xhpth6ym7buKoHnn1&_nc_ohc=3LDZok5uwvIAX8a7t-Q&_nc_ht=scontent.fbga3-1.fna&oh=00_AfD2nb1T7XVWKTeOWywH5xxzQBSxWoh3Wh3mnfY9XMN1Ew&oe=64F7D89A"
                    />

                    <img 
                    className="w-[40vw] h-[40vh]"
                    src="https://scontent.fbga3-1.fna.fbcdn.net/v/t1.6435-9/80481617_1018887615138210_3343781122545811456_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=8bfeb9&_nc_eui2=AeE5FbWC5eiiRjw6pjsrEhOK2I4ou_XFGMfYjii79cUYx4N-aM21p4ogBTVAUDSraw4qIRiTKi2bU683YuLUs8T5&_nc_ohc=gsGLxwlJ-_YAX8mhhAi&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB4pShZpEsuafrbCPAXkQ1-W3Rr6OhUMYCx8fZ3_IV78g&oe=64F7E449"
                    />
                </div>
        </section>
      </>
    )
  }
  export default Profile