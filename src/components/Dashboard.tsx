
import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Brain, Phone, Bell, Calendar, Users, Bot, Heart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../context/LanguageContext';

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}> = ({ title, description, icon, to }) => {
  return (
    <Link to={to} className="block">
      <Card className="feature-card h-full transition-all duration-200 hover:shadow-md">
        <div className="icon-container flex justify-center py-4 text-care-primary">
          {icon}
        </div>
        <CardContent className="text-center">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64 px-4">
      <div>
        <h2 className="text-3xl font-bold mb-6">{t('welcome.message')}, Sara</h2>
        
        <div className="bg-care-light p-4 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="mr-4 bg-care-primary p-3 rounded-full">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium">{t('reminders.title')}</h3>
              <p>Take Vitamin D at 8:00 AM</p>
              <p>Blood pressure medicine at 9:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t('feature.quickaccess')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FeatureCard
            title={t('feature.medications')}
            description={t('feature.medications.desc')}
            icon={<Pill className="h-8 w-8" />}
            to="/medications"
          />
          <FeatureCard
            title={t('feature.games')}
            description={t('feature.games.desc')}
            icon={<Brain className="h-8 w-8" />}
            to="/games"
          />
          <FeatureCard
            title={t('feature.emergency')}
            description={t('feature.emergency.desc')}
            icon={<Phone className="h-8 w-8" />}
            to="/emergency"
          />
          <FeatureCard
            title={t('feature.appointments')}
            description={t('feature.appointments.desc')}
            icon={<Calendar className="h-8 w-8" />}
            to="/appointments"
          />
          <FeatureCard
            title={t('feature.social')}
            description={t('feature.social.desc')}
            icon={<Users className="h-8 w-8" />}
            to="/social"
          />
          <FeatureCard
            title={t('feature.pharmacy')}
            description={t('feature.pharmacy.desc')}
            icon={<Pill className="h-8 w-8" />}
            to="/pharmacy"
          />
          <FeatureCard
            title={t('feature.assistant')}
            description={t('feature.assistant.desc')}
            icon={<Bot className="h-8 w-8" />}
            to="/aihealth"
          />
          <FeatureCard
            title={t('feature.videocall')}
            description={t('feature.videocall.desc')}
            icon={<Phone className="h-8 w-8" />}
            to="/telemedicine"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
