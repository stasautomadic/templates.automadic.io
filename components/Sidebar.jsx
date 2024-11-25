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

  const menuItems = [
    { name: 'Templates', href: '/templates' },
    { name: 'Media', href: '/media' },
    { name: 'Datahub', href: '/datahub' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Werberechte', href: '/werberechte' },
    { name: 'Profile', href: '/profile' }
  ];

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
  {menuItems.map((item) => (
    <Link 
      key={item.name} 
      href={item.href}
      className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
    >
      {item.name}
    </Link>
  ))}
</nav>




      </div>
  




      {/* Bottom section with logout button */}
      <div className="p-4 mt-auto border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-lg font-medium text-gray-200 border border-gray-500 hover:border-gray-300 hover:text-white transition-all bg-transparent"
        >
          Log out
        </button>
      </div>
    </div>
  );

};

export default Sidebar;