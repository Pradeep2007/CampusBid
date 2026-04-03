// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axios';

// const CreateAuction = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [imageFile, setImageFile] = useState(null); // New state for the image file
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'Other',
//     startingPrice: '',
//     durationHours: '24' 
//   });

//   const categories = ['Textbooks', 'Electronics', 'Furniture', 'Lab Equipment', 'Stationery', 'Other'];

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     if (!imageFile) {
//       setError('Please upload an image of the item.');
//       setIsLoading(false);
//       return;
//     }

//     const endTime = new Date();
//     endTime.setHours(endTime.getHours() + parseInt(formData.durationHours));

//     try {
//       // Use FormData to handle the file upload
//       const data = new FormData();
//       data.append('title', formData.title);
//       data.append('description', formData.description);
//       data.append('category', formData.category);
//       data.append('startingPrice', formData.startingPrice);
//       data.append('endTime', endTime.toISOString());
//       data.append('image', imageFile); // This key must match upload.single('image') in backend

//       await api.post('/items', data, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       navigate('/my-auctions');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create auction. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//       <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//         <div className="bg-indigo-600 py-6 px-8">
//           <h2 className="text-2xl font-bold text-white">Create New Auction</h2>
//           <p className="text-indigo-100 mt-1">List your item for sale to other students.</p>
//         </div>

//         <div className="p-8">
//           {error && (
//              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 required
//                 placeholder="e.g., Slightly used Engineering Mathematics 3rd Ed."
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
//               />
//             </div>

//             {/* Image Upload Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
//               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
//                 <div className="space-y-1 text-center">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                     <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                   <div className="flex text-sm text-gray-600">
//                     <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
//                       <span>Upload a photo</span>
//                       <input 
//                         type="file" 
//                         name="image" 
//                         accept="image/*" 
//                         className="sr-only" 
//                         onChange={handleFileChange} 
//                         required
//                       />
//                     </label>
//                     <p className="pl-1">or drag and drop</p>
//                   </div>
//                   <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
//                   {imageFile && <p className="text-sm font-bold text-green-600 mt-2">Selected: {imageFile.name}</p>}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
//                 <input
//                   type="number"
//                   name="startingPrice"
//                   required
//                   min="1"
//                   placeholder="e.g., 500"
//                   value={formData.startingPrice}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 name="description"
//                 required
//                 rows="4"
//                 placeholder="Describe the condition..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
//               ></textarea>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Auction Duration</label>
//               <select
//                 name="durationHours"
//                 value={formData.durationHours}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="12">12 Hours</option>
//                 <option value="24">24 Hours (1 Day)</option>
//                 <option value="48">48 Hours (2 Days)</option>
//                 <option value="72">72 Hours (3 Days)</option>
//                 <option value="168">1 Week</option>
//               </select>
//             </div>

//             <div className="pt-4 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-md transition-all ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//               >
//                 {isLoading ? 'Uploading to Cloudinary...' : 'Publish Auction'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAuction;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null); 
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    startingPrice: '',
    durationHours: '24' // Default to 1 day
  });

  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Lab Equipment', 'Stationery', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!imageFile) {
      setError('Please upload an image of the item.');
      setIsLoading(false);
      return;
    }

    // --- UPDATED LOGIC FOR 5-MINUTE TESTING ---
    const endTime = new Date();
    if (formData.durationHours === '0.083') {
      // If 5 minutes is selected, add minutes instead of hours
      endTime.setMinutes(endTime.getMinutes() + 5);
    } else {
      // Otherwise, add hours as normal
      endTime.setHours(endTime.getHours() + parseInt(formData.durationHours));
    }
    // ------------------------------------------

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('startingPrice', formData.startingPrice);
      data.append('endTime', endTime.toISOString());
      data.append('image', imageFile); 

      await api.post('/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/my-auctions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create auction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8">
          <h2 className="text-2xl font-bold text-white">Create New Auction</h2>
          <p className="text-indigo-100 mt-1">List your item for sale to other students.</p>
        </div>

        <div className="p-8">
          {error && (
             <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Slightly used Engineering Mathematics 3rd Ed."
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Upload a photo</span>
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*" 
                        className="sr-only" 
                        onChange={handleFileChange} 
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                  {imageFile && <p className="text-sm font-bold text-green-600 mt-2">Selected: {imageFile.name}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
                <input
                  type="number"
                  name="startingPrice"
                  required
                  min="1"
                  placeholder="e.g., 500"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Describe the condition, age, or any flaws..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auction Duration 
                {formData.durationHours === '0.083' && <span className="ml-2 text-red-500 font-bold text-xs uppercase animate-pulse">(Test Mode Active)</span>}
              </label>
              <select
                name="durationHours"
                value={formData.durationHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {/* 5 Minutes is roughly 0.083 hours */}
                <option value="0.083">5 Minutes (TESTING ONLY)</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (1 Day)</option>
                <option value="48">48 Hours (2 Days)</option>
                <option value="72">72 Hours (3 Days)</option>
                <option value="168">1 Week</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg shadow-md transition-all active:scale-95 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isLoading ? 'Processing Upload...' : 'Publish Auction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;