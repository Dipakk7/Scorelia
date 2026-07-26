import type {
  InterviewPrepOverviewData,
  ResumeOption,
  DifficultyOption,
  InterviewTypeOption,
  InterviewModeOption,
  MockInterviewHistoryItem,
  QuestionCategory,
  QuestionBankItem,
  PracticeSummaryData,
  RecentlyPracticedQuestionItem,
  AnswerSummaryData,
  AnswerHistoryItem,
  AnswerDetailData,
  ImprovementSuggestionData,
  RecentAttemptItem,
  PerformanceWorkspaceData,
  InterviewCopilotWorkspaceData,
} from '@/types/interviewPrep'

export class InterviewPrepMockData {
  static getOverviewData(): InterviewPrepOverviewData {
    return {
      metrics: [
        {
          id: 'readiness',
          title: 'Overall Readiness Score',
          value: 87,
          unit: '/100',
          subtext: 'Excellent',
          gaugeScore: 87,
          readinessTag: 'Excellent',
          candidatePercentile: 'Top 18% of candidates',
        },
        {
          id: 'completed_mocks',
          title: 'Mock Interviews',
          value: 12,
          unit: 'Completed',
          trend: '↑ 3 this week',
          trendType: 'positive',
          sparklinePoints: [10, 15, 12, 18, 22, 28, 30],
        },
        {
          id: 'avg_score',
          title: 'Average Score',
          value: '84%',
          unit: 'Across all mocks',
          trend: '↑ 6% vs last week',
          trendType: 'positive',
          sparklinePoints: [60, 65, 72, 75, 78, 82, 84],
        },
        {
          id: 'strong_areas',
          title: 'Strong Areas',
          value: 6,
          unit: 'Skills identified',
          badge: 'Improving',
          badgeVariant: 'success',
        },
        {
          id: 'areas_to_improve',
          title: 'Areas to Improve',
          value: 3,
          unit: 'Focus areas',
          badge: 'Needs attention',
          badgeVariant: 'warning',
        },
        {
          id: 'streak',
          title: 'Interview Streak',
          value: 5,
          unit: 'Days in a row',
          badge: 'Keep it up! 🔥',
          badgeVariant: 'orange',
        },
      ],

      upcomingInterview: {
        id: 'upcoming-1',
        dateMonth: 'MAY',
        dateDay: 22,
        title: 'AI/ML Engineer Interview',
        companyName: 'Google',
        companyLogo: 'https://api.iconify.design/logos:google-icon.svg',
        durationMinutes: 60,
        interviewType: 'Technical',
        scheduleTimeText: 'Tomorrow, 10:00 AM',
        isTomorrow: true,
        countdownText: 'In 18 hours',
      },

      recommendations: [
        {
          id: 'rec-1',
          title: 'AI/ML Engineer',
          roleMatchPercent: 92,
          badgeText: 'Role Match: 92%',
          badgeVariant: 'success',
          iconName: 'Bot',
          description: 'Practice questions tailored for AI/ML Engineer roles.',
          currentPracticed: 18,
          totalQuestions: 25,
          totalTimeMinutes: 45,
          difficulty: 'Medium',
          isBookmarked: false,
        },
        {
          id: 'rec-2',
          title: 'Machine Learning',
          skillMatchPercent: 88,
          badgeText: 'Skill Match: 88%',
          badgeVariant: 'success',
          iconName: 'Brain',
          description: 'Deep dive into ML concepts and problem-solving.',
          currentPracticed: 14,
          totalQuestions: 20,
          totalTimeMinutes: 40,
          difficulty: 'Hard',
          isBookmarked: true,
        },
        {
          id: 'rec-3',
          title: 'System Design',
          badgeText: 'Need Improvement',
          badgeVariant: 'warning',
          iconName: 'Layers',
          description: 'Enhance your system design and architecture skills.',
          currentPracticed: 6,
          totalQuestions: 15,
          totalTimeMinutes: 60,
          difficulty: 'Hard',
          isBookmarked: false,
        },
      ],

      practiceTopics: [
        {
          id: 'topic-1',
          title: 'Machine Learning',
          totalQuestions: 25,
          completionPercent: 72,
          priority: '+ High',
          priorityVariant: 'high',
          estimatedTimeMinutes: 45,
          iconName: 'Brain',
          colorTheme: 'emerald',
        },
        {
          id: 'topic-2',
          title: 'Deep Learning',
          totalQuestions: 20,
          completionPercent: 50,
          priority: 'Medium',
          priorityVariant: 'medium',
          estimatedTimeMinutes: 40,
          iconName: 'Cpu',
          colorTheme: 'cyan',
        },
        {
          id: 'topic-3',
          title: 'Python Programming',
          totalQuestions: 30,
          completionPercent: 85,
          priority: '+ High',
          priorityVariant: 'high',
          estimatedTimeMinutes: 50,
          iconName: 'Code2',
          colorTheme: 'purple',
        },
        {
          id: 'topic-4',
          title: 'SQL & Databases',
          totalQuestions: 18,
          completionPercent: 60,
          priority: 'Medium',
          priorityVariant: 'medium',
          estimatedTimeMinutes: 30,
          iconName: 'Database',
          colorTheme: 'indigo',
        },
        {
          id: 'topic-5',
          title: 'Data Structures & Algorithms',
          totalQuestions: 22,
          completionPercent: 40,
          priority: '+ High',
          priorityVariant: 'high',
          estimatedTimeMinutes: 60,
          iconName: 'Boxes',
          colorTheme: 'amber',
        },
        {
          id: 'topic-6',
          title: 'System Design',
          totalQuestions: 15,
          completionPercent: 35,
          priority: 'Medium',
          priorityVariant: 'medium',
          estimatedTimeMinutes: 60,
          iconName: 'Network',
          colorTheme: 'blue',
        },
      ],

      questionBankStats: {
        difficulties: [
          {
            id: 'easy',
            label: 'Easy',
            questionCount: 156,
            avgScorePercent: 82,
            accentColor: 'emerald',
          },
          {
            id: 'medium',
            label: 'Medium',
            questionCount: 243,
            avgScorePercent: 74,
            accentColor: 'amber',
          },
          {
            id: 'hard',
            label: 'Hard',
            questionCount: 189,
            avgScorePercent: 68,
            accentColor: 'rose',
          },
        ],
        libraryStats: [
          {
            title: 'Question Library',
            value: '1,250+ Total Questions',
            iconName: 'BookOpen',
          },
          {
            title: 'Companies',
            value: '50+ Top Companies',
            iconName: 'Building2',
          },
          {
            title: 'Roles Covered',
            value: '12+ Job Roles',
            iconName: 'Briefcase',
          },
          {
            title: 'Updated',
            value: 'Daily New Questions',
            iconName: 'RefreshCw',
          },
        ],
      },

      aiSidebarData: {
        assistantName: 'Scorelia AI Assistant',
        status: 'Online',
        greeting: 'Hi Dipak! I can help you prepare for your interviews and improve your performance.',
        quickPrompts: [
          'Generate practice questions',
          'Review my last interview',
          'How to answer "Tell me about yourself?"',
          'Explain a technical concept',
        ],
        coreSkills: [
          { label: 'Machine Learning', percentage: 92, iconName: 'Brain' },
          { label: 'Python', percentage: 88, iconName: 'Code2' },
          { label: 'SQL', percentage: 76, iconName: 'Database' },
          { label: 'System Design', percentage: 72, iconName: 'Network' },
          { label: 'Deep Learning', percentage: 61, iconName: 'Cpu' },
          { label: 'Data Structures', percentage: 58, iconName: 'Boxes' },
        ],
        recentPerformance: [
          {
            id: 'perf-1',
            title: 'AI/ML Engineer Mock',
            date: 'May 18, 2026',
            scorePercent: 86,
            scoreTag: 'Passed',
          },
          {
            id: 'perf-2',
            title: 'Machine Learning Mock',
            date: 'May 16, 2026',
            scorePercent: 82,
            scoreTag: 'Passed',
          },
          {
            id: 'perf-3',
            title: 'Python Technical Mock',
            date: 'May 14, 2026',
            scorePercent: 78,
            scoreTag: 'Passed',
          },
        ],
      },
    }
  }

