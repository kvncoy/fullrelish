'use client';
import { useState, useMemo } from 'react';

export default function FullRelishSeasonal({ produce }) {
  const [region, setRegion] = useState('AZ');
  const month = new Date().getMonth();
  const inSeason = useMemo(() => {
    return produce.filter(item => {
      const seasons = item.seasonsByRegion[region] || item.seasonsByRegion['US'] || [];
      return seasons.includes(month);
    });
  }, [produce, region, month]);

  const handleDish = (item) => {
    if (!item.dishes || item.dishes.length === 0) return;
    const idx = Math.floor(Math.random() * item.dishes.length);
    alert(`${item.name} idea: ${item.dishes[idx]}`);
  };

  const regions = useMemo(() => {
    const set = {};
    produce.forEach(p => {
      Object.keys(p.seasonsByRegion).forEach(r => set[r] = true);
    });
    return Object.keys(set);
  }, [produce]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">What’s in season today?</h1>
      <div className="mb-4">
        <label className="mr-2">Region:</label>
        <select value={region} onChange={e => setRegion(e.target.value)} className="border rounded p-1">
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <ul className="grid grid-cols-2 gap-4">
        {inSeason.map(item => (
          <li key={item.name} className="border p-3 rounded hover:shadow">
            <div className="text-lg">{item.emoji} {item.name}</div>
            <div className="text-sm capitalize">{item.category}</div>
            {item.dishes?.length > 0 && (
              <button onClick={() => handleDish(item)} className="text-blue-600 underline mt-2 text-sm">Dish idea</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
