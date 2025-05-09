import React, { useState } from 'react';
import { Tag, DollarSign, X } from 'lucide-react';

interface FilterSidebarProps {
  onApplyFilters: (filters: {
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  availableTags: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onApplyFilters, availableTags }) => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({
      tag: selectedTag || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
    setMobileFiltersOpen(false);
  };
  
  const handleResetFilters = () => {
    setSelectedTag('');
    setPriceRange({});
    onApplyFilters({});
    setMobileFiltersOpen(false);
  };
  
  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          Categories
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <DollarSign className="h-4 w-4 mr-2" />
          Price Range
        </h3>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="min-price" className="block text-xs text-gray-500">
                Min Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="min-price"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value ? Number(e.target.value) : undefined })}
                  min="0"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-2 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label htmlFor="max-price" className="block text-xs text-gray-500">
                Max Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="max-price"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : undefined })}
                  min="0"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-2 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="999"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleApplyFilters}
          className="w-full bg-primary-500 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Filters</h2>
        {filterContent}
      </div>
      
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="bg-primary-500 text-white rounded-full p-4 shadow-lg hover:bg-primary-600 transition-colors"
        >
          <Tag className="h-6 w-6" />
        </button>
      </div>
      
      {/* Mobile Filter Panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-xs">
              <div className="h-full flex flex-col bg-white shadow-xl animate-slide-up">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">
                  {filterContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;