// pages/profile.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

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
  const [image , setImage] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('');

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
      setImage(data.user.userAvatar[0]?.url)
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
    
    // Update UI immediately
    setImage(data.image_url);
    setUser(prev => ({
      ...prev,
      userAvatar: [{ url: data.image_url }]
    }));
    
    // Update localStorage immediately
    localStorage.setItem('userImage', data.image_url);
    
    return data.image_url;
  };

  const handleProfileUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();
  
    let imageUrl;
    if (newImage) {
      imageUrl = await handleImageUpload(e);
    } else {
      imageUrl = user?.userAvatar[0]?.url || image; // Default to the existing image
    }
  
    const updatedUser = {};
    if (name) updatedUser.userName = name;
    if (email) updatedUser.email = email;
    if (imageUrl) updatedUser.userAvatar = [{ url: imageUrl }];
    if (password) updatedUser.password = password;
    if (userId) updatedUser.userId = userId;
  
    const response = await fetch(`/api/updateProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });
  
    if (response.ok) {
      alert('Profile updated successfully!');
  
      // Update localStorage with the new values
      if (updatedUser.userName) {
        localStorage.setItem('userName', updatedUser.userName);
      }
      if (updatedUser.userAvatar?.[0]?.url) {
        localStorage.setItem('userImage', updatedUser.userAvatar[0].url);
      }
  
      // Update the state with new values
      setName(updatedUser.userName);
      setEmail(updatedUser.email);
      setImage(updatedUser.userAvatar[0]?.url);
    } else {
      alert('Failed to update profile.');
    }
  
    setLoading(false);
  };
  
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen">
      <Sidebar 
        setIsOpen={() => setSidebarOpen(false)} 
        isOpen={isSidebarOpen} 
      />
        <div className="flex-1 flex flex-col w-[80%]">
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto bg-white p-6">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-2xl font-bold mb-8 text-center">My Information</h1>
                
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <form onSubmit={handleProfileUpdate} className="space-y-8 max-w-3xl mx-auto">
                    {/* Profile Image Section */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-700">Profile Image</label>
                      
                      {/* Current Image Preview */}
                      {(user?.userAvatar?.[0]?.url || image) && (
                        <div className="relative w-32 h-32 group">
                          <img
                            src={user?.userAvatar?.[0]?.url || image}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label htmlFor="image-upload" className="cursor-pointer text-white">
                              Change Photo
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Upload Area */}
                      <div className="relative">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewImage(file);
                              setSelectedFileName(file.name);
                              toast.success('Image selected! Click Update to save changes.');
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                          accept="image/*"
                        />
                        <label
                          htmlFor="image-upload"
                          className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100"
                        >
                          <div className="flex flex-col items-center">
                            <FaUpload className="text-3xl text-gray-400 mb-3" />
                            {selectedFileName ? (
                              <>
                                <span className="text-gray-600 font-medium">Selected file:</span>
                                <span className="text-blue-500 font-medium mt-1">{selectedFileName}</span>
                                <span className="text-sm text-gray-500 mt-1">Click Update to save changes</span>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-600 font-medium">Drop your image here</span>
                                <span className="text-sm text-gray-500 mt-1">or click to browse</span>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col items-center w-full space-y-6">
                      {/* Name and Email row */}
                      <div className="w-full flex flex-col md:flex-row justify-center gap-6">
                        <div className="w-full md:w-[400px]">
                          <label className="text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter your name"
                            required
                          />
                        </div>

                        <div className="w-full md:w-[400px]">
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      {/* Password fields row */}
                      <div className="w-full flex flex-col md:flex-row justify-center gap-6">
                        <div className="w-full md:w-[400px]">
                          <label className="text-sm font-medium text-gray-700">New Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter new password"
                          />
                        </div>

                        <div className="w-full md:w-[400px]">
                          <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Centered, smaller submit button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Updating...
                          </div>
                        ) : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
