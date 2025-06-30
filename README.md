# Commercial Insurance Submission Platform

A comprehensive two-sided portal system for streamlining commercial insurance submissions between producers (agents/brokers) and SMB clients, powered by AI automation.

## 🚀 Features

### Producer Portal
- **AI-Powered Prospect Creation** - Extract business information automatically from websites
- **Interactive Progress Tracking** - Visual timeline with clickable stage management
- **Smart Form Generation** - AI-generated forms with auto-population from documents
- **Carrier Matching & Submission** - AI-powered carrier recommendations with automated email templates
- **Quote Comparison** - Side-by-side analysis with AI recommendations
- **Document Management** - OCR processing with intelligent data extraction
- **Workflow Automation** - Configurable rules for emails, tasks, and notifications

### Client Portal
- **Streamlined Onboarding** - Electronic signature for Letter of Authority
- **Smart Document Upload** - Drag-and-drop with AI processing
- **Dynamic Forms** - Multi-input support (text, voice, photo)
- **Real-time Progress** - Visual tracking of application status
- **Quote Review** - Interactive comparison with AI insights
- **Policy Acceptance** - Electronic binding with DocuSign integration

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/insurance.git
cd insurance
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/
│   ├── Common/          # Shared components
│   ├── Producer/        # Producer portal components
│   ├── Client/          # Client portal components
│   └── Layout/          # Layout components
├── data/               # Mock data and constants
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── database/           # Database schema documentation
```

## 🎯 Key Components

### Producer Portal
- **TodayView** - Dashboard with daily tasks and metrics
- **ProspectList** - Interactive prospect management with timeline
- **ProspectDetail** - Comprehensive prospect management interface
- **NewProspect** - AI-powered prospect creation
- **Analytics** - Performance metrics and insights
- **Settings** - Carrier profiles, document templates, automations

### Client Portal
- **Dashboard** - Progress overview with quote recommendations
- **SmartForm** - Multi-step form with voice and photo input
- **DocumentUpload** - Intelligent document processing
- **PolicyAcceptance** - Quote review and binding interface

## 🤖 AI Features

- **Business Information Extraction** - Automatically extract company details from websites
- **Document OCR Processing** - Extract data from uploaded documents
- **Form Auto-Population** - Pre-fill forms with extracted data
- **Carrier Matching** - AI-powered carrier recommendations based on risk profile
- **Email Template Generation** - Professional submission emails
- **Quote Analysis** - AI scoring and recommendations

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

The platform uses a comprehensive design system with:
- **Color System**: 6 color ramps (primary, secondary, accent, success, warning, error)
- **Typography**: 3 font weights maximum with proper line spacing
- **Spacing**: Consistent 8px spacing system
- **Components**: Reusable components with hover states and micro-interactions

## 📊 Database Schema

The platform includes a complete PostgreSQL schema supporting:
- User management (producers and SMB clients)
- Prospect lifecycle management
- Document storage and OCR data
- Form submissions and versioning
- Carrier relationships and quotes
- Activity logging and integrations

See `src/database/schema.json` for complete schema documentation.

## 🚀 Deployment

The project is configured for easy deployment to:
- Netlify (includes `_redirects` file)
- Vercel
- Any static hosting provider

## 📝 API Documentation

The platform includes comprehensive API route documentation in `src/api/routes.json` covering:
- Authentication and user management
- Prospect CRUD operations
- Document upload and processing
- Form submissions
- Carrier matching and submissions
- Quote management
- Activity logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@insuranceplatform.com
- Documentation: [Link to docs]

## 🗺 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Third-party integrations (Applied Epic, etc.)
- [ ] Machine learning enhancements
- [ ] Multi-language support

---

Built with ❤️ for the insurance industry