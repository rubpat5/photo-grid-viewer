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
