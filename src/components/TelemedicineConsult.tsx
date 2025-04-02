
import React, { useState } from 'react';
import { Video, Calendar, Clock, User, Phone, VideoOff, Mic, MicOff, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  avatar?: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const TelemedicineConsult = () => {
  const { toast } = useToast();
  const [doctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Geriatric Medicine',
      available: true,
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      available: false,
    },
    {
      id: '3',
      name: 'Dr. Emily Wilson',
      specialty: 'Neurology',
      available: true,
    },
    {
      id: '4',
      name: 'Dr. James Rodriguez',
      specialty: 'Primary Care',
      available: true,
    },
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorId: '1',
      date: 'April 15, 2023',
      time: '10:00 AM',
      status: 'scheduled',
    },
    {
      id: '2',
      doctorId: '3',
      date: 'April 20, 2023',
      time: '2:30 PM',
      status: 'scheduled',
    },
    {
      id: '3',
      doctorId: '4',
      date: 'March 28, 2023',
      time: '11:15 AM',
      status: 'completed',
    },
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [inCall, setInCall] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleScheduleAppointment = () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please select a doctor, date, and time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    
    toast({
      title: "Appointment Scheduled",
      description: `Your appointment with ${doctor?.name} on ${appointmentDate} at ${appointmentTime} has been confirmed.`,
    });

    // Reset form
    setSelectedDoctor(null);
    setAppointmentDate('');
    setAppointmentTime('');
  };

  const handleJoinCall = (appointment: Appointment) => {
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    toast({
      title: "Joining Video Call",
      description: `Connecting to video call with ${doctor?.name}...`,
    });
    
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
    
    toast({
      title: "Call Ended",
      description: "Your video consultation has ended.",
    });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    toast({
      title: audioEnabled ? "Microphone Muted" : "Microphone Unmuted",
      description: audioEnabled ? "You have muted your microphone." : "Others can now hear you.",
    });
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    
    toast({
      title: videoEnabled ? "Camera Turned Off" : "Camera Turned On",
      description: videoEnabled ? "Your camera has been turned off." : "Others can now see you.",
    });
  };

  const availableDates = [
    'April 15, 2023',
    'April 16, 2023',
    'April 17, 2023',
    'April 18, 2023',
    'April 19, 2023',
  ];

  const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  if (inCall) {
    return (
      <div className="container mx-auto px-4 py-6 md:ml-64 animate-fade-in h-[80vh] flex flex-col">
        <div className="relative flex-grow bg-black rounded-lg overflow-hidden flex items-center justify-center mb-4">
          {videoEnabled ? (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
              <Avatar className="h-32 w-32">
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-white">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-care-primary">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <VideoOff className="h-16 w-16 mb-4" />
              <p className="text-xl">Camera is turned off</p>
            </div>
          )}
          
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium animate-pulse">
            Live
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="lg" 
            className={`rounded-full ${!audioEnabled ? 'bg-red-100 text-red-500 border-red-300' : ''}`}
            onClick={toggleAudio}
          >
            {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className={`rounded-full ${!videoEnabled ? 'bg-red-100 text-red-500 border-red-300' : ''}`}
            onClick={toggleVideo}
          >
            {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>
          
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full"
            onClick={handleEndCall}
          >
            <Phone className="h-6 w-6 rotate-225 transform" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:ml-64 animate-fade-in">
      <div className="flex items-center mb-6">
        <Video className="h-8 w-8 text-care-primary mr-3" />
        <h1 className="text-3xl font-bold">Telemedicine Consultation</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Schedule an Appointment</CardTitle>
              <CardDescription>
                Book a video consultation with a healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Doctor</label>
                <Select value={selectedDoctor || ''} onValueChange={setSelectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem 
                        key={doctor.id} 
                        value={doctor.id}
                        disabled={!doctor.available}
                      >
                        {doctor.name} ({doctor.specialty})
                        {!doctor.available && " - Unavailable"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <Select value={appointmentDate} onValueChange={setAppointmentDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates.map(date => (
                      <SelectItem key={date} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time</label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-care-primary hover:bg-care-secondary"
                onClick={handleScheduleAppointment}
              >
                Schedule Appointment
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
          
          {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 pb-6 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No upcoming appointments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter(a => a.status === 'scheduled')
                .map(appointment => {
                  const doctor = doctors.find(d => d.id === appointment.doctorId);
                  return (
                    <Card key={appointment.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{doctor?.name}</CardTitle>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="h-7 rounded-full px-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription>{doctor?.specialty}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          {appointment.time}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-care-primary hover:bg-care-secondary"
                          onClick={() => handleJoinCall(appointment)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Video Call
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          )}
          
          {appointments.filter(a => a.status === 'completed').length > 0 && (
            <>
              <h3 className="text-lg font-medium mt-6 mb-4">Past Appointments</h3>
              <div className="space-y-3">
                {appointments
                  .filter(a => a.status === 'completed')
                  .map(appointment => {
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    return (
                      <Card key={appointment.id} className="bg-gray-50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{doctor?.name}</CardTitle>
                          <CardDescription className="text-xs">{doctor?.specialty}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            View Summary
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelemedicineConsult;