  static getResumesList(): ResumeOption[] {
    return [
      {
        id: 'res-1',
        fileName: 'AI_ML_Engineer_Resume_2026.pdf',
        roleTarget: 'AI/ML Engineer',
        lastUpdated: 'Updated 2 days ago',
        isDefault: true,
      },
      {
        id: 'res-2',
        fileName: 'Senior_FullStack_Engineer.pdf',
        roleTarget: 'Full Stack Engineer',
        lastUpdated: 'Updated 1 week ago',
      },
      {
        id: 'res-3',
        fileName: 'Data_Scientist_Resume_V2.pdf',
        roleTarget: 'Data Scientist',
        lastUpdated: 'Updated 3 weeks ago',
      },
    ]
  }

  static getDifficultiesList(): DifficultyOption[] {
    return [
      {
        id: 'easy',
        label: 'Easy',
        description: 'Fundamental concept checks and standard questions.',
        badgeVariant: 'emerald',
      },
      {
        id: 'medium',
        label: 'Medium',
        description: 'Real-world problem solving and core technical depth.',
        badgeVariant: 'amber',
      },
      {
        id: 'hard',
        label: 'Hard',
        description: 'Complex architecture, edge cases, and high-pressure scenarios.',
        badgeVariant: 'rose',
      },
      {
        id: 'adaptive',
        label: 'Adaptive AI',
        description: 'Dynamically scales difficulty based on your real-time responses.',
        badgeVariant: 'purple',
      },
    ]
  }

  static getInterviewTypesList(): InterviewTypeOption[] {
    return [
      {
        id: 'technical',
        label: 'Technical',
        description: 'Coding algorithms, system architecture, framework internals.',
        iconName: 'Code2',
      },
      {
        id: 'hr',
        label: 'HR Round',
        description: 'Cultural fit, career aspirations, workplace scenarios.',
        iconName: 'UserCheck',
      },
      {
        id: 'behavioral',
        label: 'Behavioral',
        description: 'STAR method storytelling, leadership principles, team conflict.',
        iconName: 'MessageSquare',
      },
      {
        id: 'mixed',
        label: 'Mixed Comprehensive',
        description: 'Combination of technical questions and behavioral scenarios.',
        iconName: 'Layers',
      },
    ]
  }

