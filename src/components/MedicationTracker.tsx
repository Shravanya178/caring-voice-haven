import React, { useState, useEffect } from 'react';
import { Pill, Plus, Check, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { useLanguage, translateText, batchTranslate } from '../context/LanguageContext';

interface Medication {
  _id?: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  taken: boolean;
}

const MedicationTracker: React.FC = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [translations, setTranslations] = useState({
    title: 'Medication Tracker',
    addButton: 'Add Medication',
    dialogTitle: 'Add New Medication',
    medicationName: 'Medication Name',
    dosage: 'Dosage',
    frequency: 'Frequency',
    time: 'Time',
    enterMedicationName: 'Enter medication name',
    enterDosage: 'e.g., 500mg',
    daily: 'Daily',
    twiceDaily: 'Twice Daily',
    weekly: 'Weekly',
    asNeeded: 'As Needed',
    addMedicationButton: 'Add Medication',
    loading: 'Loading medications...',
    noMedications: 'No medications added yet',
    addMedicationsMessage: 'Add your medications to keep track of them',
    medicationAdded: 'Medication Added',
    medicationAddedDesc: 'has been added to your list.',
    medicationTaken: 'Medication Taken',
    medicationUnmarked: 'Medication Unmarked',
    medicationMarkedAs: 'has been marked as taken',
    medicationUnmarkedDesc: 'has been unmarked',
    medicationRemoved: 'Medication Removed',
    medicationRemovedDesc: 'has been removed from your list.',
    errorTitle: 'Error',
    fetchError: 'Failed to fetch medications. Please try again later.',
    addError: 'Failed to add medication. Please try again later.',
    updateError: 'Failed to update medication status. Please try again later.',
    deleteError: 'Failed to delete medication. Please try again later.',
    missingInfo: 'Missing Information',
    fillAllFields: 'Please fill in all required fields.',
    confirmDelete: 'Confirm Delete',
    confirmDeleteDesc: 'Are you sure you want to delete this medication? This action cannot be undone.',
    cancel: 'Cancel',
    delete: 'Delete'
  });

  const [newMedication, setNewMedication] = useState<Omit<Medication, '_id' | 'taken'>>({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '',
  });

  const [open, setOpen] = useState(false);

  // Translate UI elements when language changes
  useEffect(() => {
    const translateUI = async () => {
      if (language === 'english') {
        setTranslations({
          title: 'Medication Tracker',
          addButton: 'Add Medication',
          dialogTitle: 'Add New Medication',
          medicationName: 'Medication Name',
          dosage: 'Dosage',
          frequency: 'Frequency',
          time: 'Time',
          enterMedicationName: 'Enter medication name',
          enterDosage: 'e.g., 500mg',
          daily: 'Daily',
          twiceDaily: 'Twice Daily',
          weekly: 'Weekly',
          asNeeded: 'As Needed',
          addMedicationButton: 'Add Medication',
          loading: 'Loading medications...',
          noMedications: 'No medications added yet',
          addMedicationsMessage: 'Add your medications to keep track of them',
          medicationAdded: 'Medication Added',
          medicationAddedDesc: 'has been added to your list.',
          medicationTaken: 'Medication Taken',
          medicationUnmarked: 'Medication Unmarked',
          medicationMarkedAs: 'has been marked as taken',
          medicationUnmarkedDesc: 'has been unmarked',
          medicationRemoved: 'Medication Removed',
          medicationRemovedDesc: 'has been removed from your list.',
          errorTitle: 'Error',
          fetchError: 'Failed to fetch medications. Please try again later.',
          addError: 'Failed to add medication. Please try again later.',
          updateError: 'Failed to update medication status. Please try again later.',
          deleteError: 'Failed to delete medication. Please try again later.',
          missingInfo: 'Missing Information',
          fillAllFields: 'Please fill in all required fields.',
          confirmDelete: 'Confirm Delete',
          confirmDeleteDesc: 'Are you sure you want to delete this medication? This action cannot be undone.',
          cancel: 'Cancel',
          delete: 'Delete'
        });
        return;
      }

      try {
        console.log(`Translating UI to ${language}...`);
        const keys = Object.keys(translations);
        const values = Object.values(translations);
        
        const translatedValues = await batchTranslate(values, language);
        
        const newTranslations = { ...translations };
        keys.forEach((key, index) => {
          const originalText = values[index];
          newTranslations[key] = translatedValues[originalText] || originalText;
        });
        
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Error translating UI:', error);
      }
    };

    translateUI();
  }, [language]);

  // Translate medication names and other details
  useEffect(() => {
    const translateMedications = async () => {
      if (language === 'english' || medications.length === 0) return;
      
      try {
        const names = medications.map(med => med.name);
        const frequencies = [...new Set(medications.map(med => med.frequency))];
        const dosages = medications.map(med => med.dosage);
        
        const textsToTranslate = [...names, ...frequencies, ...dosages];
        const translatedTexts = await batchTranslate(textsToTranslate, language);
        
        // Create new medications array with translated values
        const translatedMedications = medications.map(med => {
          return {
            ...med,
            name: translatedTexts[med.name] || med.name,
            frequency: translatedTexts[med.frequency] || med.frequency,
            dosage: translatedTexts[med.dosage] || med.dosage
          };
        });
        
        setMedications(translatedMedications);
      } catch (error) {
        console.error('Error translating medications:', error);
      }
    };
    
    translateMedications();
  }, [medications, language]);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      console.log('Fetching medications from server...');
      const response = await fetch('http://localhost:5000/api/medications');
      
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      
      const data = await response.json();
      console.log('Received medications:', data);
      setMedications(data);
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast({
        title: translations.errorTitle,
        description: translations.fetchError,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMedication.name || !newMedication.time) {
      toast({
        title: translations.missingInfo,
        description: translations.fillAllFields,
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Sending medication data:', newMedication);
      const response = await fetch('http://localhost:5000/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newMedication,
          taken: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add medication');
      }

      const savedMedication = await response.json();
      console.log('Saved medication:', savedMedication);
      
      setMedications(prev => [savedMedication, ...prev]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: 'Daily',
        time: '',
      });
      setOpen(false);

      toast({
        title: translations.medicationAdded,
        description: `${newMedication.name} ${translations.medicationAddedDesc}`,
      });
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: translations.errorTitle,
        description: translations.addError,
        variant: "destructive",
      });
    }
  };

  const handleTaken = async (id: string) => {
    try {
      const med = medications.find((m) => m._id === id);
      if (!med) return;
      
      const updatedTaken = !med.taken;
      
      const response = await fetch(`http://localhost:5000/api/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...med,
          taken: updatedTaken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update medication');
      }

      const updatedMedication = await response.json();
      
      setMedications(
        medications.map((m) =>
          m._id === id ? updatedMedication : m
        )
      );

      toast({
        title: updatedTaken ? translations.medicationTaken : translations.medicationUnmarked,
        description: `${med.name} ${
          updatedTaken ? translations.medicationMarkedAs : translations.medicationUnmarkedDesc
        }`,
      });
    } catch (error) {
      console.error('Error updating medication:', error);
      toast({
        title: translations.errorTitle,
        description: translations.updateError,
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    const med = medications.find((m) => m._id === id);
    if (!med) return;
    
    setMedicationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setMedicationToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!medicationToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const med = medications.find((m) => m._id === medicationToDelete);
      if (!med) {
        setIsDeleting(false);
        return;
      }
      
      console.log(`Deleting medication: ${medicationToDelete}`);
      
      const response = await fetch(`http://localhost:5000/api/medications/${medicationToDelete}`, {
        method: 'DELETE',
      });

      console.log(`Delete response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('Failed to delete medication');
      }
      
      setMedications(prev => prev.filter((m) => m._id !== medicationToDelete));
      
      toast({
        title: translations.medicationRemoved,
        description: `${med.name} ${translations.medicationRemovedDesc}`,
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: translations.errorTitle,
        description: translations.deleteError,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setMedicationToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64 px-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{translations.title}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-care-primary hover:bg-care-secondary">
              <Plus className="mr-2 h-4 w-4" /> {translations.addButton}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{translations.dialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{translations.medicationName}</Label>
                <Input
                  id="name"
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, name: e.target.value })
                  }
                  placeholder={translations.enterMedicationName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">{translations.dosage}</Label>
                <Input
                  id="dosage"
                  value={newMedication.dosage}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, dosage: e.target.value })
                  }
                  placeholder={translations.enterDosage}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">{translations.frequency}</Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) =>
                    setNewMedication({ ...newMedication, frequency: value })
                  }
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder={translations.frequency} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">{translations.daily}</SelectItem>
                    <SelectItem value="Twice Daily">{translations.twiceDaily}</SelectItem>
                    <SelectItem value="Weekly">{translations.weekly}</SelectItem>
                    <SelectItem value="As Needed">{translations.asNeeded}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">{translations.time}</Label>
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
              {translations.addMedicationButton}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{translations.loading}</p>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {translations.noMedications}
            </h3>
            <p className="text-gray-500">
              {translations.addMedicationsMessage}
            </p>
          </div>
        ) : (
          medications.map((med) => (
            <div
              key={med._id}
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
                  onClick={() => handleTaken(med._id!)}
                  className={med.taken ? 'text-green-500' : 'text-care-primary'}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => confirmDelete(med._id!)}
                  className="text-gray-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {translations.confirmDelete}
            </DialogTitle>
            <DialogDescription>
              {translations.confirmDeleteDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" onClick={cancelDelete} disabled={isDeleting}>
              {translations.cancel}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting && <span className="animate-spin">⟳</span>}
              {translations.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationTracker;