'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
// Use the detailed dataset that includes full recipe information
import produceData from '../data/produce_by_state_detailed.json';

// List of all 50 U.S. state abbreviations
const allStates = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

export default function FullRelishApp() {
  const [region, setRegion] = useState('AZ');
  const [filter, setFilter] = useState('All');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const month = new Date().getMonth() + 1;
  // Build a combined list of fruits and vegetables for the current region.
  // Only include items that are in season for the current month (if seasons are defined)
  // and cap each group at five items so the interface stays streamlined.
  const produceList = useMemo(() => {
    const stateData = produceData[region] || {};
    const fruits = (stateData.fruits || [])
      .filter((f) => !f.seasons || f.seasons.includes(month))
      .slice(0, 5)
      .map((f) => ({ ...f, category: 'Fruit' }));
    const vegetables = (stateData.vegetables || [])
      .filter((v) => !v.seasons || v.seasons.includes(month))
      .slice(0, 5)
      .map((v) => ({ ...v, category: 'Vegetable' }));
    return [...fruits, ...vegetables];
  }, [region, month]);

  // Apply search and category filters
  const filtered = useMemo(() => {
  return produceList.filter((item) => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  }, [produceList, filter, searchTerm]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-pink-50 text-gray-800">
      {/* Hero section with logo and tagline */}
      <header className="py-10 text-center flex flex-col items-center">
        <Image src="/logo.png" alt="Full Relish logo" width={200} height={64} className="mb-4" />
        <h1 className="text-4xl font-bold mb-2">Full Relish</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-xl">
          Discover what's in season across all 50 states and get quick dish ideas to savor the moment.
        </p>
        {/* Controls for region and category */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Search bar for produce */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search produce..."
            className="px-3 py-2 border rounded-md shadow-sm bg-white"
          />
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
              className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              onMouseEnter={() => {
                // pick a random dish for hover overlay
                const idx = Math.floor(Math.random() * item.dishes.length);
                setHoveredItem({ name: item.name, dish: item.dishes[idx] });
              }}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                // when clicking a card, open detailed modal for the first dish by default
                const idx = 0;
                const dish = item.dishes[idx];
                setSelectedDish({
                  produce: item.name,
                  title: dish.title || (typeof dish === 'string' ? dish : ''),
                  ingredients: dish.ingredients || [],
                  instructions: dish.instructions || ''
                });
              }}
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
                  {/* Show just the dish title on hover */}
                  {typeof hoveredItem.dish === 'string' ? hoveredItem.dish : hoveredItem.dish.title}
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

      {/* Modal for selected dish with full recipe details */}
      {selectedDish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-y-auto max-h-[90vh] p-6 relative">
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close recipe"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedDish.title}</h2>
            <p className="text-sm text-gray-600 italic mb-4">Featuring: {selectedDish.produce}</p>
            {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDish.ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-gray-700">
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedDish.instructions && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {selectedDish.instructions}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
