import React, { useState } from 'react';
import { Heart, FileText, ArrowRight, Bookmark, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { useLanguage } from '../context/LanguageContext';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  link?: string;
}

interface Assessment {
  id: string;
  question: string;
  options: { text: string; value: number; }[];
}

const MentalHealth = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Managing Anxiety in Later Life',
      category: 'Anxiety',
      description: 'Learn effective strategies to manage anxiety and stress in your daily life.',
      link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
    },
    {
      id: '2',
      title: 'Depression: Signs and Support',
      category: 'Depression',
      description: 'Recognize signs of depression and discover support options available to you.',
      link: 'https://www.nia.nih.gov/health/depression-and-older-adults',
    },
    {
      id: '3',
      title: 'Sleep Hygiene Tips for Better Rest',
      category: 'Sleep',
      description: 'Improve your sleep quality with these evidence-based recommendations.',
      link: 'https://www.sleepfoundation.org/sleep-hygiene/healthy-sleep-tips',
    },
    {
      id: '4',
      title: 'Mindfulness Meditation Guide',
      category: 'Mindfulness',
      description: 'A beginner\'s guide to practicing mindfulness meditation for mental wellbeing.',
      link: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
    },
  ]);

  const [assessments] = useState<Assessment[]>([
    {
      id: '1',
      question: 'How often have you been bothered by feeling down, depressed, or hopeless over the past 2 weeks?',
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: '2',
      question: 'How often have you had little interest or pleasure in doing things over the past 2 weeks?',
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
  ]);

  const [currentAssessment, setCurrentAssessment] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [wellnessScore, setWellnessScore] = useState<number | null>(null);
  const [showResources, setShowResources] = useState(true);

  const handleResourceClick = (resource: Resource) => {
    if (resource.link) {
      toast({
        title: t('mentalhealth.opening.external'),
        description: `${t('mentalhealth.opening.desc')} ${resource.title} ${t('mentalhealth.in.new.tab')}`,
      });
      window.open(resource.link, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: t('mentalhealth.resource.selected'),
        description: `${t('mentalhealth.viewing')} ${resource.title}`,
      });
    }
  };

  const handleSaveResource = (resource: Resource) => {
    toast({
      title: t('mentalhealth.resource.saved'),
      description: `${resource.title} ${t('mentalhealth.resource.saved.desc')}`,
    });
  };

  const handleAnswerSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentAssessment] = value;
    setAnswers(newAnswers);
    
    if (currentAssessment < assessments.length - 1) {
      setCurrentAssessment(currentAssessment + 1);
    } else {
      // Calculate score (simple sum for demo)
      const score = Math.max(0, 100 - (newAnswers.reduce((sum, val) => sum + val, 0) * 20));
      setWellnessScore(score);
      setShowResources(true);
    }
  };

  const restartAssessment = () => {
    setAnswers([]);
    setCurrentAssessment(0);
    setWellnessScore(null);
  };

  const toggleView = () => {
    if (wellnessScore !== null) {
      setShowResources(!showResources);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:ml-64 animate-fade-in">
      <div className="flex items-center mb-6">
        <Heart className="h-8 w-8 text-red-500 mr-3" />
        <h1 className="text-3xl font-bold">{t('mentalhealth.title')}</h1>
      </div>

      {wellnessScore === null ? (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t('mentalhealth.assessment.title')}</CardTitle>
              <CardDescription>
                {t('mentalhealth.assessment.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-lg font-medium">
                  {t('mentalhealth.question')} {currentAssessment + 1} {t('mentalhealth.of')} {assessments.length}
                </h3>
                <p className="text-base">{assessments[currentAssessment].question}</p>
                <div className="space-y-2">
                  {assessments[currentAssessment].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={answers[currentAssessment] === option.value ? "default" : "outline"}
                      className="w-full justify-start h-auto py-3 px-4 mb-2"
                      onClick={() => handleAnswerSelect(option.value)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={toggleView}>
              {showResources ? t('mentalhealth.view.results') : t('mentalhealth.view.resources')}
            </Button>
            <Button variant="ghost" onClick={restartAssessment}>
              {t('mentalhealth.retake')}
            </Button>
          </div>

          {showResources ? (
            <div className="grid gap-4 md:grid-cols-2">
              {resources.map(resource => (
                <Card key={resource.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {resource.category}
                        </span>
                        <CardTitle className="mt-2">{resource.title}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleSaveResource(resource)}
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-care-primary hover:bg-care-secondary"
                      onClick={() => handleResourceClick(resource)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('mentalhealth.read.article')}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('mentalhealth.score.title')}</CardTitle>
                <CardDescription>
                  {t('mentalhealth.score.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t('mentalhealth.wellness.score')}</span>
                    <span className="font-medium">{wellnessScore}%</span>
                  </div>
                  <Progress value={wellnessScore} className="h-3" />
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">{t('mentalhealth.what.means')}</h3>
                  <p className="text-blue-700 text-sm">
                    {wellnessScore >= 70 
                      ? t('mentalhealth.score.high') 
                      : wellnessScore >= 40 
                        ? t('mentalhealth.score.medium') 
                        : t('mentalhealth.score.low')}
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-care-primary hover:bg-care-secondary"
                  onClick={toggleView}
                >
                  {t('mentalhealth.view.recommended')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MentalHealth;
