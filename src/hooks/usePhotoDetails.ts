import { useState, useEffect } from 'react';
import { getCachedPhoto } from '../utils/imgClient';
import type { Photo } from '../utils/imgClient';

interface UsePhotoDetailsResult {
  photo: Photo | null;
  loading: boolean;
  error: string | null;
}

export const usePhotoDetails = (id: string | undefined): UsePhotoDetailsResult => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id) {
        setError('No photo ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const photoData = await getCachedPhoto(id);
        setPhoto(photoData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photo details');
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  return { photo, loading, error };
};
