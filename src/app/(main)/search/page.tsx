'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { collection, query, where, getDocs, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Stamp {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  year: number;
  country: string;
  category: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    year: '',
    category: '',
  });
  const [results, setResults] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let stampsQuery: Query = collection(db, 'stamps');
      
      // Apply filters
      if (filters.country) {
        stampsQuery = query(stampsQuery, where('country', '==', filters.country));
      }
      if (filters.year) {
        stampsQuery = query(stampsQuery, where('year', '==', parseInt(filters.year)));
      }
      if (filters.category) {
        stampsQuery = query(stampsQuery, where('category', '==', filters.category));
      }

      const querySnapshot = await getDocs(stampsQuery);
      const stamps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Stamp[];

      // Client-side filtering for name/description search
      const filteredStamps = stamps.filter(stamp => 
        stamp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stamp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filteredStamps);
    } catch (error) {
      console.error('Error searching stamps:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stamps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="flex gap-4">
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
            
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
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
          Search Results
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((stamp) => (
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
          <div className="text-center text-gray-500 py-12">
            No stamps found matching your search criteria.
          </div>
        )}
      </motion.div>
    </div>
  );
} 