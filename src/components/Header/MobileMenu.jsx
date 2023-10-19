import LeftBar from '../Feed/LeftBar.jsx'

const MobileMenu = () => {
  return (
    <section className='lg:hidden flex fixed flex-col left-0 text-neutral h-auto rounded-lg items-center w-[20%] mt-10 ml-10 md:justify-start'>
      <LeftBar />
    </section>
  )
}

export default MobileMenu
