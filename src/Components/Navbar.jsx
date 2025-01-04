import React, {useState} from 'react'
import { IoSearch } from "react-icons/io5";
import  { Link } from "react-router-dom";
import { navlinks } from '../Constant';
import { IoIosMenu } from "react-icons/io";
import { AiOutlineClose } from 'react-icons/ai'
import { IoIosSearch } from "react-icons/io";
import { sideVariants, itemVariants } from '../Utils/Motion';
import { AnimatePresence, motion } from "framer-motion";
const Navbar = () => {
  
  const [isMenuOpen, setMenuOpen] = useState(false)

  //HANDLES OUR TOGGLING EVENT
  const handleMenuClick = () => {
    setMenuOpen((prevState) => !prevState);
  };


  return (
    <>
    
    <nav className='z-10 hidden md:flex lg:flex justify-around fixed w-full bg-[#ffffff]'>
      <Link to={'/'} className='w-[12%] h-12 cursor-pointer mt-1'>
      <h2 className='mt-[8px] rubik-vinyl-regular ml-4' style={{color: '#f52415', position:'relative', left:"-50px", fontSize:'28px', fontWeight:'bolder', fontFamily:'Rubik Vinyl'}}>Exla.</h2>
      </Link>
      <div className='flex items-center justify-between lg:w-[40%] md:w-[50%] mt-1'>
      {navlinks.map ((link, index)=> {
              return(
                  <div key={index}>
                      <Link to={link.url} className='list-none'>{link.title}</Link>
                  </div>
              )
          })}
        </div>
        <Link to={'/search'}>
        <IoIosSearch  size='10px' className='w-[40px] h-[30px]  '  style={{position:'relative', right:"-100px", top:'14px',}}/>
        </Link>
        <Link to={'/login'}>
      <button className='w-[100px] h-[35px] rounded-xl border-[1px] mt-3'>Login</button>
      </Link>
      </nav>

      
    {/* mobile navbar */}
    <nav className='z-10 md:hidden flex w-[100%] bg-[#ffffff] justify-evenly pb-[10px] fixed'>
      <div className='pt-5 px-2 flex justify-around'>

        <div className='w-[40%]'>
        <Link to={'/'}>
        <h2 className='mt-[-9px]' style={{color: '#f52415', position:'relative', left:"-50px", fontSize:'28px', fontWeight:'bolder'}}  >Exla</h2>
        </Link></div>
        <Link to={'/search'}>
        <IoSearch  className='w-[40px] h-[30px]  '  style={{position:'relative', right:"-147px",}}/>
        </Link>
      </div>
     
      <div className="w-[10%] pt-3  mt-0.5 " onClick={handleMenuClick}>
      {isMenuOpen ? (
         <AiOutlineClose size='40px' cursor="pointer"  style={{color: '#000', position:'relative', right:"-50px"}}  />
       ) : (
        <IoIosMenu  size='40px' cursor="pointer"   style={{color: '#000', position:'relative', right:"-50px"}} />
       )}
      </div>
    </nav>

       <AnimatePresence>
          {
            isMenuOpen && (
              <motion.aside             initial={{ width: 0 }}
              animate={{
              width: 500
              }}
              exit={{
              width: 0,
              transition: { delay: 0.7, duration: 0.3 }
              }}
              >
                <motion.div
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sideVariants}
                  className="nav-container md:hidden border flex flex-col fixed text-black w-[400px]  mt-[9vh] h-[650px] justify-around items-center  text-center z-10 rounded-2xl pt-4 bg-[#ffffff]"
                  >
                    <div className='flex flex-col   items-center w-[39%]' onClick={handleMenuClick}>
                        {
                          navlinks.map((link)=>{
                            return (
                              <motion.div className="flex flex-col  text-[18px]" key={link.name}>
                                  <Link to={link.url }><hr className='bg-black w-[400px]'></hr><br/>
                                  <motion.div variants={itemVariants} className='list-none p-3'>{link.title}</motion.div>
                                  </Link>
                              </motion.div>
                            )
                          })
                        }
                    </div>
                    <motion.div className='mt-[-7vh]'>
                    <motion.button
                    variants={itemVariants}
                    className="w-[133px] h-[46px] text-black bg-[#f52415] font-bold rounded-xl  text-[14px] mr-[-9.8em]  "
                    >
                    Sign up
                    </motion.button>

                    <Link to={'/login'}>
                    <motion.button
                    variants={itemVariants}
                    className='w-[130px] h-[45px] 
                    rounded-xl border-[1px] border-[#000]
                    text-black bg-[#ffffff]  
                    font-bold   text-[14px] 
                    ml-[-10.8em]  mt-[-31px]align-top'> Login
                    </motion.button>
                    </Link>
                    </motion.div>
                </motion.div>
              </motion.aside>
            )
          }
       </AnimatePresence>
    </>
  )
}

export default Navbar