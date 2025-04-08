import { useState, useEffect } from 'react';
import { getCuratedPhotos } from '../utils/imgClient';
import type { Photo } from '../utils/imgClient';

interface UsePhotosResult {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}

export const usePhotos = (): UsePhotosResult => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await getCuratedPhotos();
        setPhotos(response.photos);
        
        if (response.photos.length > 0) {
          const img = new Image();
          img.src = response.photos[0].src.medium;
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return { photos, loading, error };
};
