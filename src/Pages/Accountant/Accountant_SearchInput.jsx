import React from 'react';

const Accountant_SearchInput = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    placeholder={placeholder}
    className="w-full p-2 border rounded-md mb-4 text-sm sm:text-base"
    value={value}
    onChange={onChange}
  />
);

export default Accountant_SearchInput;