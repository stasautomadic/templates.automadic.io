import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {

  return (
    <header className="bg-white sm:hidden sm:shadow-0 shadow-lg text-black px-6 py-6 flex justify-between items-center shadow-lg">
      <div className="text-lg font-bold">
        <FaBars className="text-2xl cursor-pointer sm:hidden" onClick={toggleSidebar} />
      </div>
    </header>
  );
};

export default Header;
