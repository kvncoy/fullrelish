'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import produceData from '../data/produce_by_state.json';

// List of all 50 U.S. state abbreviations
const allStates = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

export default function FullRelishApp() {
  const [region, setRegion] = useState('AZ');
  const [filter, setFilter] = useState('All');
  const [hoveredItem, setHoveredItem] = useState(null);
  const month = new Date().getMonth() + 1;
  // Build a combined list of fruits and vegetables for the current region
  const produceList = useMemo(() => {
    const stateData = produceData[region] || {};
    const fruits = (stateData.fruits || []).map((f) => ({ ...f, category: 'Fruit' }));
    const vegetables = (stateData.vegetables || []).map((v) => ({ ...v, category: 'Vegetable' }));
    return [...fruits, ...vegetables];
  }, [region]);

  // Apply category filter (All/Fruit/Vegetable)
  const filtered = useMemo(() => {
    return produceList.filter((item) => filter === 'All' || item.category === filter);
  }, [produceList, filter]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 text-gray-800">
      {/* Hero section with logo and tagline */}
      <header className="py-10 text-center flex flex-col items-center">
        <Image src="/logo.png" alt="Full Relish logo" width={200} height={64} className="mb-4" />
        <h1 className="text-4xl font-bold mb-2">Full Relish</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl">
          Discover what's in season across all 50 states and get quick dish ideas to savor the moment.
        </p>
        {/* Controls for region and category */}
        <div className="flex flex-wrap gap-4 justify-center">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-2 border rounded-md shadow-sm bg-white"
          >
            {allStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            {['All', 'Fruit', 'Vegetable'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-md border shadow-sm transition-colors ${
                  filter === option ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </header>
      {/* Produce grid */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              onMouseEnter={() => {
                const idx = Math.floor(Math.random() * item.dishes.length);
                setHoveredItem({ name: item.name, dish: item.dishes[idx] });
              }}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Produce image */}
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={300}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="font-bold text-lg mb-1">{item.name}</div>
                <div className="text-sm text-gray-500 capitalize">{item.category}</div>
              </div>
              {hoveredItem && hoveredItem.name === item.name && (
                <div className="absolute inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center rounded-xl p-6 text-center text-base font-medium shadow-inner">
                  {hoveredItem.dish}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No produce items in season for this state and category.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
