'use client';

import { useCallback, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Phone, Mail } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
};

// Office locations
const offices = [
  {
    id: 'paris',
    name: 'Paris Office',
    address: 'Paris, France',
    position: { lat: 48.8566, lng: 2.3522 }, // Paris center
    phone: '+33 7 52 03 47 86',
    email: 'contact@sygma-consult.com',
    description: 'European Headquarters',
  },
  {
    id: 'tunis',
    name: 'Tunis Office',
    address: 'Tunis, Tunisia',
    position: { lat: 36.8065, lng: 10.1815 }, // Tunis center
    phone: '+33 7 52 03 47 86',
    email: 'contact@sygma-consult.com',
    description: 'North Africa Operations',
  },
];

// Map center (between Paris and Tunis)
const center = {
  lat: 42.8,
  lng: 6.4,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9e6f7' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
  ],
};

export default function OfficeMap() {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Map Coming Soon</h3>
          <p className="text-gray-500">
            Our office locations map will be available shortly.
          </p>
          <div className="mt-6 space-y-4">
            {offices.map((office) => (
              <div key={office.id} className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-[#001F3F] mb-2">{office.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {office.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {office.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={4}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {offices.map((office) => (
            <Marker
              key={office.id}
              position={office.position}
              onClick={() => setSelectedOffice(office.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#D4AF37',
                fillOpacity: 1,
                strokeColor: '#001F3F',
                strokeWeight: 2,
              }}
            />
          ))}

          {selectedOffice && (
            <InfoWindow
              position={
                offices.find((o) => o.id === selectedOffice)?.position || center
              }
              onCloseClick={() => setSelectedOffice(null)}
            >
              <div className="p-3 min-w-[250px]">
                <h3 className="font-bold text-lg text-[#001F3F] mb-2">
                  {offices.find((o) => o.id === selectedOffice)?.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {offices.find((o) => o.id === selectedOffice)?.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      {offices.find((o) => o.id === selectedOffice)?.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <a
                      href={`tel:${offices.find((o) => o.id === selectedOffice)?.phone}`}
                      className="text-gray-700 hover:text-[#D4AF37]"
                    >
                      {offices.find((o) => o.id === selectedOffice)?.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <a
                      href={`mailto:${offices.find((o) => o.id === selectedOffice)?.email}`}
                      className="text-gray-700 hover:text-[#D4AF37]"
                    >
                      {offices.find((o) => o.id === selectedOffice)?.email}
                    </a>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
