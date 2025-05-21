import React, { useState } from 'react';
import { useMode } from '../components/pythia/Layout';

// Define types for form state, can be expanded
interface NewMarketForm {
  question: string;
  category: string;
  endDate: string;
  description: string;
  initialLiquidity: string;
  marketType: 'continuous' | 'discrete';
  // For discrete markets
  discreteOptions?: string[];
  // For continuous markets (simplified)
  minRange?: string;
  maxRange?: string;
}

export default function CreateMarketPage() {
  const { mode } = useMode();
  const [formState, setFormState] = useState<NewMarketForm>({
    question: '',
    category: 'Other',
    endDate: '',
    description: '',
    initialLiquidity: '',
    marketType: 'continuous',
    discreteOptions: ['', ''],
    minRange: '',
    maxRange: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDiscreteOptionChange = (index: number, value: string) => {
    const newOptions = [...(formState.discreteOptions || [])];
    newOptions[index] = value;
    setFormState(prevState => ({ ...prevState, discreteOptions: newOptions }));
  };

  const addDiscreteOption = () => {
    setFormState(prevState => ({
      ...prevState,
      discreteOptions: [...(prevState.discreteOptions || []), ''],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement market creation logic (e.g., send to backend, add to mockMarkets)
    console.log('New Market Data:', formState);
    alert('Market creation submitted (see console for data)!');
    // Reset form or redirect
  };

  // Mode-specific styles
  const bgColor = mode === 'pro' ? 'bg-poseidon-deep-blue' : 'bg-light-bg';
  const textColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-light-text-main';
  const cardBgColor = mode === 'pro' ? 'bg-poseidon-mid-blue' : 'bg-light-surface';
  const cardBorderColor = mode === 'pro' ? 'border-poseidon-border/30' : 'border-light-border';
  const headerTextColor = mode === 'pro' ? 'text-poseidon-accent-cyan' : 'text-light-accent-primary';
  const inputBgColor = mode === 'pro' ? 'bg-poseidon-deep-blue/30' : 'bg-light-bg';
  const inputBorderColor = mode === 'pro' ? 'border-poseidon-border/30' : 'border-slate-300';
  const inputFocusRingColor = mode === 'pro' ? 'focus:ring-poseidon-accent-cyan/30 focus:border-poseidon-accent-cyan/30' : 'focus:ring-light-accent-primary focus:border-light-accent-primary';
  const buttonBgColor = mode === 'pro' ? 'bg-poseidon-accent-cyan hover:bg-cyan-400' : 'bg-light-accent-primary hover:bg-blue-600';
  const buttonTextColor = mode === 'pro' ? 'text-poseidon-deep-blue' : 'text-white';
  const secondaryButtonBgColor = mode === 'pro' ? 'bg-poseidon-border hover:bg-poseidon-border/70' : 'bg-slate-200 hover:bg-slate-300';
  const secondaryButtonTextColor = mode === 'pro' ? 'text-poseidon-light-text' : 'text-slate-700';

  const commonInputClass = `w-full p-2.5 rounded-md ${inputBgColor} ${textColor} border ${inputBorderColor} focus:outline-none focus:ring-1 ${inputFocusRingColor} transition-colors hover:border-poseidon-border/50`;
  const selectClass = `${commonInputClass} appearance-none bg-no-repeat bg-right pr-10 [background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]`;

  const marketCategories = ['Crypto', 'Politics', 'Technology', 'Climate', 'Sports', 'Economics', 'Space', 'Entertainment', 'Automotive', 'Energy', 'Demographics', 'Other'];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${bgColor} ${textColor} min-h-full font-['Readex Pro']`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-center ${headerTextColor}`}>Create New Market</h1>
        <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-lg shadow-xl ${cardBgColor} border ${cardBorderColor} space-y-6 min-h-[600px] flex flex-col`}>
          <div className="flex-grow">
          <div>
            <label htmlFor="question" className="block text-sm font-medium mb-1">Market Question</label>
            <input type="text" name="question" id="question" value={formState.question} onChange={handleInputChange} className={commonInputClass} required />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea name="description" id="description" rows={3} value={formState.description} onChange={handleInputChange} className={commonInputClass}></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select name="category" id="category" value={formState.category} onChange={handleInputChange} className={selectClass}>
                {marketCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1">Resolution Date</label>
              <input type="date" name="endDate" id="endDate" value={formState.endDate} onChange={handleInputChange} className={commonInputClass} required />
            </div>
          </div>
          
          <div>
            <label htmlFor="marketType" className="block text-sm font-medium mb-1">Market Type</label>
              <select name="marketType" id="marketType" value={formState.marketType} onChange={handleInputChange} className={selectClass}>
              <option value="continuous">Continuous (Distribution)</option>
              <option value="discrete">Discrete (Yes/No, Multiple Choice)</option>
            </select>
          </div>

          {formState.marketType === 'continuous' && (
            <div className="space-y-4 p-4 border border-dashed rounded-md ${inputBorderColor}">
              <h3 className={`text-md font-semibold ${headerTextColor}`}>Continuous Market Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="minRange" className="block text-sm font-medium mb-1">Minimum Value (Optional)</label>
                    <input type="number" name="minRange" id="minRange" value={formState.minRange} onChange={handleInputChange} className={commonInputClass} placeholder="e.g., 0 or 1000"/>
                </div>
                <div>
                    <label htmlFor="maxRange" className="block text-sm font-medium mb-1">Maximum Value (Optional)</label>
                    <input type="number" name="maxRange" id="maxRange" value={formState.maxRange} onChange={handleInputChange} className={commonInputClass} placeholder="e.g., 100 or 100000"/>
                </div>
              </div>
               <p className="text-xs text-gray-500">Define the possible range for prediction values. These can help guide users but aren't strict limits for trading.</p>
            </div>
          )}

          {formState.marketType === 'discrete' && (
            <div className="space-y-4 p-4 border border-dashed rounded-md ${inputBorderColor}">
              <h3 className={`text-md font-semibold ${headerTextColor}`}>Discrete Market Options</h3>
              {formState.discreteOptions?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={option} 
                    onChange={(e) => handleDiscreteOptionChange(index, e.target.value)} 
                    className={commonInputClass} 
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {/* Basic remove button, can be enhanced later */}
                  {index > 1 && (
                     <button type="button" onClick={() => {
                        const newOptions = formState.discreteOptions?.filter((_, i) => i !== index);
                        setFormState(prevState => ({ ...prevState, discreteOptions: newOptions }));
                     }} className={`p-2 rounded ${secondaryButtonBgColor} ${secondaryButtonTextColor}`}>X</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addDiscreteOption} className={`w-full mt-2 ${secondaryButtonBgColor} ${secondaryButtonTextColor} py-2 px-4 rounded-md text-sm`}>
                Add Option
              </button>
            </div>
          )}

          <div>
            <label htmlFor="initialLiquidity" className="block text-sm font-medium mb-1">Initial Liquidity (Optional)</label>
            <input type="number" name="initialLiquidity" id="initialLiquidity" value={formState.initialLiquidity} onChange={handleInputChange} className={commonInputClass} placeholder="e.g., 1000 (in USD equivalent)"/>
             <p className="text-xs text-gray-500 mt-1">Seed the market with some starting liquidity to facilitate early trading.</p>
          </div>
          </div>
          <div className="pt-4">
            <button type="submit" className={`w-full font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ${buttonBgColor} ${buttonTextColor}`}>
              Submit Market for Review
            </button>
          </div>
          <p className="text-xs text-center text-gray-500">Markets may be subject to review before going live.</p>
        </form>
      </div>
    </div>
  );
} 