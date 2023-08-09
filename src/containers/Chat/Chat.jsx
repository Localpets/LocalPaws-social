import {BsFillChatDotsFill, BsFillPeopleFill, BsFillDoorOpenFill, BsPersonFillAdd, BsFillSendFill} from "react-icons/bs"

const Chat = ({}) => {
    return(
        <div className="bg-[#ffffff] h-full">
            
                <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content flex max-w-[28vw]">
                        <div className="flex flex-col min-w-[18em] border-r-2 border-[#0D1B2A]">
                            <div className="flex pt-2 pl-4 justify-between">
                                <h1 className="font-bold text-lg text-black">MESSAGES</h1>
                                <button className="flex mt-2 mr-2"> <BsPersonFillAdd className="text-[#1B263B]"/> </button>
                            </div>
                            <div className="flex flex-col pt-8">
                                <div 
                                    onClick="" 
                                    className="
                                        w-full
                                        relative 
                                        flex 
                                        items-center 
                                        h-16
                                        bg-[#ffffff]
                                        p-3 
                                        hover:bg-[#8080807b]
                                        transition
                                        cursor-pointer">
                                    <div className='flex items-center gap-4 justify-center'>
                                        <img
                                            className='w-10 h-15 rounded-full'
                                            src='https://www.clipartkey.com/mpngs/m/267-2675110_kanye-west-avatar-kanye-avatar.png'
                                        />
                                
                                        <div className='flex flex-col'>
                                            <h1 className='text-[1em] text-left text-black text-lg'>Kanye West</h1>
                                            <div className="flex gap-4 text-[0.8em]">
                                                <h2 className='text-black'>Soy tu clon</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div 
                                    onClick="" 
                                    className="
                                        w-full
                                        relative 
                                        flex 
                                        items-center 
                                        h-16
                                        bg-[#ffffff]
                                        p-3 
                                        hover:bg-[#8080807b]
                                        transition
                                        cursor-pointer">
                                    <div className='flex items-center gap-4 justify-center'>
                                        <img
                                            className='w-10 h-15 rounded-full'
                                            src='https://scontent.fbga3-1.fna.fbcdn.net/v/t1.6435-9/72208406_123258812414328_8278854598991544320_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeGEjEee7gRiXEmdLusGMqqFxV9sgUixQXrFX2yBSLFBethd7ixyb-Lu2xhWB4SgikS-3PO8RFaPOa37PqE9m9eE&_nc_ohc=qv-h6R_hFywAX_W6FJe&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB8bJ5jKKy04_OfRlZfemSTdxojtkoGDU9-mWMXDFaBdw&oe=64FB5030'
                                        />
                                
                                        <div className='flex flex-col'>
                                            <h1 className='text-[1em] text-left text-black text-lg'>Santiago Diaz</h1>
                                            <div className="flex gap-4 text-[0.8em]">
                                                <h2 className='text-black'>wyd</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div 
                                    onClick="" 
                                    className="
                                        w-full
                                        relative 
                                        flex 
                                        items-center 
                                        h-16
                                        bg-[#ffffff]
                                        p-3 
                                        hover:bg-[#8080807b]
                                        transition
                                        cursor-pointer">
                                    <div className='flex items-center gap-4 justify-center'>
                                        <img
                                            className='w-10 h-10 rounded-full'
                                            src='https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/250384102_1535233720170261_7153752137054069088_n.jpg?_nc_cat=110&cb=99be929b-59f725be&ccb=1-7&_nc_sid=8bfeb9&_nc_eui2=AeHezHK9JKmUNWFB7K84bqpu0FFHZU5R1fzQUUdlTlHV_L4waKg_s2XlwCrDacIghWuqF0N4DHWMOey9-p9bCBHq&_nc_ohc=GZigCuF6zg0AX-cGaT_&_nc_ht=scontent.fbga3-1.fna&oh=00_AfBZFxXVoJ3GMiCe30C2DsqiuD1gYAdjrsI6B8p4WbDimw&oe=64D8EAA8'
                                        />
                                
                                        <div className='flex flex-col'>
                                            <h1 className='text-[1em] text-left text-black text-lg'>Brayan57894</h1>
                                            <div className="flex gap-4 text-[0.8em]">
                                                <h2 className='text-black'>te amo pochita</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div>
                            <div className="flex w-0">
                                <div className="flex ">
                                    <div className="flex pt-2 pl-4 pb-2 gap-2 w-[64vw]">
                                            <img
                                                className='w-10 h-15 rounded-full'
                                                src='https://www.clipartkey.com/mpngs/m/267-2675110_kanye-west-avatar-kanye-avatar.png'
                                            />
                                        <h1 className="font-bold text-lg text-black">Ricardo Villanueva</h1>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col w-[52.8vw] h-[100vh] justify-end bg-gray-100 border-t-2 border-[#0D1B2A]">
                                <div class="flex flex-col justify-between p-4 overflow-y-auto">
                                    <div class="bg-[#778DA9] text-white w-[5em] p-2 rounded-lg mb-2 self-start">Mensaje 1</div>
                                    <div class="flex justify-end">
                                        <div class="bg-[#1B263B] p-2 rounded-lg w-[5em] mb-2">Mensaje 2</div>
                                    </div>
                                </div>
                                <div class="p-4 bg-white flex gap-4 items-center"> 
                                    <input
                                        type="text"
                                        placeholder="Escribe tu mensaje..."
                                        class="w-[46vw] border rounded-lg p-2 focus:outline-none"
                                    />
                                    <button class="">
                                        <BsFillSendFill className="text-[#0D1B2A]"/>
                                    </button>
                                </div>
                            </div>


                        </div>
                        
                        
                    
        {/* Page content here */}
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
    
    </div> 
    <div className="drawer-side border-r-2">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-20 h-full bg-[#0D1B2A] text-base-content">
        {/* Sidebar content here */}
        <li><button> <BsFillChatDotsFill className="text-[#E0E1DD]"/> </button></li>
        <li><button> <BsFillPeopleFill className="text-[#E0E1DD]"/> </button></li>
        <li><button> <BsFillDoorOpenFill className="text-[#E0E1DD]"/> </button></li>
        
        <li className="mt-[70vh]"><img src="https://scontent.fbga3-1.fna.fbcdn.net/v/t39.30808-6/242007867_1215216918952508_4103291446202515352_n.jpg?_nc_cat=111&cb=99be929b-59f725be&ccb=1-7&_nc_sid=174925&_nc_eui2=AeHM5pBNTPTWnHt5tj8ntLBB_GtyjOC3qGH8a3KM4LeoYRJOu1-nX95P5g-GmRHKfhMUFrtnQEQQUVWuoM-Mh5bA&_nc_ohc=ePSg0-TQTkkAX9-VcKJ&_nc_ht=scontent.fbga3-1.fna&oh=00_AfB5ZAHTxGPRCYpHy_9McxUQA-XKaib72pquD4wt-H90Zw&oe=64D49A32" /></li>

        </ul>
    
    </div>
    </div>
            
        </div>
    )
}

export default Chat