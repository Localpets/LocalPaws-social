import LeftBar from '../Feed/LeftBar.jsx'

const MobileMenu = () => {
  return (
    <section className='lg:hidden flex fixed flex-col text-neutral h-auto rounded-lg items-center w-[20%] mt-10 ml-10'>
      <LeftBar />
    </section>
  )
}

export default MobileMenu
