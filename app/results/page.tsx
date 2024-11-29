'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; 
import { useSearchParams } from 'next/navigation';

// Define the type for the prediction results
interface PredictionResults {
  predicted_green_space_need_category: string;
  predicted_green_space_need_score: number;
  error?: string; 
}

const Results = () => {
  const [resultData, setResultData] = useState<PredictionResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const score = searchParams.get('score');

  useEffect(() => {
    if (category && score) {
      const resultData: PredictionResults = {
        predicted_green_space_need_category: category,
        predicted_green_space_need_score: parseFloat(score),
      };
      setResultData(resultData);
    } else {
      setError('Missing required query parameters.');
    }
  }, [category, score]);

  return (
    <div
      className="relative flex flex-col items-center justify-start h-screen bg-cover bg-center pt-4"
      style={{ backgroundImage: "url('/images/forest.png')" }}
    >
      {/* Heading Section */}
      <div className="flex">
        <div className="bg-green-500 w-[10%] h-[80px]"></div>
        <div className="flex items-center h-[80px] justify-center bg-[#D9D9D9] bg-opacity-20 text-white w-[1290px] px-4 py-2">
          <h1 className="text-4xl font-bold">Green Space Need Prediction</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col p-4 mb-2">
        {/* Top Section */}
        <div className="flex gap-0">
          <div className="bg-[#173E63] text-white flex flex-col items-center justify-center w-[250px]">
            <Image
              src="/images/Vector.png"
              alt="Vector Icon"
              width={90}
              height={90}
              className="object-contain mb-4"
            />
            <h3 className="text-2xl font-bold">Green Space Need Score</h3>
          </div>
          <div className="border-white h-[200px]"></div>
          <div className="bg-[#0A7334] text-white flex flex-col items-center justify-center w-[250px]">
            <Image
              src="/images/Group.png"
              alt="Group Icon"
              width={90}
              height={90}
              className="object-contain mb-4"
            />
            <h3 className="text-2xl font-bold mt-4">Categorized Level</h3>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="border-t-2 border-white"></div>
        <div className="flex gap-0">
          <div className="bg-[#173E63] text-white h-[100px] flex items-center justify-center w-[250px]">
            <h3 className="text-2xl font-bold">
              {resultData ? resultData.predicted_green_space_need_score.toFixed(2) : 'Loading...'}
            </h3>
          </div>
          <div className="border-white h-full"></div>
          <div className="bg-[#0A7334] text-white flex items-center justify-center w-[250px]">
            <h3 className="text-xl font-bold">
              {resultData ? resultData.predicted_green_space_need_category : 'Loading...'}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
