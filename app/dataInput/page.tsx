'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { postData } from "../util/predict";

// Type definition for formData state
interface FormData {
  [x: string]: number | string;
  population_density_band_1_mean_value: number;
  population_density_band_2_mean_value: number;
  population_density_band_3_mean_value: number;
  air_quality_so2_band_1_mean_value: number;
  air_quality_so2_band_2_mean_value: number;
  air_quality_so2_band_3_mean_value: number;
  air_quality_no2_band_1_mean_value: number;
  air_quality_no2_band_2_mean_value: number;
  air_quality_no2_band_3_mean_value: number;
  aai_band_1_mean_value: number;
  aai_band_2_mean_value: number;
  aai_band_3_mean_value: number;
  rainfall_band_1_mean_value: number;
  rainfall_band_2_mean_value: number;
  rainfall_band_3_mean_value: number;
  ndvi_band_1_mean_value: number;
  ndvi_band_2_mean_value: number;
  ndvi_band_3_mean_value: number;
  lst_band_1_mean_value: number;
  lst_band_2_mean_value: number;
  lst_band_3_mean_value: number;
  ward: string;
}

// InputField component for reusability
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "number",
}: {
  label: string | number;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number"; // type can be "text" or "number"
}) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
    >
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const InputData = () => {
  const [formData, setFormData] = useState<FormData>({
    population_density_band_1_mean_value: 0,
    population_density_band_2_mean_value: 0,
    population_density_band_3_mean_value: 0,
    air_quality_so2_band_1_mean_value: 0,
    air_quality_so2_band_2_mean_value: 0,
    air_quality_so2_band_3_mean_value: 0,
    air_quality_no2_band_1_mean_value: 0,
    air_quality_no2_band_2_mean_value: 0,
    air_quality_no2_band_3_mean_value: 0,
    aai_band_1_mean_value: 0,
    aai_band_2_mean_value: 0,
    aai_band_3_mean_value: 0,
    rainfall_band_1_mean_value: 0,
    rainfall_band_2_mean_value: 0,
    rainfall_band_3_mean_value: 0,
    ndvi_band_1_mean_value: 0,
    ndvi_band_2_mean_value: 0,
    ndvi_band_3_mean_value: 0,
    lst_band_1_mean_value: 0,
    lst_band_2_mean_value: 0,
    lst_band_3_mean_value: 0,
    ward: "", // Ward should be a string
  });

  const router = useRouter(); // Initialize the useRouter hook to navigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Update form data: process numerical fields as numbers, 'ward' remains a string
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value, // If it's a number input, parse it as float
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send formData to backend as is because it's already processed
      const response = await postData(formData);
      console.log({response});
      
      // Redirect to the results page after submission
      router.push('/results'); // Adjust this path if needed

    } catch (error) {
      console.error("Error submitting data:", error);
      alert("There was an error processing your request. Please try again.");
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/forest.png')" }}
    >
      <div className="flex">
        <div className="bg-[#0A7334] w-[10%] h-[60px]"></div>
        <div className="flex items-center h-[60px] justify-center bg-[#D9D9D9] bg-opacity-20 text-white w-[1160px] px-4 py-1">
          <h1 className="text-4xl font-bold">Input data to analyze green space needs</h1>
        </div>
      </div>

      <div className="flex justify-center items-center p-4 w-[900px]">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl sm:max-w-6xl"
        >
          {[1, 2, 3].map((band) => (
            <div key={band}>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <InputField 
                  label={`Population Density (Band ${band})`} 
                  name={`population_density_band_${band}_mean_value`} 
                  value={formData[`population_density_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
                <InputField 
                  label={`NDVI (Band ${band})`} 
                  name={`ndvi_band_${band}_mean_value`} 
                  value={formData[`ndvi_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
                <InputField 
                  label={`Rainfall (Band ${band})`} 
                  name={`rainfall_band_${band}_mean_value`} 
                  value={formData[`rainfall_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <InputField 
                  label={`Air Quality SO2 (Band ${band})`} 
                  name={`air_quality_so2_band_${band}_mean_value`} 
                  value={formData[`air_quality_so2_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
                <InputField 
                  label={`Air Quality NO2 (Band ${band})`} 
                  name={`air_quality_no2_band_${band}_mean_value`} 
                  value={formData[`air_quality_no2_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
                <InputField 
                  label={`AAI (Band ${band})`} 
                  name={`aai_band_${band}_mean_value`} 
                  value={formData[`aai_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4 mb-8">
            <InputField 
              label="Ward" 
              name="ward" 
              value={formData.ward} 
              onChange={handleChange}
              type="text"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-[#0A7334] hover:bg-green-700 font-semibold py-2 px-6 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputData;
