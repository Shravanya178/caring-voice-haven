import React, { useState } from 'react';
import { Heart, FileText, ArrowRight, Bookmark, ExternalLink, AlertTriangle, Info, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  link: string; // Making link required
  recommendedFor: string[];
  ageAppropriate?: string[]; // 'adult', 'senior', 'all'
}

interface Assessment {
  id: string;
  question: string;
  category: string;
  categoryDisplay: string; // Added to display category name
  ageAppropriate?: string[]; // 'adult', 'senior', 'all'
  options: { text: string; value: number; }[];
}

interface AssessmentResult {
  category: string;
  categoryDisplay: string;
  score: number;
  maxScore: number;
  interpretation: string;
  severity: 'low' | 'moderate' | 'high';
}

const MentalHealth = () => {
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState<number>(16);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [showAccessibility, setShowAccessibility] = useState<boolean>(false);
  const [ageGroup, setAgeGroup] = useState<string>('senior'); // Default to senior for this implementation
  
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Managing Anxiety in Later Life',
      category: 'anxiety',
      description: 'Learn effective strategies to manage anxiety and stress in your daily life.',
      link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      recommendedFor: ['anxiety', 'stress'],
      ageAppropriate: ['senior', 'all']
    },
    {
      id: '2',
      title: 'Depression: Signs and Support',
      category: 'depression',
      description: 'Recognize signs of depression and discover support options available to you.',
      link: 'https://www.nia.nih.gov/health/depression-and-older-adults',
      recommendedFor: ['depression', 'mood'],
      ageAppropriate: ['senior', 'all']
    },
    {
      id: '3',
      title: 'Sleep Hygiene Tips for Better Rest',
      category: 'sleep',
      description: 'Improve your sleep quality with these evidence-based recommendations for older adults.',
      link: 'https://www.sleepfoundation.org/aging-and-sleep',
      recommendedFor: ['sleep', 'stress'],
      ageAppropriate: ['senior', 'all']
    },
    {
      id: '4',
      title: 'Mindfulness Meditation Guide for Seniors',
      category: 'mindfulness',
      description: 'A senior-friendly guide to practicing mindfulness meditation for mental wellbeing.',
      link: 'https://www.mindful.org/meditation-for-seniors/',
      recommendedFor: ['anxiety', 'stress', 'sleep'],
      ageAppropriate: ['senior']
    },
    {
      id: '5',
      title: 'Understanding PTSD in Older Adults',
      category: 'ptsd',
      description: 'Learn about post-traumatic stress disorder symptoms and treatment options for seniors.',
      link: 'https://www.ptsd.va.gov/understand/index.asp',
      recommendedFor: ['trauma', 'anxiety'],
      ageAppropriate: ['senior']
    },
    {
      id: '6',
      title: 'Cognitive Behavioral Therapy Techniques',
      category: 'cbt',
      description: 'Self-help cognitive behavioral therapy techniques you can practice at home.',
      link: 'https://www.apa.org/topics/cognitive-behavioral-therapy',
      recommendedFor: ['depression', 'anxiety'],
      ageAppropriate: ['all']
    },
    {
      id: '7',
      title: 'Building Social Connections for Seniors',
      category: 'social',
      description: 'Tips for building and maintaining social connections as you age to reduce isolation.',
      link: 'https://www.ncoa.org/article/7-ways-to-stay-connected-during-covid-19',
      recommendedFor: ['depression', 'social', 'isolation'],
      ageAppropriate: ['senior']
    },
    {
      id: '8',
      title: 'Crisis Support Resources',
      category: 'crisis',
      description: 'Immediate resources and hotlines for mental health crises and emergencies.',
      link: 'https://www.samhsa.gov/find-help/national-helpline',
      recommendedFor: ['crisis', 'depression', 'suicidal'],
      ageAppropriate: ['all']
    },
    {
      id: '9',
      title: 'Coping with Grief and Loss',
      category: 'grief',
      description: 'Guidance for navigating grief after losing a spouse, friends, or loved ones.',
      link: 'https://www.helpguide.org/articles/grief/coping-with-grief-and-loss.htm',
      recommendedFor: ['grief', 'depression'],
      ageAppropriate: ['senior', 'all']
    },
    {
      id: '10',
      title: 'Managing Chronic Pain and Mental Health',
      category: 'pain',
      description: 'Strategies for managing chronic pain while supporting mental wellbeing.',
      link: 'https://www.webmd.com/pain-management/guide/11-tips-for-living-with-chronic-pain',
      recommendedFor: ['pain', 'depression', 'anxiety'],
      ageAppropriate: ['senior']
    },
    {
      id: '11',
      title: 'Memory Concerns and Cognitive Health',
      category: 'cognitive',
      description: 'Understanding normal age-related memory changes versus signs of cognitive decline.',
      link: 'https://www.nia.nih.gov/health/memory-forgetfulness-and-aging-whats-normal-and-whats-not',
      recommendedFor: ['cognitive', 'memory'],
      ageAppropriate: ['senior']
    },
    {
      id: '12',
      title: 'Caregiver Support Resources',
      category: 'caregiving',
      description: 'Support for those caring for a spouse or managing their own care needs.',
      link: 'https://www.caregiver.org/resource/caregiving-at-home-guide/',
      recommendedFor: ['caregiver', 'stress'],
      ageAppropriate: ['senior']
    },
  ]);

  // Restructured assessment questions with equal numbers for each category (4 each)
  const [assessments] = useState<Assessment[]>([
    // Depression questions (4 questions)
    {
      id: 'd1',
      category: 'depression',
      categoryDisplay: 'Depression Assessment',
      question: 'Over the past 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'd2',
      category: 'depression',
      categoryDisplay: 'Depression Assessment',
      question: 'Over the past 2 weeks, how often have you had little interest or pleasure in doing things you used to enjoy?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'd3',
      category: 'depression',
      categoryDisplay: 'Depression Assessment',
      question: 'Over the past 2 weeks, how often have you felt tired or had little energy?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'd4',
      category: 'depression',
      categoryDisplay: 'Depression Assessment',
      question: 'Over the past 2 weeks, how often have you felt bad about yourself - or that you are a failure or have let yourself or your family down?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    
    // Anxiety questions (4 questions)
    {
      id: 'a1',
      category: 'anxiety',
      categoryDisplay: 'Anxiety Assessment',
      question: 'Over the past 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'a2',
      category: 'anxiety',
      categoryDisplay: 'Anxiety Assessment',
      question: 'Over the past 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'a3',
      category: 'anxiety',
      categoryDisplay: 'Anxiety Assessment',
      question: 'Over the past 2 weeks, how often have you been bothered by worrying too much about different things?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'a4',
      category: 'anxiety',
      categoryDisplay: 'Anxiety Assessment',
      question: 'Over the past 2 weeks, how often have you found it difficult to relax?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
    
    // Sleep questions (4 questions)
    {
      id: 's1',
      category: 'sleep',
      categoryDisplay: 'Sleep Assessment',
      question: 'How would you rate your overall sleep quality in the past month?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Very good', value: 0 },
        { text: 'Fairly good', value: 1 },
        { text: 'Fairly bad', value: 2 },
        { text: 'Very bad', value: 3 },
      ],
    },
    {
      id: 's2',
      category: 'sleep',
      categoryDisplay: 'Sleep Assessment',
      question: 'How often do you have trouble falling asleep?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Never', value: 0 },
        { text: 'Rarely', value: 1 },
        { text: 'Once or twice a week', value: 2 },
        { text: 'Three or more times a week', value: 3 },
      ],
    },
    {
      id: 's3',
      category: 'sleep',
      categoryDisplay: 'Sleep Assessment',
      question: 'How often do you wake up during the night and have trouble going back to sleep?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Never', value: 0 },
        { text: 'Rarely', value: 1 },
        { text: 'Once or twice a week', value: 2 },
        { text: 'Three or more times a week', value: 3 },
      ],
    },
    {
      id: 's4',
      category: 'sleep',
      categoryDisplay: 'Sleep Assessment',
      question: 'How often do you feel rested when you wake up in the morning?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Almost always', value: 0 },
        { text: 'Often', value: 1 },
        { text: 'Sometimes', value: 2 },
        { text: 'Rarely or never', value: 3 },
      ],
    },
    
    // Social connection questions (4 questions)
    {
      id: 'sc1',
      category: 'social',
      categoryDisplay: 'Social Connection Assessment',
      question: 'How often do you feel that you lack companionship?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Hardly ever', value: 0 },
        { text: 'Some of the time', value: 1 },
        { text: 'Often', value: 2 },
        { text: 'Most of the time', value: 3 },
      ],
    },
    {
      id: 'sc2',
      category: 'social',
      categoryDisplay: 'Social Connection Assessment',
      question: 'How often do you feel isolated from others?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Never', value: 0 },
        { text: 'Rarely', value: 1 },
        { text: 'Sometimes', value: 2 },
        { text: 'Often', value: 3 },
      ],
    },
    {
      id: 'sc3',
      category: 'social',
      categoryDisplay: 'Social Connection Assessment',
      question: 'How often do you feel left out?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Never', value: 0 },
        { text: 'Rarely', value: 1 },
        { text: 'Sometimes', value: 2 },
        { text: 'Often', value: 3 },
      ],
    },
    {
      id: 'sc4',
      category: 'social',
      categoryDisplay: 'Social Connection Assessment',
      question: 'How satisfied are you with your social relationships?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Very satisfied', value: 0 },
        { text: 'Somewhat satisfied', value: 1 },
        { text: 'Somewhat dissatisfied', value: 2 },
        { text: 'Very dissatisfied', value: 3 },
      ],
    },
    
    // Grief and loss questions (4 questions)
    {
      id: 'g1',
      category: 'grief',
      categoryDisplay: 'Grief Assessment',
      question: 'In the past year, have you experienced the loss of a spouse, family member, or close friend?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'No', value: 0 },
        { text: 'Yes, and it\'s not affecting me much now', value: 1 },
        { text: 'Yes, and I\'m still adjusting to it', value: 2 },
        { text: 'Yes, and I\'m still struggling with it significantly', value: 3 },
      ],
    },
    {
      id: 'g2',
      category: 'grief',
      categoryDisplay: 'Grief Assessment',
      question: 'How often do you find yourself preoccupied with thoughts about your lost loved one(s)?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Rarely or never', value: 0 },
        { text: 'Sometimes', value: 1 },
        { text: 'Frequently', value: 2 },
        { text: 'Almost constantly', value: 3 },
      ],
    },
    {
      id: 'g3',
      category: 'grief',
      categoryDisplay: 'Grief Assessment',
      question: 'How difficult is it for you to accept the loss?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Not difficult', value: 0 },
        { text: 'Somewhat difficult', value: 1 },
        { text: 'Very difficult', value: 2 },
        { text: 'Extremely difficult', value: 3 },
      ],
    },
    {
      id: 'g4',
      category: 'grief',
      categoryDisplay: 'Grief Assessment',
      question: 'How much does your grief interfere with your daily life?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'A little bit', value: 1 },
        { text: 'Moderately', value: 2 },
        { text: 'Significantly', value: 3 },
      ],
    },
    
    // Cognitive health questions (4 questions)
    {
      id: 'c1',
      category: 'cognitive',
      categoryDisplay: 'Cognitive Health Assessment',
      question: 'How concerned are you about changes in your memory or thinking?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Not at all concerned', value: 0 },
        { text: 'Slightly concerned', value: 1 },
        { text: 'Moderately concerned', value: 2 },
        { text: 'Very concerned', value: 3 },
      ],
    },
    {
      id: 'c2',
      category: 'cognitive',
      categoryDisplay: 'Cognitive Health Assessment',
      question: 'How often do you have trouble remembering recent events or conversations?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Rarely or never', value: 0 },
        { text: 'Sometimes', value: 1 },
        { text: 'Often', value: 2 },
        { text: 'Very often', value: 3 },
      ],
    },
    {
      id: 'c3',
      category: 'cognitive',
      categoryDisplay: 'Cognitive Health Assessment',
      question: 'How often do you have difficulty finding the right word when speaking?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Rarely or never', value: 0 },
        { text: 'Sometimes', value: 1 },
        { text: 'Often', value: 2 },
        { text: 'Very often', value: 3 },
      ],
    },
    {
      id: 'c4',
      category: 'cognitive',
      categoryDisplay: 'Cognitive Health Assessment',
      question: 'How often do you have difficulty with problem-solving or planning?',
      ageAppropriate: ['senior'],
      options: [
        { text: 'Rarely or never', value: 0 },
        { text: 'Sometimes', value: 1 },
        { text: 'Often', value: 2 },
        { text: 'Very often', value: 3 },
      ],
    },
    
    // Crisis indicator - always at the end
    {
      id: 'crisis1',
      category: 'crisis',
      categoryDisplay: 'Well-being Assessment',
      question: 'Over the past 2 weeks, how often have you been bothered by thoughts that you would be better off dead or of hurting yourself in some way?',
      ageAppropriate: ['all'],
      options: [
        { text: 'Not at all', value: 0 },
        { text: 'Several days', value: 1 },
        { text: 'More than half the days', value: 2 },
        { text: 'Nearly every day', value: 3 },
      ],
    },
  ]);

  const [currentAssessment, setCurrentAssessment] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>([]);
  const [showCrisisWarning, setShowCrisisWarning] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  // Filter assessments based on age group
  const filteredAssessments = assessments.filter(assessment => 
    assessment.ageAppropriate?.includes('all') || assessment.ageAppropriate?.includes(ageGroup)
  );

  const handleResourceClick = (resource: Resource) => {
    if (resource.link) {
      toast({
        title: "Opening External Resource",
        description: `Opening ${resource.title} in a new tab.`,
      });
      // Open link in new tab
      window.open(resource.link, '_blank');
    }
  };

  const handleSaveResource = (resource: Resource) => {
    toast({
      title: "Resource Saved",
      description: `${resource.title} has been saved to your library.`,
    });
  };

  const handleAnswerSelect = (value: number) => {
    const newAnswers = {...answers};
    newAnswers[filteredAssessments[currentAssessment].id] = value;
    setAnswers(newAnswers);
    
    if (currentAssessment < filteredAssessments.length - 1) {
      setCurrentAssessment(currentAssessment + 1);
    } else {
      // Calculate results
      calculateResults(newAnswers);
      setAssessmentComplete(true);
    }
  };

  const calculateResults = (responses: {[key: string]: number}) => {
    // Group answers by category
    const categorizedAnswers: {[category: string]: {scores: number[], display: string}} = {};
    
    filteredAssessments.forEach(assessment => {
      const category = assessment.category;
      if (!categorizedAnswers[category]) {
        categorizedAnswers[category] = {
          scores: [],
          display: assessment.categoryDisplay
        };
      }
      
      if (responses[assessment.id] !== undefined) {
        categorizedAnswers[category].scores.push(responses[assessment.id]);
      }
    });
    
    // Calculate scores for each category
    const results: AssessmentResult[] = [];
    let totalScore = 0;
    let totalMaxPossible = 0;
    let crisisFlagged = false;
    
    Object.keys(categorizedAnswers).forEach(category => {
      const scores = categorizedAnswers[category].scores;
      const categoryDisplay = categorizedAnswers[category].display;
      const sum = scores.reduce((a, b) => a + b, 0);
      const maxPossible = scores.length * Math.max(...filteredAssessments
        .filter(a => a.category === category)
        .flatMap(a => a.options)
        .map(o => o.value));
      
      // Track for overall score
      totalScore += sum;
      totalMaxPossible += maxPossible;
      
      // Determine severity
      const percentage = (sum / maxPossible) * 100;
      let severity: 'low' | 'moderate' | 'high';
      let interpretation = '';
      
      if (percentage < 30) {
        severity = 'low';
        interpretation = getCategoryInterpretation(category, 'low');
      } else if (percentage < 60) {
        severity = 'moderate';
        interpretation = getCategoryInterpretation(category, 'moderate');
      } else {
        severity = 'high';
        interpretation = getCategoryInterpretation(category, 'high');
      }
      
      // Special handling for crisis category
      if (category === 'crisis' && sum > 0) {
        crisisFlagged = true;
      }
      
      results.push({
        category,
        categoryDisplay,
        score: sum,
        maxScore: maxPossible,
        interpretation,
        severity
      });
    });
    
    // Calculate overall wellbeing score (inverse of total score percentage)
    const overallPercentage = Math.max(0, 100 - ((totalScore / totalMaxPossible) * 100));
    
    setAssessmentResults(results);
    setOverallScore(Math.round(overallPercentage));
    setShowCrisisWarning(crisisFlagged);
    
    // Generate recommended resources
    const concernCategories = results
      .filter(r => r.severity !== 'low')
      .map(r => r.category);
    
    // Always add crisis resources if flagged
    if (crisisFlagged) {
      concernCategories.push('crisis');
    }
    
    // Filter resources by age group and concerns
    const filtered = resources.filter(resource => 
      (resource.ageAppropriate?.includes('all') || resource.ageAppropriate?.includes(ageGroup)) &&
      resource.recommendedFor.some(cat => concernCategories.includes(cat))
    );
    
    setRecommendedResources(filtered.length > 0 ? filtered : resources
      .filter(r => r.ageAppropriate?.includes('all') || r.ageAppropriate?.includes(ageGroup))
      .slice(0, 4));
  };

  const getCategoryInterpretation = (category: string, severity: string): string => {
    const interpretations: {[key: string]: {[key: string]: string}} = {
      depression: {
        low: "Your responses suggest minimal depressive symptoms.",
        moderate: "Your responses suggest some depressive symptoms that may benefit from support.",
        high: "Your responses indicate significant depressive symptoms. Consider consulting a healthcare provider."
      },
      anxiety: {
        low: "Your responses suggest minimal anxiety symptoms.",
        moderate: "Your responses suggest some anxiety symptoms that may benefit from support.",
        high: "Your responses indicate significant anxiety symptoms. Consider consulting a healthcare provider."
      },
      sleep: {
        low: "Your sleep quality appears to be good.",
        moderate: "You may be experiencing some sleep difficulties.",
        high: "Your responses suggest significant sleep problems that may be affecting your wellbeing."
      },
      social: {
        low: "You appear to have good social connections.",
        moderate: "You may benefit from more social connection.",
        high: "Your responses suggest you may be experiencing social isolation."
      },
      isolation: {
        low: "You appear to have adequate social interaction.",
        moderate: "You may be experiencing some social isolation.",
        high: "Your responses suggest significant social isolation that could be affecting your wellbeing."
      },
      stress: {
        low: "Your stress levels appear to be manageable.",
        moderate: "You're experiencing moderate stress that may benefit from stress management techniques.",
        high: "Your stress levels appear to be high. Consider stress reduction strategies."
      },
      grief: {
        low: "You don't appear to be experiencing significant grief issues currently.",
        moderate: "You may be experiencing some grief that could benefit from support.",
        high: "Your grief appears to be significantly affecting your wellbeing. Support services may be helpful."
      },
      cognitive: {
        low: "You don't appear concerned about cognitive changes.",
        moderate: "You have some concerns about cognitive changes. Consider discussing these with your healthcare provider at your next visit.",
        high: "You have significant concerns about cognitive changes. We recommend discussing these with your healthcare provider."
      },
      pain: {
        low: "Physical pain doesn't appear to be significantly affecting your wellbeing.",
        moderate: "Physical pain may be affecting your wellbeing. Pain management strategies could be helpful.",
        high: "Physical pain appears to be significantly affecting your wellbeing. Consider consulting with a healthcare provider about pain management strategies."
      },
      caregiver: {
        low: "Caregiving responsibilities don't appear to be significantly affecting your wellbeing.",
        moderate: "Your caregiving responsibilities may be causing some strain. Caregiver support resources could be helpful.",
        high: "Your caregiving responsibilities appear to be significantly affecting your wellbeing. Caregiver support resources are recommended."
      },
      independence: {
        low: "You don't appear concerned about maintaining independence.",
        moderate: "You have some concerns about maintaining independence. Planning for future needs may be helpful.",
        high: "You have significant concerns about maintaining independence. Consider discussing these concerns with loved ones or healthcare providers."
      },
      crisis: {
        low: "No crisis indicators detected.",
        moderate: "Some concerning thoughts present.",
        high: "Please seek immediate support from a healthcare provider or crisis service."
      }
    };
    
    return interpretations[category]?.[severity] || 
      "This area may benefit from further assessment.";
  };

  const restartAssessment = () => {
    setAnswers({});
    setCurrentAssessment(0);
    setOverallScore(null);
    setAssessmentResults([]);
    setShowCrisisWarning(false);
    setAssessmentComplete(false);
    setShowResources(false);
  };

  const toggleView = () => {
    if (assessmentComplete) {
      setShowResources(!showResources);
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 40) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  const getCategoryColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-200 border-red-500';
      case 'moderate':
        return 'bg-yellow-100 border-yellow-500';
      case 'low':
        return 'bg-green-100 border-green-500';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getCategoryTextColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-700';
      case 'moderate':
        return 'text-yellow-700';
      case 'low':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'moderate':
        return <Info className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <Heart className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  // Handle accessibility preferences
  const toggleAccessibilityPanel = () => {
    setShowAccessibility(!showAccessibility);
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value[0]);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  // Apply appropriate styles based on accessibility settings
  const accessibilityStyles = {
    fontSize: `${fontSize}px`,
    color: highContrast ? '#ffffff' : 'inherit',
    backgroundColor: highContrast ? '#000000' : 'inherit',
  };

  const containerClasses = `min-h-screen p-4 md:p-8 ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`;

  return (
    <div className={`min-h-screen p-4 md:p-6 ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`} style={{ fontSize: `${fontSize}px` }}>
      <header className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Senior Mental Wellbeing Assessment</h1>
        <Button variant="ghost" onClick={toggleAccessibilityPanel}>
          <Settings className="h-5 w-5 mr-1" />
          <span>Accessibility</span>
        </Button>
      </header>

      <div className="max-w-4xl mx-auto">
        {showAccessibility && (
          <Card className={`mb-6 ${highContrast ? 'bg-gray-900 border-gray-700' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle>Accessibility Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2">Font Size: {fontSize}px</label>
                <Slider
                  defaultValue={[fontSize]}
                  min={12}
                  max={32}
                  step={2}
                  onValueChange={handleFontSizeChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
                <label htmlFor="high-contrast">High Contrast Mode</label>
              </div>
            </CardContent>
          </Card>
        )}

        {showCrisisWarning && assessmentComplete && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-red-700">Important Notice</h2>
                <p className="text-red-700 mb-2">
                  Your responses indicate you may be experiencing thoughts of self-harm. Please consider speaking with a mental health professional or calling a crisis helpline:
                </p>
                <p className="font-bold text-red-700">National Suicide Prevention Lifeline: 988 or 1-800-273-8255</p>
                <p className="text-red-700">Available 24 hours a day, 7 days a week</p>
              </div>
            </div>
          </div>
        )}

        {!assessmentComplete ? (
          <Card className={`${highContrast ? 'bg-gray-900 border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle>{filteredAssessments[currentAssessment]?.categoryDisplay || "Mental Health Assessment"}</CardTitle>
              <CardDescription>
                Question {currentAssessment + 1} of {filteredAssessments.length}
              </CardDescription>
              <Progress value={(currentAssessment / filteredAssessments.length) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="text-lg mb-4">{filteredAssessments[currentAssessment]?.question}</h3>
              <div className="space-y-2">
                {filteredAssessments[currentAssessment]?.options.map((option, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start p-4 h-auto"
                    onClick={() => handleAnswerSelect(option.value)}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={!showResources ? "default" : "outline"} 
                  onClick={() => toggleView()}
                  className="w-full py-2 rounded-md"
                >
                  Results
                </Button>
                <Button 
                  variant={showResources ? "default" : "outline"} 
                  onClick={() => toggleView()}
                  className="w-full py-2 rounded-md"
                >
                  Resources
                </Button>
              </div>
            </div>

            {!showResources ? (
              <div className="space-y-6">
                {overallScore !== null && (
                  <Card className={`${highContrast ? 'bg-gray-900 border-gray-700' : ''}`}>
                    <CardHeader>
                      <CardTitle>Your Wellbeing Score</CardTitle>
                      <CardDescription>Based on your responses across all categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center mb-4">
                        <div className="relative h-48 w-48">
                          {/* Base circle (background) */}
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="transparent" 
                              stroke="#e5e7eb" 
                              strokeWidth="10"
                            />
                            {/* Progress circle */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="transparent" 
                              stroke={
                                overallScore < 40 ? "#ef4444" : 
                                overallScore < 70 ? "#eab308" : 
                                "#22c55e"
                              } 
                              strokeWidth="10"
                              strokeDasharray={`${overallScore * 2.51} 251`}
                              strokeDashoffset="62.75"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          {/* Center text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl font-bold">{overallScore}%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-center mt-2">
                        {overallScore < 40 ? "Your results indicate areas of significant concern. Consider reviewing the resources provided and consulting with a healthcare professional." :
                         overallScore < 70 ? "Your results indicate some areas of concern. Review the resources provided and consider following up with a healthcare professional about specific concerns." :
                         "Your results indicate generally good mental wellbeing. Continue with healthy practices and review any specific areas of concern."}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {assessmentResults
                    .filter(result => result.category !== 'crisis')
                    .map((result, index) => (
                      <Card 
                        key={index} 
                        className={`border-l-4 ${getCategoryColor(result.severity)} ${highContrast ? 'bg-gray-900' : ''}`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center">
                              {getSeverityIcon(result.severity)}
                              <span className="ml-2">{result.categoryDisplay}</span>
                            </CardTitle>
                            <div className={`text-sm font-medium ${getCategoryTextColor(result.severity)}`}>
                              {result.severity === 'low' ? 'Minimal Concern' : 
                               result.severity === 'moderate' ? 'Moderate Concern' : 
                               'High Concern'}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="py-1">{result.interpretation}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button onClick={restartAssessment}>
                    Take Assessment Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Recommended Resources</h2>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {recommendedResources.map((resource, index) => (
                    <Card key={index} className={`${highContrast ? 'bg-gray-900 border-gray-700' : ''}`}>
                      <CardHeader className="pb-2">
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{resource.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSaveResource(resource)}
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleResourceClick(resource)}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Resource
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-700">Important Note</h3>
                      <p className="text-blue-600">
                        These resources are provided for informational purposes only and are not a substitute for professional medical advice. Always consult with a qualified healthcare provider regarding any health concerns.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button onClick={restartAssessment}>
                    Take Assessment Again
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="mt-12 text-center text-sm text-gray-500 max-w-4xl mx-auto">
        <p>© 2025 Senior Mental Health Support. This tool is not a diagnostic instrument and is intended for informational purposes only.</p>
      </footer>
    </div>
  );
};

export default MentalHealth;