  static getInterviewModesList(): InterviewModeOption[] {
    return [
      {
        id: 'voice',
        label: 'Voice Interactive',
        description: 'Spoken real-time AI conversation with voice feedback.',
        iconName: 'Mic',
      },
      {
        id: 'text',
        label: 'Text Prompt',
        description: 'Written Q&A interface for quick practice sessions.',
        iconName: 'FileText',
      },
      {
        id: 'mixed',
        label: 'Voice + Text Hybrid',
        description: 'Speak or type your responses as you prefer.',
        iconName: 'Sparkles',
      },
    ]
  }

  static getRecentMockInterviews(): MockInterviewHistoryItem[] {
    return [
      {
        id: 'mock-hist-1',
        date: 'May 20, 2026',
        company: 'Google',
        role: 'AI/ML Engineer',
        interviewType: 'Technical',
        durationMinutes: 45,
        scorePercent: 88,
        status: 'Completed',
      },
      {
        id: 'mock-hist-2',
        date: 'May 16, 2026',
        company: 'Meta',
        role: 'Senior Machine Learning Engineer',
        interviewType: 'System Design',
        durationMinutes: 60,
        scorePercent: 82,
        status: 'Completed',
      },
      {
        id: 'mock-hist-3',
        date: 'May 10, 2026',
        company: 'Amazon',
        role: 'Software Development Engineer',
        interviewType: 'Behavioral (STAR)',
        durationMinutes: 30,
        scorePercent: 79,
        status: 'Completed',
      },
      {
        id: 'mock-hist-4',
        date: 'May 04, 2026',
        company: 'Microsoft',
        role: 'Full Stack Engineer',
        interviewType: 'Mixed Technical',
        durationMinutes: 45,
        scorePercent: 91,
        status: 'Completed',
      },
    ]
  }

  /* Phase 4 — Question Bank Mock Data */

  static getQuestionCategories(): QuestionCategory[] {
    return [
      { id: 'all', label: 'All Categories', iconName: 'Layers', totalQuestions: 1250, completionPercent: 42 },
      { id: 'python', label: 'Python', iconName: 'Code2', totalQuestions: 240, completionPercent: 78 },
      { id: 'sql', label: 'SQL & Databases', iconName: 'Database', totalQuestions: 180, completionPercent: 65 },
      { id: 'ml', label: 'Machine Learning', iconName: 'Brain', totalQuestions: 310, completionPercent: 55 },
      { id: 'dl', label: 'Deep Learning', iconName: 'Cpu', totalQuestions: 190, completionPercent: 40 },
      { id: 'dsa', label: 'Data Structures & Algo', iconName: 'Boxes', totalQuestions: 210, completionPercent: 35 },
      { id: 'sys-design', label: 'System Design', iconName: 'Network', totalQuestions: 120, completionPercent: 28 },
      { id: 'behavioral', label: 'Behavioral & STAR', iconName: 'MessageSquare', totalQuestions: 90, completionPercent: 80 },
    ]
  }

