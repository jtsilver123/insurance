import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Building, 
  FileText, 
  HelpCircle,
  Mail,
  Phone,
  Shield,
  DollarSign,
  Clock,
  Star,
  Zap,
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Target,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  MessageCircle,
  Search,
  Filter,
  Plus
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: string;
  helpful?: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  category: string;
  prompt: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI assistant for insurance communications. I can help you draft messages to underwriters, clients, carriers, or answer insurance questions. What would you like help with today?",
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Generate Submission Package',
      description: 'Create complete carrier submission with ACORD forms and documents',
      icon: FileText,
      color: 'blue',
      category: 'submission',
      prompt: 'Generate a complete submission package for'
    },
    {
      id: '2',
      title: 'Analyze & Compare Quotes',
      description: 'AI-powered quote analysis with recommendations and comparisons',
      icon: Target,
      color: 'green',
      category: 'quotes',
      prompt: 'Analyze and compare these quotes for'
    },
    {
      id: '3',
      title: 'Find Matching Carriers',
      description: 'AI carrier matching based on risk profile and appetite',
      icon: Search,
      color: 'purple',
      category: 'carrier',
      prompt: 'Find carriers that match this risk profile:'
    },
    {
      id: '4',
      title: 'Draft Client Proposal',
      description: 'Create professional client proposals with coverage recommendations',
      icon: Users,
      color: 'orange',
      category: 'proposal',
      prompt: 'Create a client proposal for'
    },
    {
      id: '5',
      title: 'Process Renewal Strategy',
      description: 'Automated renewal analysis with market comparison and strategy',
      icon: RotateCcw,
      color: 'indigo',
      category: 'renewal',
      prompt: 'Analyze renewal strategy for'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Actions', count: quickActions.length },
    { id: 'submission', label: 'Submissions', count: 1 },
    { id: 'quotes', label: 'Quote Analysis', count: 1 },
    { id: 'carrier', label: 'Carrier Matching', count: 1 },
    { id: 'proposal', label: 'Client Proposals', count: 1 },
    { id: 'renewal', label: 'Renewals', count: 1 }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('submission') || lowerInput.includes('generate')) {
      return `🚀 **AI Submission Package Generator**

I'll help you create a complete submission package. Here's what I can generate:

**📋 Required Documents:**
- ACORD 125 (General Liability Application)
- ACORD 126 (Commercial Property Application) 
- ACORD 140 (Property Section)
- Supplemental questionnaires based on industry
- Loss run summary and analysis

**🎯 Carrier Selection:**
- AI-matched carriers based on risk profile
- Appetite scoring for each carrier
- Submission priority ranking

**📧 Automated Distribution:**
- Personalized cover letters for each carrier
- Submission tracking setup
- Follow-up schedule creation

**To get started, please provide:**
1. Business name and industry (NAICS code)
2. Coverage types needed
3. Revenue and employee count
4. Any specific carrier preferences

I'll generate the complete package in under 2 minutes!`;
    }
    
    if (lowerInput.includes('quote') || lowerInput.includes('analyze') || lowerInput.includes('compare')) {
      return `📊 **AI Quote Analysis Engine**

I'll analyze your quotes with advanced AI to provide data-driven recommendations:

**🔍 Comprehensive Analysis:**
- Coverage gap identification
- Premium competitiveness scoring
- Carrier financial strength comparison
- Terms and conditions analysis
- Hidden exclusions detection

**🏆 AI Recommendations:**
- Best value determination
- Risk-adjusted scoring
- Client suitability matching
- Negotiation opportunities

**📈 Market Intelligence:**
- Industry benchmark comparison
- Pricing trend analysis
- Carrier performance metrics

**📋 Client Presentation:**
- Professional comparison charts
- Executive summary generation
- Recommendation rationale

**To analyze your quotes, please provide:**
1. Quote documents or key details
2. Client's risk tolerance
3. Budget parameters
4. Coverage priorities

I'll deliver a complete analysis with recommendations!`;
    }
    
    if (lowerInput.includes('carrier') || lowerInput.includes('match') || lowerInput.includes('find')) {
      return `🎯 **AI Carrier Matching System**

I'll find the perfect carriers for your risk using advanced appetite matching:

**🧠 Smart Matching Criteria:**
- NAICS code appetite analysis
- Revenue range compatibility
- Geographic territory coverage
- Risk tolerance alignment
- Historical performance data

**📊 Carrier Scoring:**
- Appetite match percentage
- Quote probability rating
- Competitive pricing likelihood
- Service quality metrics
- Claims handling reputation

**🚀 Automated Outreach:**
- Personalized submission packages
- Carrier-specific presentations
- Relationship-based introductions
- Follow-up scheduling

**📈 Success Optimization:**
- Best submission timing
- Underwriter preferences
- Market conditions analysis

**To find matching carriers, provide:**
1. Business details (industry, size, location)
2. Coverage requirements
3. Risk characteristics
4. Budget expectations
5. Timeline requirements

I'll identify the top 5 carriers with highest success probability!`;
    }

    if (lowerInput.includes('proposal') || lowerInput.includes('client')) {
      return `📝 **AI Client Proposal Generator**

I'll create a professional, compelling proposal that wins business:

**🎨 Professional Presentation:**
- Executive summary with key benefits
- Coverage recommendations with rationale
- Risk assessment and mitigation strategies
- Implementation timeline
- Investment summary with ROI analysis

**🔧 Customization Features:**
- Industry-specific language
- Client's business model integration
- Competitive advantage highlighting
- Visual charts and comparisons

**💼 Business Impact:**
- Cost-benefit analysis
- Risk transfer explanation
- Compliance requirements coverage
- Growth protection strategies

**📋 Next Steps Section:**
- Clear action items
- Decision timeline
- Contact information
- Implementation support

**To create your proposal, provide:**
1. Client business overview
2. Current insurance situation
3. Identified risks and concerns
4. Recommended coverage solutions
5. Pricing information

I'll generate a winning proposal that positions you as the trusted advisor!`;
    }

    if (lowerInput.includes('renewal') || lowerInput.includes('strategy')) {
      return `🔄 **AI Renewal Strategy Engine**

I'll develop a comprehensive renewal strategy to maximize retention and profitability:

**📊 Market Analysis:**
- Current vs. market pricing comparison
- Competitive landscape assessment
- Industry trend analysis
- Rate change predictions

**🎯 Strategy Development:**
- Retention probability scoring
- Pricing optimization recommendations
- Coverage enhancement opportunities
- Risk improvement suggestions

**📈 Value Demonstration:**
- Claims savings analysis
- Service value quantification
- Risk management ROI
- Relationship benefits summary

**🚀 Execution Plan:**
- Renewal timeline optimization
- Client communication strategy
- Market testing approach
- Negotiation tactics

**📋 Renewal Package:**
- Executive renewal summary
- Market comparison report
- Recommendation presentation
- Implementation roadmap

**To develop your renewal strategy, provide:**
1. Current policy details
2. Claims history
3. Client satisfaction metrics
4. Market conditions
5. Relationship strength

I'll create a data-driven renewal strategy that maximizes success!`;
    }
    
    return `🤖 **AI Producer Assistant Ready!**

I'm here to help you work more efficiently with AI-powered tools. I can help you:

**🚀 Top Producer Actions:**
• **Generate Submission Packages** - Complete ACORD forms and carrier packages
• **Analyze & Compare Quotes** - AI-powered recommendations and insights  
• **Find Matching Carriers** - Smart appetite matching and success scoring
• **Draft Client Proposals** - Professional presentations that win business
• **Process Renewal Strategy** - Data-driven retention and growth plans

**💡 How to get started:**
1. Click any quick action above for instant help
2. Describe what you need: "Generate submission for tech company"
3. Provide key details when prompted
4. Get AI-generated results in minutes

**🎯 Pro Tips:**
• Be specific about business details for better results
• Include NAICS codes and revenue when available
• Mention any special requirements or preferences

What would you like to accomplish today?`;
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputMessage(action.prompt + ' ');
    // Focus on input after a brief delay
    setTimeout(() => {
      const input = document.getElementById('message-input');
      if (input) input.focus();
    }, 100);
  };

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Communication Assistant
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Get help writing professional messages and understanding insurance concepts
              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
                <p className="text-gray-600 text-sm">AI-powered producer tools</p>
              </div>

              {/* Category Filter */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {filteredActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group hover:shadow-md"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                          <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors mt-1">
                            {action.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-yellow-600 font-medium">AI-Powered</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-[700px] flex flex-col">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">AI Assistant</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-blue-700">Online and ready to help</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                      <div className={`flex items-center space-x-2 mt-2 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'ai' && (
                          <div className="flex items-center space-x-1">
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <Copy className="h-3 w-3 text-gray-400" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <ThumbsUp className="h-3 w-3 text-gray-400" />
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                              <ThumbsDown className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-gray-100 flex-shrink-0">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      id="message-input"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message or question here... (Press Enter to send)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Be specific about business details for better AI results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;