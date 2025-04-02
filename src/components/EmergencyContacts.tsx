
import React, { useState } from 'react';
import { Phone, Plus, Trash2, Heart } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

const EmergencyContacts: React.FC = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      relation: 'Son',
      phone: '(555) 123-4567',
    },
    {
      id: '2',
      name: 'Mary Johnson',
      relation: 'Daughter',
      phone: '(555) 987-6543',
    },
    {
      id: '3',
      name: 'Dr. Wilson',
      relation: 'Doctor',
      phone: '(555) 246-8101',
    },
  ]);

  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '',
    relation: '',
    phone: '',
  });

  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const contact: Contact = {
      ...newContact,
      id: Date.now().toString(),
    };

    setContacts([...contacts, contact]);
    setNewContact({
      name: '',
      relation: '',
      phone: '',
    });
    setOpen(false);

    toast({
      title: 'Contact Added',
      description: `${newContact.name} has been added to your emergency contacts.`,
    });
  };

  const handleDelete = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    setContacts(contacts.filter((contact) => contact.id !== id));
    
    if (contact) {
      toast({
        title: 'Contact Removed',
        description: `${contact.name} has been removed from your contacts.`,
      });
    }
  };

  const handleCall = (contact: Contact) => {
    toast({
      title: `Calling ${contact.name}`,
      description: `Dialing ${contact.phone}...`,
    });
    // In a real app, this would use device capabilities to make a call
  };

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Emergency Contacts</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-care-primary hover:bg-care-secondary">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Contact name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="relation">Relationship</Label>
                <Input
                  id="relation"
                  value={newContact.relation}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      relation: e.target.value,
                    })
                  }
                  placeholder="Ex: Son, Daughter, Doctor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({ ...newContact, phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-care-primary hover:bg-care-secondary">
              Add Contact
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Heart className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Emergency Help
            </h3>
            <div className="mt-2 text-red-700">
              <p>
                In case of a medical emergency, tap the button below to call emergency services.
              </p>
            </div>
            <div className="mt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => {
                  toast({
                    title: "Emergency Call",
                    description: "Calling emergency services (911)...",
                    variant: "destructive",
                  });
                }}
              >
                <Phone className="mr-2 h-4 w-4" /> Call 911
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {contacts.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <Phone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No emergency contacts added yet
            </h3>
            <p className="text-gray-500">
              Add important contacts for quick access in emergencies
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{contact.name}</h3>
                <div className="text-gray-600">{contact.relation}</div>
                <div className="flex items-center text-gray-500">
                  <Phone className="h-3 w-3 mr-1" /> {contact.phone}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  onClick={() => handleCall(contact)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(contact.id)}
                  className="text-gray-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
