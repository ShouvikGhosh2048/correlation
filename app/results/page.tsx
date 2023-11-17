"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, LinearScale, PointElement, Legend } from 'chart.js';
import { Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, Legend);

export default function Results() {
    const [results, setResults] = useState<{ actual: number, guess: number }[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/correlation').then(async (res) => {
            try {
                if (!res.ok) {
                    setError("Couldn't fetch the correlations.");
                }
                const results = await res.json();
                setResults(results);
            } catch {
                setError("Couldn't fetch the correlations.");
            }
        });
    }, []);

    return (
        <div className="m-auto max-w-xs space-y-3 flex flex-col items-center p-2.5">
            <p className="text-2xl">Results</p>
            <div className="flex items-center justify-center h-80">
                {error !== '' && <span>{error}</span>}
                {error === '' && results.length === 0 && <span>Fetching results...</span>}
                {error === '' && results.length !== 0 && (
                    <div>
                        <Scatter
                            data={{
                                datasets: [
                                    {
                                        label: 'Results',
                                        data: results.map(result => ({
                                            x: result.actual,
                                            y: result.guess,
                                        })),
                                        backgroundColor: 'black',
                                    }
                                ]
                            }}
                            options={{
                                scales: {
                                    x: {
                                        min: -1,
                                        max: 1,
                                        title: {
                                            display: true,
                                            text: 'Actual',
                                        }
                                    },
                                    y: {
                                        min: -1,
                                        max: 1,
                                        title: {
                                            display: true,
                                            text: 'Guess',
                                        }
                                    }
                                },
                                elements: {
                                    point: {
                                        radius: 2,
                                    }
                                },
                                maintainAspectRatio: false,
                                responsive: true,
                            }}
                            width={300}
                            height={300}
                        />
                    </div>
                )}
            </div>
            <p>A JSON API for the results is available <a href="/correlation" className="underline">here</a>.</p>
            <a href="/" className="underline">Back to home</a>
        </div>
    );
}