  static getQuestionBankList(): QuestionBankItem[] {
    return [
      {
        id: 'q-1',
        title: 'Explain the Bias-Variance Tradeoff in Machine Learning models.',
        categoryId: 'ml',
        categoryLabel: 'Machine Learning',
        difficulty: 'Medium',
        questionType: 'Technical',
        experienceLevel: 'Mid',
        estimatedTimeMinutes: 5,
        companyTags: ['Google', 'Meta', 'Amazon'],
        roleTags: ['AI/ML Engineer', 'Data Scientist'],
        shortDescription: 'How do underfitting and overfitting relate to model complexity and generalization error on unseen test data?',
        hints: [
          'Decompose total expected error into Bias^2 + Variance + Irreducible Error.',
          'High bias leads to underfitting; high variance leads to overfitting.',
          'Discuss regularization methods (L1/L2, Dropout) as variance mitigations.',
        ],
        expectedDurationText: '3 - 5 Minutes',
        skillsTested: ['Machine Learning Theory', 'Model Evaluation', 'Overfitting Mitigation'],
        learningObjectives: [
          'Articulate model capacity versus generalization error.',
          'Demonstrate trade-offs using real-world ensemble methods (Random Forest vs Boosting).',
        ],
        isBookmarked: true,
        isCompleted: true,
      },
      {
        id: 'q-2',
        title: 'Design a scalable Distributed Vector Database for AI embeddings.',
        categoryId: 'sys-design',
        categoryLabel: 'System Design',
        difficulty: 'Hard',
        questionType: 'System Design',
        experienceLevel: 'Senior',
        estimatedTimeMinutes: 15,
        companyTags: ['OpenAI', 'Google', 'Microsoft'],
        roleTags: ['Senior AI Engineer', 'System Architect'],
        shortDescription: 'Propose an end-to-end architecture for low-latency HNSW vector index lookups supporting 1B+ high-dimensional embeddings.',
        hints: [
          'Discuss ANN algorithms (HNSW, IVF-PQ) and index memory constraints.',
          'Detail partition strategies (sharding by vector similarity vs hash sharding).',
          'Cover WAL persistence, caching layers, and horizontally scalable read nodes.',
        ],
        expectedDurationText: '10 - 15 Minutes',
        skillsTested: ['System Design', 'ANN Search', 'Vector DB Architecture'],
        learningObjectives: [
          'Design sub-10ms nearest neighbor search at scale.',
          'Evaluate memory vs recall tradeoffs in ANN indexes.',
        ],
        isBookmarked: false,
        isCompleted: false,
      },
      {
        id: 'q-3',
        title: 'How do Transformer Self-Attention mechanisms calculate Q, K, V matrices?',
        categoryId: 'dl',
        categoryLabel: 'Deep Learning',
        difficulty: 'Hard',
        questionType: 'Technical',
        experienceLevel: 'Mid',
        estimatedTimeMinutes: 8,
        companyTags: ['Meta', 'Anthropic', 'Google'],
        roleTags: ['LLM Engineer', 'Research Scientist'],
        shortDescription: 'Break down scaled dot-product attention equation: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V.',
        hints: [
          'Explain why scaling by sqrt(d_k) prevents vanishing gradients in softmax.',
          'Walk through Multi-Head Attention linear projections.',
          'Contrast auto-regressive causal masking versus bidirectional attention.',
        ],
        expectedDurationText: '5 - 8 Minutes',
        skillsTested: ['Transformer Architecture', 'Linear Algebra', 'PyTorch Tensor Operations'],
        learningObjectives: [
          'Derive self-attention complexity O(N^2 d).',
          'Explain positional encodings (RoPE vs Sinusoidal).',
        ],
        isBookmarked: true,
        isCompleted: false,
      },
      {
        id: 'q-4',
        title: 'Optimize a slow SQL query with multiple JOINs and GROUP BY aggregation.',
        categoryId: 'sql',
        categoryLabel: 'SQL & Databases',
        difficulty: 'Medium',
        questionType: 'Technical',
        experienceLevel: 'Mid',
        estimatedTimeMinutes: 6,
        companyTags: ['Amazon', 'Netflix'],
        roleTags: ['Data Engineer', 'Backend Engineer'],
        shortDescription: 'Analyze execution plans, composite indexes, CTEs, and window functions to reduce query latency from 12s to under 100ms.',
        hints: [
          'Check for missing composite indexes on JOIN and WHERE filtering keys.',
          'Avoid SELECT *; only project required columns.',
          'Use EXPLAIN ANALYZE to identify sequential table scans.',
        ],
        expectedDurationText: '4 - 6 Minutes',
        skillsTested: ['PostgreSQL / MySQL Tuning', 'Query Indexing', 'Database Optimization'],
        learningObjectives: [
          'Diagnose index scan versus sequential scan overhead.',
          'Rewrite subqueries into window functions.',
        ],
        isBookmarked: false,
        isCompleted: true,
      },
      {
        id: 'q-5',
        title: 'Tell me about a time you resolved a major technical conflict on your team.',
        categoryId: 'behavioral',
        categoryLabel: 'Behavioral & STAR',
        difficulty: 'Easy',
        questionType: 'Behavioral',
        experienceLevel: 'Junior',
        estimatedTimeMinutes: 5,
        companyTags: ['Microsoft', 'Google', 'Amazon'],
        roleTags: ['Software Engineer', 'Engineering Manager'],
        shortDescription: 'Use the STAR methodology to describe Situation, Task, Action, and measurable Result when aligning engineering trade-offs.',
        hints: [
          'Focus heavily on the Action step (what YOU specifically did).',
          'Highlight data-driven decision making and empathy.',
          'Quantify final business/team impact in the Result section.',
        ],
        expectedDurationText: '3 - 5 Minutes',
        skillsTested: ['STAR Storytelling', 'Conflict Resolution', 'Cross-Functional Alignment'],
        learningObjectives: [
          'Deliver concise 2-minute behavioral stories.',
          'Demonstrate ownership and psychological safety.',
        ],
        isBookmarked: false,
        isCompleted: true,
      },
      {
        id: 'q-6',
        title: 'Implement Python Generators and explain memory optimization advantages.',
        categoryId: 'python',
        categoryLabel: 'Python',
        difficulty: 'Medium',
        questionType: 'Coding',
        experienceLevel: 'Mid',
        estimatedTimeMinutes: 6,
        companyTags: ['Google', 'Meta'],
        roleTags: ['Python Backend Developer', 'Data Engineer'],
        shortDescription: 'Compare yield lazy evaluation vs returning full lists in memory when processing multi-gigabyte log streams.',
        hints: [
          'Generators maintain state via execution frame suspension.',
          'Use sys.getsizeof() to contrast list comprehension vs generator expressions.',
          'Discuss itertools pipeline chaining.',
        ],
        expectedDurationText: '4 - 6 Minutes',
        skillsTested: ['Python Memory Management', 'Generators & Iterators', 'Streaming Processing'],
        learningObjectives: [
          'Construct custom generator iterables in Python.',
          'Handle memory constraints in ETL data pipelines.',
        ],
        isBookmarked: true,
        isCompleted: false,
      },
    ]
  }

  static getPracticeSummary(): PracticeSummaryData {
    return {
      totalAvailable: 1250,
      totalCompleted: 524,
      totalBookmarked: 42,
      avgPracticeScore: 84,
      recommendedNextTopic: 'System Design & Scalability',
    }
  }

