import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCuratedPhotos } from '../utils/imgClient';
import type { Photo } from '../utils/imgClient';

const PHOTOS_CACHE_KEY = 'picsart_photos_cache';
const CACHE_EXPIRY_KEY = 'picsart_photos_cache_expiry';
const CACHE_DURATION = 60 * 10 * 1000;

interface PhotosContextType {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

interface PhotosProviderProps {
  children: ReactNode;
}

export const PhotosProvider: React.FC<PhotosProviderProps> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const isCacheValid = (): boolean => {
    const expiryTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiryTime) return false;
    
    const currentTime = new Date().getTime();
    return currentTime < parseInt(expiryTime, 10);
  };

  const loadFromCache = (): boolean => {
    if (isCacheValid()) {
      const cachedPhotos = localStorage.getItem(PHOTOS_CACHE_KEY);
      if (cachedPhotos) {
        try {
          const parsedPhotos = JSON.parse(cachedPhotos) as Photo[];
          setPhotos(parsedPhotos);
          setLoading(false);
          setHasFetched(true);
          return true;
        } catch (e) {
          console.error('Failed to parse cached photos', e);
        }
      }
    }
    return false;
  };

  const saveToCache = (photosData: Photo[]): void => {
    try {
      const photosJson = JSON.stringify(photosData);
      if (photosJson.length > 4000000) {
        console.warn('Photos data too large for localStorage, skipping cache');
        return;
      }
      
      localStorage.setItem(PHOTOS_CACHE_KEY, photosJson);
      const expiryTime = new Date().getTime() + CACHE_DURATION;
      localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
    } catch (e) {
      console.error('Failed to save photos to cache', e);
    }
  };

  const fetchPhotos = async () => {
    if (photos.length > 0 && hasFetched) {
      return;
    }
    
    if (loadFromCache()) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await getCuratedPhotos();
      setPhotos(response.photos);
      saveToCache(response.photos);
      
      if (response.photos.length > 0) {
        const img = new Image();
        img.src = response.photos[0].src.medium;
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photos');
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <PhotosContext.Provider
      value={{
        photos,
        loading,
        error,
        refresh: fetchPhotos
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = (): PhotosContextType => {
  const context = useContext(PhotosContext);
  
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotosProvider');
  }
  
  return context;
}; 