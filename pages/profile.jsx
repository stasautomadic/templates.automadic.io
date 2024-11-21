// pages/profile.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { FaUpload } from 'react-icons/fa';

const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); // Replace 'any' with your user type
  const [newImage, setNewImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      setUser(data.user);
      setName(data.user.userName);
      setEmail(data.user.Email);
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('file', newImage);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });


    if (!response.ok) {
      console.log(response)
    }

    const data = await response.json();
    return data.image_url; // Return the uploaded image URL
  };

  const handleProfileUpdate = async (e) => {
    setLoading(true)
    e.preventDefault();
    let imageUrl;

    // Handle image upload if a new image is provided
    if (newImage) {
      imageUrl = await handleImageUpload();
    } else {
      imageUrl = user.userAvatar; // Keep the old image if no new one is uploaded
    }

    const updatedUser = {
      userId,
      userName: name,
      email,
      userAvatar: [{ url: imageUrl }],
      ...(password && { password }), 
    };

    // Send updated user info to your API
    const response = await fetch(`/api/updateProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.ok) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
    setLoading(false)
  };

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen">
        <Sidebar setIsOpen={() => setSidebarOpen(false)} isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col w-[80%]">
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto bg-white p-6">
            <div className="container mx-auto px-4">
              <h4 className="my-5">My Information</h4>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {user?.userAvatar ? (
                    <img src={user.userAvatar} alt="Profile" className="mt-2 h-24 w-24 object-cover" />
                  ) : 
                  <div className='w-[91%]'>
                  <label className="block text-sm font-medium">Profile Image</label>
                  <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors duration-300 cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                    className="hidden" // Hide the default input
                    id="image-upload" // Associate label with input
                  />
                  <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                    <FaUpload className="text-3xl text-gray-500 mb-2" /> {/* Upload icon */}
                    <span className="text-gray-600">Drag & Drop your image here</span>
                    <span className="text-gray-400 text-sm">or click to browse</span>
                  </label>
                </div>
              </div>
                  }

                <div className="flex space-x-4">
                  <div className='w-[45%]'>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="border p-2 rounded"
                    />
                  </div>

                  <div className='w-[45%]'>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border p-2 rounded"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <div className='w-[45%]'>
                    <label className="block text-sm font-medium">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border p-2 rounded"
                    />
                  </div>

                  <div className='w-[45%]'>
                    <label className="block text-sm font-medium">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border p-2 rounded"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-[2rem] bg-blue-600 text-white p-3 rounded-full w-[150px]"
                >
                  {loading ? 'Updating ...' : 'Update'}
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
