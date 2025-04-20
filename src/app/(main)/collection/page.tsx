'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Plus, Grid, List, Filter } from 'lucide-react';

interface Stamp {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  year: number;
  country: string;
  category: string;
  addedAt: string;
}

interface UserCollection {
  stamps: Stamp[];
}

export default function CollectionPage() {
  const [user] = useAuthState(auth);
  const [collection, setCollection] = useState<UserCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    country: '',
    year: '',
    category: '',
  });

  useEffect(() => {
    const fetchCollection = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCollection(userDoc.data() as UserCollection);
          }
        } catch (error) {
          console.error('Error fetching collection:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCollection();
  }, [user]);

  const filteredStamps = collection?.stamps.filter(stamp => {
    if (filters.country && stamp.country !== filters.country) return false;
    if (filters.year && stamp.year.toString() !== filters.year) return false;
    if (filters.category && stamp.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Collection
            </h1>
            <p className="text-gray-600">
              {collection?.stamps.length || 0} stamps in your collection
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List size={20} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Add Stamp
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
          </select>
          
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
          </select>
          
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Commemorative">Commemorative</option>
            <option value="Definitive">Definitive</option>
            <option value="Special">Special</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredStamps?.length ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStamps.map((stamp) => (
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
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {stamp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStamps.map((stamp) => (
                <motion.div
                  key={stamp.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-4 bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={stamp.imageUrl}
                      alt={stamp.name}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{stamp.name}</h3>
                    <p className="text-sm text-gray-500">
                      {stamp.year} • {stamp.country} • {stamp.category}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {stamp.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Added on {new Date(stamp.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 py-12">
            No stamps found in your collection.
          </div>
        )}
      </motion.div>
    </div>
  );
} 