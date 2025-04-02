
import React, { useState } from 'react';
import { Users, Calendar, Video, MessageSquare, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
  description: string;
}

interface CommunityMember {
  id: string;
  name: string;
  age: number;
  interests: string[];
  online: boolean;
}

const SocialClub = () => {
  const { toast } = useToast();
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Virtual Bingo Night',
      date: 'April 15, 2023',
      time: '7:00 PM',
      participants: 12,
      description: 'Join us for a fun evening of virtual bingo with prizes!'
    },
    {
      id: '2',
      title: 'Book Club Discussion',
      date: 'April 18, 2023',
      time: '3:00 PM',
      participants: 8,
      description: 'We\'ll be discussing "The Thursday Murder Club" by Richard Osman.'
    },
    {
      id: '3',
      title: 'Chair Yoga Session',
      date: 'April 20, 2023',
      time: '10:00 AM',
      participants: 15,
      description: 'Gentle yoga exercises you can do from a chair with instructor Sarah.'
    }
  ]);

  const [members] = useState<CommunityMember[]>([
    {
      id: '1',
      name: 'Eleanor Wilson',
      age: 72,
      interests: ['Reading', 'Gardening', 'Chess'],
      online: true
    },
    {
      id: '2',
      name: 'Robert Thompson',
      age: 68,
      interests: ['Photography', 'Hiking', 'History'],
      online: false
    },
    {
      id: '3',
      name: 'Margaret Davis',
      age: 75,
      interests: ['Cooking', 'Painting', 'Music'],
      online: true
    },
    {
      id: '4',
      name: 'James Miller',
      age: 70,
      interests: ['Woodworking', 'Bird watching', 'Puzzles'],
      online: false
    }
  ]);

  const handleJoinEvent = (event: Event) => {
    toast({
      title: "Event Joined",
      description: `You've registered for ${event.title} on ${event.date}`,
    });
  };

  const handleConnectMember = (member: CommunityMember) => {
    toast({
      title: "Connection Request Sent",
      description: `A connection request has been sent to ${member.name}`,
    });
  };

  const handleStartChat = (member: CommunityMember) => {
    toast({
      title: "Chat Started",
      description: `Starting a conversation with ${member.name}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:ml-64 animate-fade-in">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-care-primary mr-3" />
        <h1 className="text-3xl font-bold">Virtual Social Club</h1>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="events" className="text-lg">Upcoming Events</TabsTrigger>
          <TabsTrigger value="community" className="text-lg">Community Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-4">
          {events.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {event.date} at {event.time}
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-care-primary hover:bg-care-secondary"
                    onClick={() => handleJoinEvent(event)}
                  >
                    Join Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <Users className="h-4 w-4 inline mr-1" />
                  {event.participants} participants registered
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Video className="h-4 w-4 mr-2" />
                  Enter Virtual Room
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          {members.map(member => (
            <Card key={member.id}>
              <CardHeader>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <CardTitle className="flex items-center">
                      {member.name}
                      <div className={`ml-2 h-3 w-3 rounded-full ${member.online ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </CardTitle>
                    <CardDescription>Age: {member.age}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium mb-1">Interests:</p>
                <div className="flex flex-wrap gap-1">
                  {member.interests.map(interest => (
                    <span 
                      key={interest} 
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleConnectMember(member)}
                  className="flex-1 mr-2"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button 
                  className="flex-1 bg-care-primary hover:bg-care-secondary"
                  onClick={() => handleStartChat(member)}
                  disabled={!member.online}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {member.online ? 'Chat Now' : 'Offline'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialClub;