  static getRecentlyPracticedList(): RecentlyPracticedQuestionItem[] {
    return [
      {
        id: 'rp-1',
        questionTitle: 'Explain the Bias-Variance Tradeoff in Machine Learning models.',
        categoryLabel: 'Machine Learning',
        completionDate: 'Today, 2:30 PM',
        practiceScorePercent: 92,
      },
      {
        id: 'rp-2',
        questionTitle: 'Optimize a slow SQL query with multiple JOINs and GROUP BY aggregation.',
        categoryLabel: 'SQL & Databases',
        completionDate: 'Yesterday',
        practiceScorePercent: 88,
      },
      {
        id: 'rp-3',
        questionTitle: 'Tell me about a time you resolved a major technical conflict on your team.',
        categoryLabel: 'Behavioral & STAR',
        completionDate: '3 days ago',
        practiceScorePercent: 85,
      },
    ]
  }

  /* Phase 5 — My Answers & Feedback Mock Data */

  static getAnswerSummary(): AnswerSummaryData {
    return {
      totalAnswers: 38,
      avgScorePercent: 86,
      bestAnswerTitle: 'Explain the Bias-Variance Tradeoff in Machine Learning',
      needsImprovementCount: 4,
      feedbackGeneratedCount: 38,
      improvementTrend: '↑ 12% over last 10 attempts',
    }
  }

  static getAnswerHistoryList(): AnswerHistoryItem[] {
    return [
      {
        id: 'ans-1',
        questionTitle: 'Explain the Bias-Variance Tradeoff in Machine Learning models.',
        categoryLabel: 'Machine Learning',
        companyName: 'Google',
        attemptDate: 'May 20, 2026',
        scorePercent: 92,
        durationText: '4 min 12 sec',
        attemptNumber: 2,
        source: 'Mock Interview',
        difficulty: 'Medium',
        resultTag: 'Excellent',
        isBookmarked: true,
        isFavorite: true,
      },
      {
        id: 'ans-2',
        questionTitle: 'Design a scalable Distributed Vector Database for AI embeddings.',
        categoryLabel: 'System Design',
        companyName: 'OpenAI',
        attemptDate: 'May 18, 2026',
        scorePercent: 84,
        durationText: '11 min 45 sec',
        attemptNumber: 1,
        source: 'Mock Interview',
        difficulty: 'Hard',
        resultTag: 'Good',
        isBookmarked: false,
        isFavorite: false,
      },
      {
        id: 'ans-3',
        questionTitle: 'How do Transformer Self-Attention mechanisms calculate Q, K, V matrices?',
        categoryLabel: 'Deep Learning',
        companyName: 'Meta',
        attemptDate: 'May 15, 2026',
        scorePercent: 78,
        durationText: '6 min 30 sec',
        attemptNumber: 1,
        source: 'Question Bank',
        difficulty: 'Hard',
        resultTag: 'Good',
        isBookmarked: true,
        isFavorite: false,
      },
      {
        id: 'ans-4',
        questionTitle: 'Tell me about a time you resolved a major technical conflict on your team.',
        categoryLabel: 'Behavioral & STAR',
        companyName: 'Microsoft',
        attemptDate: 'May 12, 2026',
        scorePercent: 95,
        durationText: '3 min 50 sec',
        attemptNumber: 3,
        source: 'Mock Interview',
        difficulty: 'Easy',
        resultTag: 'Excellent',
        isBookmarked: false,
        isFavorite: true,
      },
      {
        id: 'ans-5',
        questionTitle: 'Optimize a slow SQL query with multiple JOINs and GROUP BY aggregation.',
        categoryLabel: 'SQL & Databases',
        companyName: 'Amazon',
        attemptDate: 'May 08, 2026',
        scorePercent: 68,
        durationText: '5 min 15 sec',
        attemptNumber: 1,
        source: 'Question Bank',
        difficulty: 'Medium',
        resultTag: 'Needs Improvement',
        isBookmarked: false,
        isFavorite: false,
      },
    ]
  }

  static getAnswerDetails(id?: string): AnswerDetailData {
    return {
      id: id || 'ans-1',
      questionTitle: 'Explain the Bias-Variance Tradeoff in Machine Learning models.',
      userAnswerText:
        'The Bias-Variance tradeoff represents the tension between a model being too simplistic (high bias, leading to underfitting) versus being overly complex (high variance, leading to overfitting). High bias occurs when the model fails to capture underlying patterns, resulting in systematic errors on both training and validation sets. High variance occurs when the model learns noise in the training data, performing exceptionally well on training but poorly on unseen test data. To optimize performance, we balance model capacity using regularization techniques like L1/L2 penalties, dropout in neural nets, or ensemble methods like Bagging (which reduces variance) and Boosting (which reduces bias).',
      expectedAnswerText:
        'A comprehensive answer should: 1) Mathematically decompose expected test error into Bias^2 + Variance + Irreducible Error. 2) Explain Bias as error from wrong model assumptions (underfitting) and Variance as sensitivity to small fluctuations in the training set (overfitting). 3) Contrast algorithms: Linear Regression/Naive Bayes have high bias, whereas deep decision trees and unregularized neural nets have high variance. 4) Detail mitigation techniques: Cross-validation, Regularization (L1/L2), Early Stopping, and Ensemble Methods (Random Forest reduces variance via bootstrap aggregating; Gradient Boosting iteratively reduces bias).',
      keySkillsTested: [
        'ML Theory & Generalization',
        'Overfitting & Underfitting Diagnosis',
        'Regularization & Ensembles',
      ],
      difficulty: 'Medium',
      durationText: '4 min 12 sec',
      interviewSource: 'AI/ML Mock Interview Round #2',
      attemptDate: 'May 20, 2026',
      statusBadge: 'Excellent Attempt',
      feedback: {
        overallRatingPercent: 92,
        strengths: [
          'Clear definition of bias (underfitting) vs variance (overfitting).',
          'Accurately highlighted ensemble methods (Bagging for variance, Boosting for bias).',
          'Articulate delivery with structured terminology.',
        ],
        areasToImprove: [
          'Explicitly mention the mathematical decomposition: Expected Error = Bias^2 + Variance + Irreducible Noise.',
          'Provide concrete code example or library reference (e.g. scikit-learn Ridge/Lasso hyperparameters).',
        ],
        communicationScore: 94,
        technicalAccuracyScore: 90,
        problemSolvingScore: 92,
        confidenceScore: 95,
        clarityScore: 93,
        starStructureScore: 88,
      },
    }
  }

