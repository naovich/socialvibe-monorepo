export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    brightness: number;    // 0-200 (100 = normal)
    contrast: number;      // 0-200 (100 = normal)
    saturate: number;      // 0-200 (100 = normal)
    sepia: number;         // 0-100
    grayscale: number;     // 0-100
    blur: number;          // 0-10 (px)
    hueRotate: number;     // 0-360 (degrees)
  };
}

export const filterPresets: FilterPreset[] = [
  {
    id: 'none',
    name: 'Original',
    filters: {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
    },
  },
  {
    id: 'vintage',
    name: 'Vintage',
    filters: {
      brightness: 105,
      contrast: 110,
      saturate: 80,
      sepia: 30,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
    },
  },
  {
    id: 'bw',
    name: 'B&W',
    filters: {
      brightness: 100,
      contrast: 110,
      saturate: 0,
      sepia: 0,
      grayscale: 100,
      blur: 0,
      hueRotate: 0,
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    filters: {
      brightness: 105,
      contrast: 100,
      saturate: 120,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hueRotate: 10,
    },
  },
  {
    id: 'cool',
    name: 'Cool',
    filters: {
      brightness: 100,
      contrast: 105,
      saturate: 110,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hueRotate: 200,
    },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    filters: {
      brightness: 95,
      contrast: 140,
      saturate: 110,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
    },
  },
  {
    id: 'soft',
    name: 'Soft',
    filters: {
      brightness: 110,
      contrast: 90,
      saturate: 85,
      sepia: 10,
      grayscale: 0,
      blur: 0.5,
      hueRotate: 0,
    },
  },
  {
    id: 'vivid',
    name: 'Vivid',
    filters: {
      brightness: 105,
      contrast: 110,
      saturate: 150,
      sepia: 0,
      grayscale: 0,
      blur: 0,
      hueRotate: 0,
    },
  },
];

export const buildFilterString = (filters: FilterPreset['filters']): string => {
  const parts: string[] = [];

  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);

  return parts.join(' ');
};
