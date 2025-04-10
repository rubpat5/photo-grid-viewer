export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface ApiResponse {
  page: number;
  per_page: number;
  photos: Photo[];
  total_results: number;
  next_page: string;
}

const API_BASE_URL = 'https://api.pexels.com/v1';

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Pexels API key is not configured. Please create a .env.local file with VITE_PEXELS_API_KEY=your_api_key'
    );
  }

  return apiKey;
};

export const getCuratedPhotos = async (page = 1, perPage = 80): Promise<ApiResponse> => {
  const apiKey = getApiKey();

  const response = await fetch(`${API_BASE_URL}/curated?page=${page}&per_page=${perPage}`, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }

  return response.json();
};

export const getPhotoById = async (id: string): Promise<Photo> => {
  const apiKey = getApiKey();

  const response = await fetch(`${API_BASE_URL}/photos/${id}`, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch photo details');
  }

  return response.json();
};

const photoCache: Record<string, { data: Photo; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60;

export const getCachedPhoto = async (id: string): Promise<Photo> => {
  const cached = photoCache[id];
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const photo = await getPhotoById(id);
  photoCache[id] = { data: photo, timestamp: now };
  return photo;
};