  static getImprovementSuggestions(): ImprovementSuggestionData {
    return {
      recommendedPracticeTopic: 'System Design & Scalability',
      suggestedTopics: [
        'Distributed Caching & Redis',
        'Microservices API Gateways',
        'SQL Indexing & Query Tuning',
      ],
      recommendedInterviewRound: 'AI/ML System Design Mock',
      recommendedQuestionSet: 'Top 10 Google System Design Questions',
      estimatedImprovementTimeText: '25 Hours Recommended Practice',
      nextGoalText: 'Achieve 90%+ in System Design & Architecture rounds',
    }
  }

  static getRecentAttemptsList(): RecentAttemptItem[] {
    return [
      {
        id: 'ra-1',
        questionTitle: 'Explain the Bias-Variance Tradeoff in Machine Learning models.',
        scorePercent: 92,
        attemptDate: 'May 20, 2026',
        improvementPercent: 14,
      },
      {
        id: 'ra-2',
        questionTitle: 'Design a scalable Distributed Vector Database for AI embeddings.',
        scorePercent: 84,
        attemptDate: 'May 18, 2026',
        improvementPercent: 8,
      },
      {
        id: 'ra-3',
        questionTitle: 'Tell me about a time you resolved a major technical conflict on your team.',
        scorePercent: 95,
        attemptDate: 'May 12, 2026',
        improvementPercent: 18,
      },
    ]
  }

  /* Phase 6 — Performance & Analytics Mock Data */

