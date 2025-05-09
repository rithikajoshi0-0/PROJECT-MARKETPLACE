import React, { useState } from 'react';
import { Tag, DollarSign, X, Laptop, GraduationCap } from 'lucide-react';
import { Domain, domains } from '../lib/supabase';

interface FilterSidebarProps {
  onApplyFilters: (filters: {
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    domain?: string;
  }) => void;
  availableTags: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onApplyFilters, availableTags }) => {
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(selectedDomain === domain ? '' : domain);
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      tag: selectedTag || undefined,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      domain: selectedDomain || undefined,
    });
  };

  const handleResetFilters = () => {
    setSelectedTag('');
    setSelectedDomain('');
    setPriceRange({});
    onApplyFilters({});
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">All Projects (114)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Code Projects (503)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">PhD Papers (32)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">Portfolios (214)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">Instant Download</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Custom Development</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Level</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">Undergraduate</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">Masters</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">PhD</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
              <div className="space-y-2">
                {availableTags.map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                      checked={selectedTag === tag}
                      onChange={() => handleTagSelect(tag)}
                    />
                    <span className="ml-2 text-sm text-gray-600">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
