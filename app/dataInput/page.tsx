'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { postData } from "../util/predict";

// Type definition for formData state
interface FormData {
  [x: string]: string;
  population_density_band_1_mean_value: string;
  population_density_band_2_mean_value: string;
  population_density_band_3_mean_value: string;
  air_quality_so2_band_1_mean_value: string;
  air_quality_so2_band_2_mean_value: string;
  air_quality_so2_band_3_mean_value: string;
  air_quality_no2_band_1_mean_value: string;
  air_quality_no2_band_2_mean_value: string;
  air_quality_no2_band_3_mean_value: string;
  aai_band_1_mean_value: string;
  aai_band_2_mean_value: string;
  aai_band_3_mean_value: string;
  rainfall_band_1_mean_value: string;
  rainfall_band_2_mean_value: string;
  rainfall_band_3_mean_value: string;
  ndvi_band_1_mean_value: string;
  ndvi_band_2_mean_value: string;
  ndvi_band_3_mean_value: string;
  lst_band_1_mean_value: string;
  lst_band_2_mean_value: string;
  lst_band_3_mean_value: string;
  ward: string;
}

// InputField component for reusability
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
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
  options
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
    population_density_band_1_mean_value: '',
    population_density_band_2_mean_value: '',
    population_density_band_3_mean_value: '',
    air_quality_so2_band_1_mean_value: '',
    air_quality_so2_band_2_mean_value: '',
    air_quality_so2_band_3_mean_value: '',
    air_quality_no2_band_1_mean_value: '',
    air_quality_no2_band_2_mean_value: '',
    air_quality_no2_band_3_mean_value: '',
    aai_band_1_mean_value: '',
    aai_band_2_mean_value: '',
    aai_band_3_mean_value: '',
    rainfall_band_1_mean_value: '',
    rainfall_band_2_mean_value: '',
    rainfall_band_3_mean_value: '',
    ndvi_band_1_mean_value: '',
    ndvi_band_2_mean_value: '',
    ndvi_band_3_mean_value: '',
    lst_band_1_mean_value: '',
    lst_band_2_mean_value: '',
    lst_band_3_mean_value: '',
    ward: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Trim any potential leading/trailing spaces and log the formData to ensure it's updated correctly
    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );
  
    console.log("Trimmed Form Data:", trimmedFormData);
  
    // Validate form data before submission
    const emptyFields = Object.values(trimmedFormData).some((value) => value === "");
  
    if (emptyFields) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    // Log the formData to ensure it is correctly structured
    console.log("Form data being submitted:", trimmedFormData);
  
    try {
      // Sending data to the backend
      const response = await postData(trimmedFormData);
  
      // Check if the response is successful
      if (response && response.status === 200) {
        console.log("Response from backend:", response);
  
        // Store response in localStorage for the results page
        localStorage.setItem('resultData', JSON.stringify(response.data));
  
        // Navigate to the results page
        router.push('/results');
      } else {
        alert("Unexpected response from server. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
  
      // Show a user-friendly error message
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
                  label={`Land Surface Temperature (Band ${band})`} 
                  name={`lst_band_${band}_mean_value`} 
                  value={formData[`lst_band_${band}_mean_value`]} 
                  onChange={handleChange}
                  type="number"
                />
                <InputField 
                  label={`Aerosol Index (Band ${band})`} 
                  name={`aai_band_${band}_mean_value`} 
                  value={formData[`aai_band_${band}_mean_value`]} 
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
              </div>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-4 mb-6">
            <SelectField 
              label="Ward" 
              name="ward" 
              value={formData.ward} 
              onChange={handleChange}
              options={['Kibera']}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#0A7334] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#0A7334] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
