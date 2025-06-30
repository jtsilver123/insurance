# Contributing to Commercial Insurance Platform

Thank you for your interest in contributing to the Commercial Insurance Platform! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Development Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/insurance.git
   cd insurance
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the established file organization (max 300 lines per file)
- Use Tailwind CSS for styling
- Include proper error handling

### File Organization
- Each file should focus on exactly ONE component or functionality
- Aim for files around 200 lines
- Use proper imports/exports between files
- Create dedicated directories for related components

## 🎨 Design Standards

### UI/UX Guidelines
- Follow the established design system
- Maintain consistent spacing (8px system)
- Use the defined color palette
- Implement responsive design for all screen sizes
- Add hover states and micro-interactions
- Ensure accessibility compliance

### Design Principles
- Apple-level design aesthetics
- Clean, sophisticated visual presentation
- Intuitive user experience
- Proper visual hierarchy
- Meaningful animations and transitions

## 🧪 Testing

### Before Submitting
- Test your changes across different screen sizes
- Verify all interactive elements work properly
- Check for console errors
- Test with different data scenarios
- Ensure proper loading states

### Manual Testing Checklist
- [ ] Component renders correctly
- [ ] All interactive elements respond properly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Proper loading and error states
- [ ] Accessibility features work

## 📝 Pull Request Process

### Before Creating a PR
1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes following the guidelines above
3. Test thoroughly
4. Commit with descriptive messages:
   ```bash
   git commit -m "feat: add carrier matching algorithm"
   ```

### PR Requirements
- Clear, descriptive title
- Detailed description of changes
- Screenshots for UI changes
- Reference any related issues
- Ensure all checks pass

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Screenshots
(If applicable)

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested edge cases
- [ ] No console errors

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
```

## 🐛 Bug Reports

### Before Reporting
- Check if the issue already exists
- Try to reproduce the bug consistently
- Test in different browsers/devices

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 91]
- Device: [e.g., iPhone 12]
- OS: [e.g., iOS 14.6]

## Screenshots
(If applicable)
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 🏗 Architecture Guidelines

### Component Structure
```
src/components/
├── Common/          # Shared components
├── Producer/        # Producer-specific components
├── Client/          # Client-specific components
└── Layout/          # Layout components
```

### State Management
- Use React hooks for local state
- Implement proper prop drilling prevention
- Use context for shared state when appropriate

### API Integration
- Follow the established API patterns
- Implement proper error handling
- Use TypeScript interfaces for API responses

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples for reusable components

### README Updates
- Update README.md for new features
- Include setup instructions for new dependencies
- Add screenshots for UI changes

## 🔒 Security Guidelines

- Never commit sensitive information
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices for authentication

## 📞 Getting Help

### Resources
- Check existing documentation
- Review similar implementations in the codebase
- Ask questions in GitHub issues

### Contact
- Create an issue for bugs or feature requests
- Use discussions for general questions
- Email: dev@insuranceplatform.com

## 🎯 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` types
- Use proper generic types

### React
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Follow React best practices

### CSS/Styling
- Use Tailwind CSS classes
- Follow the established design system
- Implement responsive design
- Use CSS custom properties for dynamic values

## 🚀 Release Process

### Version Management
- Follow semantic versioning (SemVer)
- Update CHANGELOG.md for releases
- Tag releases appropriately

### Deployment
- Test in staging environment
- Verify all features work in production build
- Monitor for issues after deployment

Thank you for contributing to the Commercial Insurance Platform! Your contributions help make insurance technology more accessible and efficient for everyone.