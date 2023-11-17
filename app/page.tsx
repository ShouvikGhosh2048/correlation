"use client";

import { useState, useEffect } from 'react';

function correlation(points: [number, number][]) {
  const meanX = points.reduce((currSum, point) => currSum + point[0], 0) / points.length;
  const varX = points.reduce((currSum, point) => currSum + (point[0] - meanX) * (point[0] - meanX), 0) / points.length;

  const meanY = points.reduce((currSum, point) => currSum + point[1], 0) / points.length;
  const varY = points.reduce((currSum, point) => currSum + (point[1] - meanY) * (point[1] - meanY), 0) / points.length;

  const covariance = points.reduce((currSum, point) => currSum + (point[0] - meanX) * (point[1] - meanY), 0) / points.length;
  return covariance / (Math.sqrt(varX) * Math.sqrt(varY));
}

function randomPoints() {
  const points: [number, number][] = [];

  const a = Math.random() * 2 - 1;
  const b = Math.random() * 2 - 1;
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    points.push([x, (a * x + b * y) / 2]);
  }

  return points;
}

export default function Home() {
  const [points, setPoints] = useState<[number, number][]>([]);
  const [guess, setGuess] = useState('0.0');
  const [actual, setActual] = useState<null | number>(null);

  useEffect(() => {
    setPoints(randomPoints());
  }, []);

  return (
    <div className="m-auto max-w-xs space-y-3 flex flex-col items-center p-2.5">
      <p className="text-2xl">Correlation</p>
      <svg
        className="border"
        width="300px"
        height="300px"
        viewBox="-1 -1 2 2"
        xmlns="http://www.w3.org/2000/svg">
        {points.map((point, index) => <circle key={index} cx={point[0]} cy={-point[1]} r="0.02" />)}
      </svg>
      {actual === null && (
        <form onSubmit={(e) => {
          e.preventDefault();
          const actual = correlation(points);
          setActual(actual);
          fetch('/correlation', {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
              guess: Number.parseFloat(guess),
              actual,
            })
          });
        }}
          className="flex gap-3">
          <input
            className="border p-1 rounded"
            value={guess} onChange={(e) => { setGuess(e.target.value); }}
            type="number" min="-1" max="1" step="any" required />
          <input type="submit" value="Guess" className="bg-slate-800 text-white p-1 rounded cursor-pointer" />
        </form>
      )}
      {actual !== null && (
        <div className="w-full space-y-1">
          <p>Correlation: {actual}</p>
          <p>Guess: {guess}</p>
          <button onClick={() => {
            setPoints(randomPoints());
            setGuess('0.0');
            setActual(null);
          }}
            className="bg-slate-800 text-white p-1 rounded cursor-pointer">Generate new points</button>
        </div>
      )}
      <div className="space-y-3">
        <p className="w-full mt-5">About</p>
        <p>A website for seeing how people are at guessing the correlation of points. This website collects the actual and guessed correlations. The collected data can be viewed <a href="/results" className="underline">here</a>.</p>
        <p>The website is built with Next.js and hosted on Vercel. The code is available <a href="https://github.com/ShouvikGhosh2048/correlation" className="underline">here</a>.</p>
      </div>
    </div>
  )
}
