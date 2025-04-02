
import React, { useState } from 'react';
import { Pill, Plus, Check, Clock, Trash2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useToast } from './ui/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  taken: boolean;
}

const MedicationTracker: React.FC = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Daily',
      time: '8:00 AM',
      taken: false,
    },
    {
      id: '2',
      name: 'Blood Pressure Medicine',
      dosage: '10mg',
      frequency: 'Daily',
      time: '9:00 AM',
      taken: false,
    },
    {
      id: '3',
      name: 'Calcium',
      dosage: '500mg',
      frequency: 'Daily',
      time: '8:00 PM',
      taken: false,
    },
  ]);

  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'taken'>>({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '',
  });

  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    if (!newMedication.name || !newMedication.time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const newMed: Medication = {
      ...newMedication,
      id: Date.now().toString(),
      taken: false,
    };

    setMedications([...medications, newMed]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'Daily',
      time: '',
    });
    setOpen(false);

    toast({
      title: 'Medication Added',
      description: `${newMedication.name} has been added to your list.`,
    });
  };

  const handleTaken = (id: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );

    const med = medications.find((m) => m.id === id);
    if (med) {
      toast({
        title: med.taken ? 'Medication Unmarked' : 'Medication Taken',
        description: `${med.name} has been ${
          med.taken ? 'unmarked' : 'marked as taken'
        }.`,
      });
    }
  };

  const handleDelete = (id: string) => {
    const med = medications.find((m) => m.id === id);
    setMedications(medications.filter((med) => med.id !== id));
    
    if (med) {
      toast({
        title: 'Medication Removed',
        description: `${med.name} has been removed from your list.`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Medication Tracker</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-care-primary hover:bg-care-secondary">
              <Plus className="mr-2 h-4 w-4" /> Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, name: e.target.value })
                  }
                  placeholder="Enter medication name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      dosage: e.target.value,
                    })
                  }
                  placeholder="Ex: 10mg, 1 pill"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) =>
                    setNewMedication({ ...newMedication, frequency: value })
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newMedication.time}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, time: e.target.value })
                  }
                />
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-care-primary hover:bg-care-secondary">
              Add Medication
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {medications.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No medications added yet
            </h3>
            <p className="text-gray-500">
              Add your medications to keep track of them
            </p>
          </div>
        ) : (
          medications.map((med) => (
            <div
              key={med.id}
              className={`bg-white rounded-lg p-4 shadow border-l-4 ${
                med.taken ? 'border-green-500' : 'border-care-primary'
              } flex justify-between items-center`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    med.taken ? 'bg-green-100' : 'bg-care-light'
                  }`}
                >
                  {med.taken ? (
                    <Check className="h-6 w-6 text-green-500" />
                  ) : (
                    <Pill className="h-6 w-6 text-care-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{med.name}</h3>
                  <div className="text-gray-600 text-sm md:text-base">
                    {med.dosage} • {med.frequency}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm md:text-base">
                    <Clock className="h-3 w-3 mr-1" /> {med.time}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleTaken(med.id)}
                  className={med.taken ? 'text-green-500' : 'text-care-primary'}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(med.id)}
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

export default MedicationTracker;
