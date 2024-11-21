import { useRouter } from 'next/router';
import Head from 'next/head';
import { Detail } from '@/components/Detail';
import withAuth from '@/components/withAuth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

function DetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const setIsOpen = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      <Head>
        <title>Detail Page</title>
        <meta name="description" content={`Detail page for ID ${id}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen">
      <Sidebar setIsOpen={setIsOpen} isOpen={isSidebarOpen} />
       <div className="flex-1 flex flex-col w-[80%]">
        <Header toggleSidebar={toggleSidebar} />
         <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
            {id ? <Detail id={id} /> : <p>Loading...</p>}
          </main>
        </div>
      </div>
    </>
  );
}

// Export the component wrapped with withAuth to protect the route
export default withAuth(DetailPage);
