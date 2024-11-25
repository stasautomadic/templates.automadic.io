// pages/profile.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { FaUpload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

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
      setImage(data.user.userAvatar[0]?.url);
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setSelectedFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('file', newImage);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
    }

    const data = await response.json();
    return data.image_url;
  };

  const handleProfileUpdate = async (e) => {
    setLoading(true);
    e.preventDefault();

    let imageUrl;
    if (newImage) {
      imageUrl = await handleImageUpload(e);
    } else {
      imageUrl = user?.userAvatar[0]?.url || image;
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
      if (updatedUser.userAvatar?.[0]?.url) {
        setImage(updatedUser.userAvatar[0].url);
        localStorage.setItem('userImage', updatedUser.userAvatar[0].url);
        
        setUser(prev => ({
          ...prev,
          userAvatar: [{ url: updatedUser.userAvatar[0].url }]
        }));

        const imageUpdateEvent = new CustomEvent('profileImageUpdate', {
          detail: { newImageUrl: updatedUser.userAvatar[0].url }
        });
        window.dispatchEvent(imageUpdateEvent);
      }

      if (updatedUser.userName) {
        localStorage.setItem('userName', updatedUser.userName);
      }

      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }

    setLoading(false);
    setPreviewImage(null);
  };

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User profile page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen bg-gray-50">
        <Sidebar setIsOpen={() => setSidebarOpen(false)} isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col w-[80%]">
          <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  {/* Profile Image Section */}
                  <div className="flex items-start space-x-8">
                    {/* Current/Preview Image */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <img
                          src={previewImage || user?.userAvatar?.[0]?.url || image || '/default-avatar.png'}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      </div>
                    </div>

                    {/* Upload Section */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                      <div className="relative">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-blue-500 bg-gray-50 hover:bg-gray-50/80">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="image-upload"
                            accept="image/*"
                          />
                          <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer">
                            <div className="p-4 rounded-full bg-blue-50 mb-4">
                              <FaUpload className="w-6 h-6 text-blue-500" />
                            </div>
                            {selectedFileName ? (
                              <div className="text-center">
                                <span className="text-sm font-medium text-gray-900">{selectedFileName}</span>
                                <span className="block text-xs text-gray-500 mt-1">Click to change</span>
                              </div>
                            ) : (
                              <>
                                <span className="text-sm font-medium text-gray-700">Drop your image here</span>
                                <span className="text-xs text-gray-500 mt-1">or click to browse</span>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
