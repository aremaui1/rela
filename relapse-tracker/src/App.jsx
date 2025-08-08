import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('relapse-tracker:v1');
    if (saved) {
      const data = JSON.parse(saved);
      setRecords(data.records || {});
      setStreak(data.streak || 0);
      setBestStreak(data.bestStreak || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('relapse-tracker:v1', JSON.stringify({ records, streak, bestStreak }));
  }, [records, streak, bestStreak]);

  const today = new Date().toISOString().split('T')[0];

  function mark(status) {
    const newRecords = { ...records, [today]: status };
    setRecords(newRecords);
    if (status === 'clean') {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6" /> Relapse Tracker
      </h1>
      <p className="mb-2">Hari ini: {today}</p>
      <div className="flex gap-2 mb-4">
        <button onClick={() => mark('clean')} className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded">
          <CheckCircle className="w-4 h-4" /> Tetap Bersih
        </button>
        <button onClick={() => mark('relapse')} className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded">
          <XCircle className="w-4 h-4" /> Relapse
        </button>
      </div>
      <p>Streak sekarang: <strong>{streak}</strong></p>
      <p>Streak terbaik: <strong>{bestStreak}</strong></p>
      <h2 className="mt-4 font-semibold">Catatan:</h2>
      <ul className="list-disc pl-5">
        {Object.entries(records).map(([date, status]) => (
          <li key={date} className={status === 'clean' ? 'text-green-600' : 'text-red-600'}>
            {date}: {status}
          </li>
        ))}
      </ul>
    </div>
  );
}
