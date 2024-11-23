import Link from 'next/link';
import { useRouter } from 'next/router';
import {  FaTimes , FaUserCircle} from 'react-icons/fa';
import { GoCommentDiscussion } from "react-icons/go";
import { CiUser , CiBellOn } from "react-icons/ci";
import { AiOutlineHome } from "react-icons/ai";
import { useEffect, useState } from 'react';
import { GoSponsorTiers } from "react-icons/go";

const Sidebar = ({setIsOpen , isOpen , avatar = null}) => {
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserAvatar = localStorage.getItem('userImage');
    const storedUserName = localStorage.getItem('userName');

    // Set userAvatar to an empty string if it's "null" or null
    setUserAvatar(avatar ? avatar : storedUserAvatar === 'null' ? '' : storedUserAvatar || '');
    setUserName(storedUserName || '');
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('company');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const closeSidebar = () => {
    setIsOpen()
  };

  return (
    <div 
      className={`bg-[#0F172A] shadow-md h-screen w-64 text-black flex flex-col justify-between fixed z-20 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:relative md:w-64`}
    >
      {/* Sidebar Header */}
      <div>
        <div className='sm:hidden flex items-center justify-center'>
          <Link href={"/"} className="flex items-center justify-center my-6 text-2xl font-semibold text-black">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            Automadic
          </Link>
          <FaTimes className='cursor-pointer ml-5 mt-1' onClick={closeSidebar}/>
        </div>
  
        {/* Profile and Username section */}
        <div className='px-6 pt-8'>
          <div className="flex items-center space-x-3 mb-12">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt="Profile"
                className="rounded-full w-[40px] h-[40px]"
              />
            ) : (
              <FaUserCircle 
                className="rounded-full w-[40px] h-[40px] text-gray-400"
              />
            )}
            {userName && (
              <span className="text-gray-200 text-base"> 
                {userName}
              </span>
            )}
          </div>
        </div>
  
        <nav className="flex flex-col space-y-6 px-6">
  {[
    { label: 'Templates' },
    { label: 'Media' },
    { label: 'Datahub' },
    { label: 'Sponsors' },
    { label: 'Profile' },
    { label: 'Werberechte' }
  ].map((item, index) => (
    <Link
      href={item.label === 'Templates' ? '/' : `/${item.label.toLowerCase()}`}
      key={index}
    >
      <div className="flex items-center space-x-2 py-2 hover:bg-gray-800 px-2 rounded transition">
        <span className="text-gray-300 text-lg">
          {item.label}
        </span>
      </div>
    </Link>
  ))}
</nav>




      </div>
  




      {/* Logout Button */}
      <div className="px-6 py-6">
        <div className="w-[60%]">
          <button
            className="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );

};

export default Sidebar;