  static getPerformanceAnalyticsData(): PerformanceWorkspaceData {
    return {
      summaryCards: [
        {
          id: 'overall_score',
          title: 'Overall Readiness Score',
          value: 87,
          unit: '/100',
          trendText: '↑ 5% vs last month',
          trendType: 'positive',
          iconName: 'Award',
          badgeText: 'Top 18%',
        },
        {
          id: 'interviews_completed',
          title: 'Interviews Completed',
          value: 12,
          unit: 'Rounds',
          trendText: '↑ 3 this week',
          trendType: 'positive',
          iconName: 'Video',
        },
        {
          id: 'practice_sessions',
          title: 'Practice Sessions',
          value: 38,
          unit: 'Questions',
          trendText: '↑ 8 this week',
          trendType: 'positive',
          iconName: 'BookOpen',
        },
        {
          id: 'avg_accuracy',
          title: 'Average Accuracy',
          value: '84%',
          unit: 'Across all rounds',
          trendText: '↑ 6% vs baseline',
          trendType: 'positive',
          iconName: 'Target',
        },
        {
          id: 'improvement_gain',
          title: 'Improvement Gain',
          value: '+14%',
          unit: 'Since start',
          trendText: 'Consistent growth',
          trendType: 'positive',
          iconName: 'TrendingUp',
        },
        {
          id: 'total_practice_time',
          title: 'Total Practice Time',
          value: '28.5',
          unit: 'Hours',
          trendText: 'Avg 4.5 hrs/week',
          trendType: 'neutral',
          iconName: 'Clock',
        },
      ],

      readinessGaugeScore: 87,
      readinessTag: 'Interview Ready',

      trendPoints: [
        { label: 'Week 1', score: 68, targetScore: 75, mockCount: 2 },
        { label: 'Week 2', score: 74, targetScore: 78, mockCount: 3 },
        { label: 'Week 3', score: 79, targetScore: 80, mockCount: 3 },
        { label: 'Week 4', score: 84, targetScore: 82, mockCount: 2 },
        { label: 'Week 5', score: 87, targetScore: 85, mockCount: 2 },
      ],

      skillBreakdown: [
        { skillName: 'Machine Learning Theory', scorePercent: 92, trendText: '↑ 4%', proficiencyBadge: 'Expert', category: 'Machine Learning' },
        { skillName: 'Python Programming', scorePercent: 88, trendText: '↑ 6%', proficiencyBadge: 'Advanced', category: 'Engineering' },
        { skillName: 'SQL & Database Optimization', scorePercent: 76, trendText: '↑ 8%', proficiencyBadge: 'Intermediate', category: 'Databases' },
        { skillName: 'System Design Architecture', scorePercent: 72, trendText: '↑ 12%', proficiencyBadge: 'Improving', category: 'Engineering' },
        { skillName: 'Deep Learning & Transformers', scorePercent: 61, trendText: '↑ 5%', proficiencyBadge: 'Improving', category: 'Machine Learning' },
        { skillName: 'Behavioral & STAR Communication', scorePercent: 94, trendText: '↑ 3%', proficiencyBadge: 'Expert', category: 'Soft Skills' },
      ],

      historyTrends: [
        { monthLabel: 'Jan 2026', attemptsCount: 4, avgDurationMin: 35, successPercent: 72 },
        { monthLabel: 'Feb 2026', attemptsCount: 6, avgDurationMin: 40, successPercent: 78 },
        { monthLabel: 'Mar 2026', attemptsCount: 8, avgDurationMin: 45, successPercent: 81 },
        { monthLabel: 'Apr 2026', attemptsCount: 10, avgDurationMin: 50, successPercent: 85 },
        { monthLabel: 'May 2026', attemptsCount: 12, avgDurationMin: 55, successPercent: 88 },
      ],

      strengthsWeaknesses: {
        strengths: [
          { title: 'STAR Storytelling', skill: 'Behavioral & HR', score: 94 },
          { title: 'Machine Learning Concepts', skill: 'ML Theory', score: 92 },
          { title: 'Python Standard Library', skill: 'Python', score: 88 },
        ],
        weaknesses: [
          { title: 'High-Scale System Architecture', skill: 'System Design', score: 72 },
          { title: 'ANN Vector Indexing', skill: 'Deep Learning', score: 61 },
          { title: 'Time Management in 60-min Roster', skill: 'Pacing', score: 65 },
        ],
      },

      timelineEvents: [
        {
          id: 'tl-1',
          date: 'May 20, 2026',
          type: 'Mock Interview',
          title: 'Completed Google AI/ML Mock Round #2',
          description: 'Achieved overall 88% score with strong STAR structure feedback.',
          badgeText: '88% Score',
        },
        {
          id: 'tl-2',
          date: 'May 16, 2026',
          type: 'Question Bank Milestone',
          title: 'Passed 500+ Question Bank Milestones',
          description: 'Completed 500th technical problem across Python, SQL, and System Design.',
          badgeText: '500+ Questions',
        },
        {
          id: 'tl-3',
          date: 'May 12, 2026',
          type: 'Streak Milestone',
          title: 'Hit 5-Day Active Practice Streak',
          description: 'Logged consecutive practice sessions for 5 days in a row.',
          badgeText: '🔥 5 Days Streak',
        },
        {
          id: 'tl-4',
          date: 'May 04, 2026',
          type: 'Score Achievement',
          title: 'Breakthrough 90%+ in Behavioral Round',
          description: 'Achieved highest STAR score rating (95%) in Leadership round.',
          badgeText: '95% Peak Score',
        },
      ],

      goalTracker: {
        currentGoalTitle: 'Target: Senior AI/ML Engineer at FAANG',
        progressPercent: 87,
        targetScorePercent: 90,
        estimatedCompletionDate: 'June 15, 2026',
        nextObjectiveTitle: 'Complete 5 System Design Mock Drills',
        dailyStreakDays: 5,
      },

      recommendationInsights: {
        recommendedSkills: ['System Design Sharding', 'Vector Index HNSW', 'Query Execution Plans'],
        suggestedInterviewType: 'AI/ML System Design Mock Round',
        suggestedPracticeTopics: ['System Design', 'Deep Learning'],
        weeklyFocusText: 'Focus heavily on distributed vector databases and query latency tuning.',
        estimatedReadinessGainText: '+5% Readiness Gain Expected',
      },

      performanceSidebar: {
        quickStats: [
          { label: 'Total Questions Practiced', value: '524' },
          { label: 'Avg Question Duration', value: '4.2 Min' },
          { label: 'Highest Round Score', value: '95%' },
          { label: 'Target Role Match', value: '92%' },
        ],
        weeklyHighlights: [
          'Increased System Design score by +12%',
          'Maintained a 5-day practice streak',
          'Completed 3 full-length mock interviews',
        ],
        bestPerformanceTitle: 'Behavioral Leadership Round',
        bestPerformanceScore: 95,
        areasRequiringAttention: [
          'Distributed System Design (72%)',
          'Deep Learning Transformer Math (61%)',
        ],
        achievementBadges: [
          { id: 'ach-1', title: 'STAR Method Specialist', iconName: 'Award', dateEarned: 'May 12, 2026' },
          { id: 'ach-2', title: 'Python Expert', iconName: 'Code2', dateEarned: 'May 08, 2026' },
          { id: 'ach-3', title: '5-Day Streak Master', iconName: 'Flame', dateEarned: 'May 12, 2026' },
        ],
      },
    }
  }

  /* Phase 7 — Interview Copilot Mock Data */

