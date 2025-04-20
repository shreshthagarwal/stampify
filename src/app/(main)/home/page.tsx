'use client';

import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';

interface Stamp {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  year: number;
  country: string;
}

export default function HomePage() {
  const [user] = useAuthState(auth);
  const [recentStamps, setRecentStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentStamps = async () => {
      try {
        const stampsQuery = query(
          collection(db, 'stamps'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        
        const querySnapshot = await getDocs(stampsQuery);
        const stamps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Stamp[];
        
        setRecentStamps(stamps);
      } catch (error) {
        console.error('Error fetching recent stamps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentStamps();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome back, {user?.displayName || 'Philatelist'}!
        </h1>
        <p className="text-gray-600">
          Discover new stamps, connect with fellow collectors, and grow your collection.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recently Added Stamps
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentStamps.map((stamp) => (
              <motion.div
                key={stamp.id}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={stamp.imageUrl}
                    alt={stamp.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{stamp.name}</h3>
                  <p className="text-sm text-gray-500">
                    {stamp.year} • {stamp.country}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add New Stamp
            </button>
            <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              View My Collection
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Community Highlights
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-600">New discussion about rare stamps</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-gray-600">Community event this weekend</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-gray-600">New stamp identification guide</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 