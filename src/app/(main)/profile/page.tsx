'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Camera, Edit2, Save, X } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  joinDate: string;
  collectionSize: number;
  favoriteCategories: string[];
}

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfile({
              name: data.name || '',
              email: user.email || '',
              bio: data.bio || '',
              avatarUrl: data.avatarUrl || '',
              joinDate: data.createdAt || new Date().toISOString(),
              collectionSize: data.collections?.length || 0,
              favoriteCategories: data.favoriteCategories || [],
            });
            setEditedProfile({
              name: data.name || '',
              email: user.email || '',
              bio: data.bio || '',
              avatarUrl: data.avatarUrl || '',
              joinDate: data.createdAt || new Date().toISOString(),
              collectionSize: data.collections?.length || 0,
              favoriteCategories: data.favoriteCategories || [],
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setUploadingAvatar(true);
      try {
        const storageRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        setProfile(prev => prev ? { ...prev, avatarUrl: downloadURL } : null);
        setEditedProfile(prev => prev ? { ...prev, avatarUrl: downloadURL } : null);
        
        await updateDoc(doc(db, 'users', user.uid), {
          avatarUrl: downloadURL,
        });
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (user && editedProfile) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          name: editedProfile.name,
          bio: editedProfile.bio,
          favoriteCategories: editedProfile.favoriteCategories,
        });
        setProfile(editedProfile);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera size={32} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <Camera size={20} className="text-blue-600" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile?.name || ''}
                      onChange={(e) => setEditedProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    profile?.name
                  )}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
              
              <button
                onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 size={20} />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => setEditedProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-gray-600">{profile?.bio || 'No bio yet'}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1 text-gray-600">
                  {new Date(profile?.joinDate || '').toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Collection Size</h3>
                <p className="mt-1 text-gray-600">
                  {profile?.collectionSize} stamps
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Favorite Categories</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {profile?.favoriteCategories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Account Settings
        </h2>
        <div className="space-y-4">
          <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            Change Password
          </button>
          <button className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            Email Preferences
          </button>
          <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
} 