  static getCopilotWorkspaceData(): InterviewCopilotWorkspaceData {
    return {
      messages: [
        {
          id: 'msg-1',
          sender: 'assistant',
          text: 'Hello Dipak! I am your Scorelia Interview Copilot. I have analyzed your resume (AI/ML Engineer) and your target role at Google. How can I help you prepare today?',
          bulletPoints: [
            'Simulate an AI/ML technical interview question.',
            'Review and format a STAR behavioral story.',
            'Explain complex deep learning or system design concepts.',
            'Optimize Python or SQL code snippets for performance.',
          ],
          timestamp: '10:00 AM',
          avatarUrl: 'https://api.iconify.design/lucide:bot.svg',
        },
        {
          id: 'msg-2',
          sender: 'user',
          text: 'How do I answer "Explain the Bias-Variance Tradeoff" in a Google ML Engineer interview?',
          timestamp: '10:02 AM',
        },
        {
          id: 'msg-3',
          sender: 'assistant',
          text: 'Great technical question! In a Google interview, structure your answer into 3 key parts: Definition, Mathematical Error Decomposition, and Real-world Regularization / Mitigation.',
          bulletPoints: [
            'High Bias: Model makes overly simplistic assumptions (underfitting), causing systematic error on both training and test data.',
            'High Variance: Model is overly sensitive to small fluctuations in training data (overfitting), failing on unseen test data.',
            'Decomposition Equation: Expected Error = Bias^2 + Variance + Irreducible Error.',
            'Mitigations: Regularization (L1/L2), Bagging (reduces variance), Boosting (reduces bias), and Early Stopping.',
          ],
          codeSnippet: {
            language: 'python',
            code: `# Scikit-Learn Ridge (L2 Regularization) to mitigate high variance
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
# Alpha parameter controls bias-variance tradeoff capacity
model = Ridge(alpha=1.0)
model.fit(X_train, y_train)
print("Test Score:", model.score(X_test, y_test))`,
          },
          timestamp: '10:03 AM',
          avatarUrl: 'https://api.iconify.design/lucide:bot.svg',
        },
      ],

      suggestedPrompts: [
        { id: 'sp-1', label: 'Explain Bias-Variance Tradeoff', promptText: 'Explain the Bias-Variance Tradeoff with mathematical decomposition and code.', category: 'Technical' },
        { id: 'sp-2', label: 'Improve my STAR Answer', promptText: 'How do I structure my answer using the STAR method for a conflict resolution story?', category: 'Behavioral' },
        { id: 'sp-3', label: 'Vector Database System Design', promptText: 'Explain HNSW vector indexing architecture for sub-10ms embedding search.', category: 'System Design' },
        { id: 'sp-4', label: 'Optimize Python Generator Code', promptText: 'Show me Python generator lazy evaluation example for multi-gigabyte log streaming.', category: 'Coding' },
      ],

      resumeContext: {
        fileName: 'AI_ML_Engineer_Resume_2026.pdf',
        roleTarget: 'AI/ML Engineer',
        skillsDetected: ['Python', 'PyTorch', 'Scikit-Learn', 'SQL', 'FastAPI', 'System Design'],
        experienceYears: 4,
        topProjects: ['Real-time Vector Search DB', 'LLM RAG Copilot Engine', 'Automated ML Pipeline'],
      },

      jobContext: {
        targetCompany: 'Google',
        roleTitle: 'Senior Machine Learning Engineer',
        requiredSkills: ['Machine Learning', 'Python', 'Distributed Systems', 'TensorFlow/PyTorch'],
        interviewType: 'Technical & System Design',
        difficultyLevel: 'Hard',
      },

      starCoach: {
        situation: 'Describe the context, problem, or challenge you faced.',
        task: 'Define your specific responsibility or goal.',
        action: 'Detail the concrete steps YOU took to solve the challenge.',
        result: 'Quantify the outcome and business impact achieved.',
        checklist: [
          { item: 'Situation: Clear background context set', completed: true },
          { item: 'Task: Specific role and objective defined', completed: true },
          { item: 'Action: Detailed individual contribution highlighted', completed: true },
          { item: 'Result: Quantifiable metrics provided (+25% throughput)', completed: true },
        ],
        starScorePercent: 92,
        suggestions: [
          'Use active first-person verbs ("I engineered", "I architected").',
          'Keep Situation & Task under 30% of total response duration.',
          'Quantify the business impact in the Result section.',
        ],
      },

      codingAssistant: {
        language: 'Python 3.11',
        difficulty: 'Medium / Hard',
        practiceTopics: ['Generators & Iterators', 'PyTorch Tensor Manipulation', 'Binary Search & Graphs'],
        timeComplexityTip: 'Aim for O(N log N) or O(N) time complexity.',
        spaceComplexityTip: 'Minimize auxiliary memory allocations using generators or in-place transformations.',
        bestPractices: [
          'Write type hints (typing module) for method signatures.',
          'Handle boundary edge cases (empty arrays, null pointers).',
          'Include concise docstrings explaining time/space complexities.',
        ],
      },

      sidebarData: {
        quickStats: [
          { label: 'Active Context', value: 'Google AI/ML' },
          { label: 'Prompts Used Today', value: '14' },
          { label: 'STAR Coach Rating', value: '92%' },
          { label: 'Copilot Response Time', value: '< 1s' },
        ],
        recentConversations: [
          { id: 'conv-1', title: 'Google Bias-Variance Q&A', date: 'Today, 10:00 AM' },
          { id: 'conv-2', title: 'System Design HNSW Vector Index', date: 'Yesterday' },
          { id: 'conv-3', title: 'STAR Method Behavioral Prep', date: 'May 18, 2026' },
        ],
        todayGoalText: 'Practice 3 STAR answers & 2 technical explanations.',
        streakDays: 5,
        aiSuggestions: [
          'Ask Copilot to review a custom behavioral story',
          'Practice system design trade-off questions',
          'Generate Python code optimization drills',
        ],
        pinnedTopics: ['Transformer Self-Attention', 'Distributed Vector DB', 'Bias-Variance Tradeoff'],
      },
    }
  }
}
export default InterviewPrepMockData
