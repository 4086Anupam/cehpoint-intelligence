import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
}

export default function MultiSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select options',
  required = false,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeItem = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const getLabel = (val: string) => {
    return options.find(opt => opt.value === val)?.label || val;
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div
          className="w-full min-h-[48px] px-4 py-2 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 outline-none transition-all text-gray-900 bg-white cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {value.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              value.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(val);
                  }}
                >
                  {getLabel(val)}
                  <X className="w-3 h-3 cursor-pointer hover:text-blue-900" />
                </span>
              ))
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                  value.includes(option.value) ? 'bg-blue-50' : ''
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => {}} // Handled by parent onClick
                  readOnly
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className={`text-gray-800 ${value.includes(option.value) ? 'font-semibold' : ''}`}>
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden input for HTML5 form validation - required by browsers */}
      {required && value.length === 0 && (
        <input
          type="text"
          value=""
          onChange={() => {}} // Required by React for controlled component
          required
          className="absolute opacity-0 pointer-events-none"
          tabIndex={-1}
          aria-hidden="true"
        />
      )}

      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {value.length} region{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
