
import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Brain, Phone, Bell, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}> = ({ title, description, icon, to }) => {
  return (
    <Link to={to}>
      <Card className="feature-card h-full">
        <div className="icon-container text-care-primary">
          {icon}
        </div>
        <CardContent className="p-0 text-center">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div>
        <h2 className="text-3xl font-bold mb-6">Welcome, Sara</h2>
        
        <div className="bg-care-light p-4 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="mr-4 bg-care-primary p-3 rounded-full">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium">Today's Reminders</h3>
              <p>Take Vitamin D at 8:00 AM</p>
              <p>Blood pressure medicine at 9:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Medications"
            description="Track and manage your medications"
            icon={<Pill className="h-8 w-8" />}
            to="/medications"
          />
          <FeatureCard
            title="Memory Games"
            description="Keep your mind active with fun games"
            icon={<Brain className="h-8 w-8" />}
            to="/games"
          />
          <FeatureCard
            title="Emergency Contacts"
            description="Quickly reach your emergency contacts"
            icon={<Phone className="h-8 w-8" />}
            to="/emergency"
          />
          <FeatureCard
            title="Upcoming Appointments"
            description="View and manage your appointments"
            icon={<Calendar className="h-8 w-8" />}
            to="/appointments"
          />
          <FeatureCard
            title="Connect with Others"
            description="Join social groups and activities"
            icon={<Users className="h-8 w-8" />}
            to="/social"
          />
          <FeatureCard
            title="Reminders"
            description="Set and view your reminders"
            icon={<Bell className="h-8 w-8" />}
            to="/reminders"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
