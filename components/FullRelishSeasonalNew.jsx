'use client';

import { useState, useMemo } from 'react';
import produceData from '../data/produce_full.json';

const allStates = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

export default function FullRelishSeasonalNew() {
  const [region, setRegion] = useState('AZ');
  const [hoveredItem, setHoveredItem] = useState(null);
  const month = new Date().getMonth() + 1;

  const inSeason = useMemo(() => {
    return produceData.filter(item => {
      const seasons = item.seasonsByRegion[region] || item.seasonsByRegion['US'] || [];
      return seasons.includes(month);
    });
  }, [region, month]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">What’s In Season Today</h1>
      <select
        value={region}
        onChange={e => setRegion(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {allStates.map(state => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {inSeason.map(item => (
          <div
            key={item.name}
            className="p-4 border rounded-lg hover:bg-gray-100 relative"
            onMouseEnter={() => {
              const idx = Math.floor(Math.random() * item.dishes.length);
              setHoveredItem({ name: item.name, dish: item.dishes[idx] });
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="text-3xl">{item.emoji}</div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-gray-500">{item.category}</div>
            {hoveredItem && hoveredItem.name === item.name && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center p-2 text-center text-sm">
                {hoveredItem.dish}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
