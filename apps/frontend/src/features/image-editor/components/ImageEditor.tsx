import React, { useState } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { filterPresets, buildFilterString, type FilterPreset } from '../types/filters';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (filteredImageUrl: string, filters: FilterPreset['filters']) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const [selectedPreset, setSelectedPreset] = useState<FilterPreset>(filterPresets[0]);
  const [customFilters, setCustomFilters] = useState<FilterPreset['filters']>(filterPresets[0].filters);

  const currentFilters = selectedPreset.id === 'custom' ? customFilters : selectedPreset.filters;
  const filterString = buildFilterString(currentFilters);

  const handlePresetClick = (preset: FilterPreset) => {
    setSelectedPreset(preset);
    if (preset.id !== 'custom') {
      setCustomFilters(preset.filters);
    }
  };

  const handleCustomFilterChange = (key: keyof FilterPreset['filters'], value: number) => {
    const newFilters = { ...customFilters, [key]: value };
    setCustomFilters(newFilters);
    setSelectedPreset({ id: 'custom', name: 'Custom', filters: newFilters });
  };

  const handleReset = () => {
    setSelectedPreset(filterPresets[0]);
    setCustomFilters(filterPresets[0].filters);
  };

  const handleSave = () => {
    // In a real app, you'd use a canvas to apply filters and export
    // For now, we just pass the filter config
    onSave(imageUrl, currentFilters);
  };

  return (
    <div className="fixed inset-0 z-modal bg-black/90 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border-primary rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary">
          <h2 className="text-xl font-bold text-text-primary">Edit Image</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary rounded-xl text-text-primary font-medium transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold transition-colors"
            >
              <Check size={18} />
              Save
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Image Preview */}
            <div className="lg:col-span-2">
              <div className="relative bg-bg-tertiary rounded-xl overflow-hidden aspect-video">
                <img
                  src={imageUrl}
                  alt="Edit"
                  className="w-full h-full object-contain"
                  style={{ filter: filterString }}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <h3 className="font-bold text-text-primary mb-3">Filters</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        selectedPreset.id === preset.id
                          ? 'border-primary'
                          : 'border-border-primary hover:border-border-secondary'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={preset.name}
                        className="w-full aspect-square object-cover"
                        style={{ filter: buildFilterString(preset.filters) }}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm py-1 text-center">
                        <span className="text-xs font-medium text-white">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Sliders */}
              <div>
                <h3 className="font-bold text-text-primary mb-3">Adjust</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-muted">Brightness</span>
                      <span className="text-sm font-medium text-text-primary">
                        {customFilters.brightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={customFilters.brightness}
                      onChange={(e) => handleCustomFilterChange('brightness', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-muted">Contrast</span>
                      <span className="text-sm font-medium text-text-primary">
                        {customFilters.contrast}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={customFilters.contrast}
                      onChange={(e) => handleCustomFilterChange('contrast', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-muted">Saturation</span>
                      <span className="text-sm font-medium text-text-primary">
                        {customFilters.saturate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={customFilters.saturate}
                      onChange={(e) => handleCustomFilterChange('saturate', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-muted">Blur</span>
                      <span className="text-sm font-medium text-text-primary">
                        {customFilters.blur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={customFilters.blur}
                      onChange={(e) => handleCustomFilterChange('blur', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
