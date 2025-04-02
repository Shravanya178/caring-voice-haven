import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Phone, Navigation, Locate, Copy, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from './ui/dialog';

// This would typically be in your HTML file or imported as CSS
// For your project, add these to your index.html or import them
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string; // in km
  phone: string;
  lat: number;
  lng: number;
}

const PharmacyFinder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  
  // Initialize Leaflet map
  useEffect(() => {
    if (mapRef.current && !leafletMapRef.current && typeof window !== 'undefined' && window.L) {
      // Create map instance with a default view
      const map = window.L.map(mapRef.current).setView([51.505, -0.09], 13);
      
      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      leafletMapRef.current = map;
      
      toast({
        title: "Map Loaded",
        description: "Please share your location or enter an address to find pharmacies",
      });
    }
    
    // Cleanup on component unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
      }
    };
  }, [toast]);
  
  // Get user's current location with high accuracy
  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      // Request high accuracy, increase timeout for more precise results
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Center map on user location and set higher zoom level
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([userPos.lat, userPos.lng], 15);
            
            // Add/update marker for user location
            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([userPos.lat, userPos.lng]);
            } else {
              userMarkerRef.current = window.L.circle([userPos.lat, userPos.lng], {
                color: '#4285F4',
                fillColor: '#4285F4',
                fillOpacity: 0.7,
                radius: 10
              }).addTo(leafletMapRef.current);
              
              window.L.marker([userPos.lat, userPos.lng], {
                icon: window.L.divIcon({
                  html: '<div style="background-color:#4285F4;width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>',
                  className: 'user-location-marker'
                })
              }).addTo(leafletMapRef.current)
                .bindPopup("Your location")
                .openPopup();
            }
          }
          
          // Search for pharmacies near this location
          searchNearbyPharmacies(userPos);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: `Unable to get precise location: ${error.message}. Try entering your address manually.`,
            variant: "destructive"
          });
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  // Search by address using Nominatim (OpenStreetMap geocoding)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Location",
        description: "Please enter a location or use current location",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Use Nominatim for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const location = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          
          setUserLocation(location);
          
          // Center map on searched location
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([location.lat, location.lng], 15);
            
            // Add/update marker for searched location
            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([location.lat, location.lng]);
            } else {
              userMarkerRef.current = window.L.circle([location.lat, location.lng], {
                color: '#4285F4',
                fillColor: '#4285F4',
                fillOpacity: 0.7,
                radius: 10
              }).addTo(leafletMapRef.current);
            }
            
            window.L.marker([location.lat, location.lng], {
              icon: window.L.divIcon({
                html: '<div style="background-color:#4285F4;width:10px;height:10px;border-radius:50%;border:2px solid white;"></div>',
                className: 'searched-location-marker'
              })
            }).addTo(leafletMapRef.current)
              .bindPopup("Searched location")
              .openPopup();
          }
          
          // Search for pharmacies near this location
          searchNearbyPharmacies(location);
        } else {
          toast({
            title: "Location Not Found",
            description: "Could not find that location. Please try a different address.",
            variant: "destructive"
          });
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("Geocoding error:", error);
        toast({
          title: "Geocoding Error",
          description: "Error finding that location. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      });
  };
  
  // Search for nearby pharmacies using Overpass API (OpenStreetMap data)
  const searchNearbyPharmacies = (location: { lat: number; lng: number }) => {
    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (leafletMapRef.current) {
        leafletMapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
    
    // Build Overpass API query to find pharmacies
    // Search within a 3km radius
    const radius = 3000; // meters
    const overpassQuery = `
      [out:json];
      (
        node["amenity"="pharmacy"](around:${radius},${location.lat},${location.lng});
        way["amenity"="pharmacy"](around:${radius},${location.lat},${location.lng});
        relation["amenity"="pharmacy"](around:${radius},${location.lat},${location.lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    
    fetch(overpassUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.elements && data.elements.length > 0) {
          const pharmacyNodes = data.elements.filter(
            element => element.tags && element.tags.amenity === "pharmacy"
          );
          
          if (pharmacyNodes.length === 0) {
            toast({
              title: "No Pharmacies Found",
              description: "No pharmacies found in this area. Try expanding your search.",
              variant: "destructive"
            });
            setPharmacies([]);
            setLoading(false);
            return;
          }
          
          // Process pharmacy data
          const processedPharmacies: Pharmacy[] = pharmacyNodes.map((node, index) => {
            // Get lat/lng
            const lat = node.lat || (node.center ? node.center.lat : 0);
            const lng = node.lon || (node.center ? node.center.lon : 0);
            
            // Calculate distance
            const distance = calculateDistance(
              location.lat,
              location.lng,
              lat,
              lng
            );
            
            return {
              id: `pharmacy-${node.id || index}`,
              name: node.tags.name || "Pharmacy",
              address: node.tags["addr:street"] 
                ? `${node.tags["addr:housenumber"] || ""} ${node.tags["addr:street"]}, ${node.tags["addr:city"] || ""}`
                : "Address unavailable",
              phone: node.tags.phone || node.tags["contact:phone"] || "Phone unavailable",
              distance: `${distance.toFixed(1)} km`,
              lat: lat,
              lng: lng
            };
          });
          
          // Sort by distance and take top 3
          const sortedPharmacies = processedPharmacies
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
            .slice(0, 3);
          
          setPharmacies(sortedPharmacies);
          
          // Add markers for pharmacies
          if (leafletMapRef.current) {
            sortedPharmacies.forEach((pharmacy, index) => {
              // Use a custom icon with numbering for top 3
              const pharmacyIcon = window.L.divIcon({
                html: `<div style="background-color:#e74c3c;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;">${index + 1}</div>`,
                className: 'pharmacy-marker'
              });
              
              const marker = window.L.marker([pharmacy.lat, pharmacy.lng], { icon: pharmacyIcon })
                .addTo(leafletMapRef.current)
                .bindPopup(`
                  <div>
                    <h3 style="font-weight:bold;margin-bottom:5px;">${pharmacy.name}</h3>
                    <p style="margin:0 0 5px;">${pharmacy.address}</p>
                    <p style="margin:0 0 5px;">${pharmacy.phone}</p>
                    <p style="margin:0;">${pharmacy.distance}</p>
                  </div>
                `);
              
              markersRef.current.push(marker);
            });
          }
          
          toast({
            title: "Pharmacies Found",
            description: `Found ${sortedPharmacies.length} pharmacies near you`,
          });
        } else {
          toast({
            title: "No Pharmacies Found",
            description: "No pharmacies found in this area. Try expanding your search.",
            variant: "destructive"
          });
          setPharmacies([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Overpass API error:", error);
        toast({
          title: "Search Error",
          description: "Error finding pharmacies. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      });
  };
  
  // Calculate distance in kilometers using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };
  
  // Get directions to a pharmacy - MODIFIED to use Google Maps
  const handleGetDirections = (pharmacy: Pharmacy) => {
    if (!userLocation) return;
    
    // Google Maps URL for directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${pharmacy.lat},${pharmacy.lng}&travelmode=driving`;
    
    // For mobile devices, try to use native maps with Google as fallback
    if (navigator.platform.indexOf('iPhone') !== -1 || 
        navigator.platform.indexOf('iPad') !== -1 || 
        navigator.platform.indexOf('iPod') !== -1) {
      // Try Apple Maps first, which some users may prefer on iOS
      window.open(`maps://maps.apple.com/?daddr=${pharmacy.lat},${pharmacy.lng}&saddr=${userLocation.lat},${userLocation.lng}`);
    } else if (/Android/.test(navigator.userAgent)) {
      // On Android, try to use Google Maps app
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${pharmacy.lat},${pharmacy.lng}`);
    } else {
      // For desktop or fallback, open in Google Maps website
      window.open(googleMapsUrl);
    }
    
    toast({
      title: "Opening Google Maps",
      description: `Getting directions to ${pharmacy.name}`,
    });
  };
  
  // ENHANCED: Show call dialog with options
  const handleCall = (pharmacy: Pharmacy) => {
    if (!pharmacy.phone || pharmacy.phone === 'Phone unavailable') {
      toast({
        title: "Phone Unavailable",
        description: "No phone number available for this pharmacy",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPharmacy(pharmacy);
    setIsCallDialogOpen(true);
  };
  
  // Directly call the pharmacy
  const initiateCall = () => {
    if (!selectedPharmacy) return;
    
    const formattedPhone = selectedPharmacy.phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${formattedPhone}`;
    
    toast({
      title: "Calling Pharmacy",
      description: `Calling ${selectedPharmacy.name} at ${selectedPharmacy.phone}`,
    });
    
    setIsCallDialogOpen(false);
  };
  
  // Copy number to clipboard
  const copyPhoneNumber = () => {
    if (!selectedPharmacy) return;
    
    const formattedPhone = selectedPharmacy.phone.replace(/[^0-9+]/g, '');
    navigator.clipboard.writeText(formattedPhone);
    
    toast({
      title: "Number Copied",
      description: `Phone number copied to clipboard`,
    });
  };
  
  // Share pharmacy information
  const sharePharmacy = () => {
    if (!selectedPharmacy) return;
    
    const shareText = `${selectedPharmacy.name}
Address: ${selectedPharmacy.address}
Phone: ${selectedPharmacy.phone}
Location: https://www.google.com/maps/search/?api=1&query=${selectedPharmacy.lat},${selectedPharmacy.lng}`;

    if (navigator.share) {
      navigator.share({
        title: selectedPharmacy.name,
        text: shareText,
      })
      .then(() => {
        toast({
          title: "Information Shared",
          description: "Pharmacy information shared successfully",
        });
      })
      .catch((error) => {
        console.error("Share error:", error);
        // Fallback to clipboard copy if sharing fails
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Information Copied",
          description: "Pharmacy information copied to clipboard",
        });
      });
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Information Copied",
        description: "Pharmacy information copied to clipboard",
      });
    }
  };

  // Add Leaflet script to the document when needed
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      document.body.appendChild(script);
      
      const linkTag = document.createElement('link');
      linkTag.rel = 'stylesheet';
      linkTag.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkTag);
      
      script.onload = () => {
        if (mapRef.current && !leafletMapRef.current) {
          const map = window.L.map(mapRef.current).setView([51.505, -0.09], 13);
          
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          leafletMapRef.current = map;
        }
      };
      
      return () => {
        document.body.removeChild(script);
        document.head.removeChild(linkTag);
      };
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 md:ml-64 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Find Nearby Pharmacies</h1>
      
      {/* Search area */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <div className="flex gap-2 flex-grow">
          <Input
            placeholder="Enter your address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        <Button onClick={getUserLocation} variant="outline" disabled={loading} className="w-full md:w-auto">
          <Locate className="h-4 w-4 mr-2" />
          Use My Location
        </Button>
      </div>

      {/* Map container */}
      <div 
        ref={mapRef}
        className="w-full h-64 bg-gray-200 rounded-md mb-6"
        style={{ minHeight: "300px" }}
      ></div>

      {/* Pharmacy list */}
      <div className="grid gap-4 mt-4">
        {pharmacies.map((pharmacy, index) => (
          <Card key={pharmacy.id} className="overflow-hidden">
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center mr-2">
                  {index + 1}
                </div>
                <div>
                  {pharmacy.name}
                  <div className="text-sm font-normal text-gray-600">
                    {pharmacy.distance} away
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">{pharmacy.address}</p>
              <p className="text-gray-600 mb-4">
                <Phone className="h-4 w-4 inline mr-1" /> {pharmacy.phone}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCall(pharmacy)}
                  disabled={pharmacy.phone === 'Phone unavailable'}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleGetDirections(pharmacy)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {userLocation && pharmacies.length === 0 && !loading && (
          <p className="text-center py-4 text-gray-500">No pharmacies found in this area</p>
        )}
      </div>
      
      {/* Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedPharmacy?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-lg font-semibold mb-2">{selectedPharmacy?.phone}</p>
            <p className="text-center text-gray-600 mb-6">{selectedPharmacy?.address}</p>
            
            <div className="grid grid-cols-1 gap-4">
              <Button onClick={initiateCall} className="w-full bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
              
              <Button onClick={copyPhoneNumber} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Number
              </Button>
              
              <Button onClick={sharePharmacy} variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Pharmacy
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmacyFinder;
