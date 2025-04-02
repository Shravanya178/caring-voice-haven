
import React, { useState } from 'react';
import { MapPin, Search, Phone, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
}

const PharmacyFinder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: '1',
      name: 'Community Pharmacy',
      address: '123 Main Street, Anytown',
      distance: '0.5 miles',
      phone: '(555) 123-4567',
    },
    {
      id: '2',
      name: 'MediCare Pharmacy',
      address: '456 Oak Avenue, Anytown',
      distance: '1.2 miles',
      phone: '(555) 987-6543',
    },
    {
      id: '3',
      name: 'Health Plus Pharmacy',
      address: '789 Elm Boulevard, Anytown',
      distance: '1.8 miles',
      phone: '(555) 456-7890',
    },
  ]);

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call to OpenStreetMap
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Pharmacies Found",
        description: "Showing nearby pharmacies based on your location",
      });
    }, 1500);
  };

  const handleGetDirections = (pharmacy: Pharmacy) => {
    toast({
      title: "Opening Maps",
      description: `Getting directions to ${pharmacy.name}`,
    });
    // In a real app, this would open maps with directions
  };

  const handleCall = (pharmacy: Pharmacy) => {
    toast({
      title: "Calling Pharmacy",
      description: `Calling ${pharmacy.name} at ${pharmacy.phone}`,
    });
    // In a real app, this would trigger a phone call
  };

  return (
    <div className="container mx-auto px-4 py-6 md:ml-64 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Find Nearby Pharmacies</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter location or use current"
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

      <div className="grid gap-4 mt-4">
        {pharmacies.map((pharmacy) => (
          <Card key={pharmacy.id} className="overflow-hidden">
            <CardHeader className="bg-care-light pb-2">
              <CardTitle className="flex items-start">
                <MapPin className="h-5 w-5 text-care-primary mr-2 mt-1" />
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
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  className="flex-1 bg-care-primary hover:bg-care-secondary"
                  onClick={() => handleGetDirections(pharmacy)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PharmacyFinder;
