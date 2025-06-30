# Comprehensive Guide: Managing Carrier and Document Template Settings

## Table of Contents
1. [Overview](#overview)
2. [Accessing Settings](#accessing-settings)
3. [Carrier Profile Management](#carrier-profile-management)
4. [Document Template Management](#document-template-management)
5. [Workflow Automations](#workflow-automations)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

The InsureTech platform provides comprehensive settings management for carriers, document templates, and workflow automations. This guide covers how to effectively configure and manage these critical components of your insurance submission workflow.

### Key Features
- **Carrier Profile Management**: Configure carrier relationships, appetite criteria, and performance tracking
- **Document Template Management**: Manage ACORD forms, supplemental documents, and custom templates
- **Workflow Automations**: Set up automated triggers and actions for streamlined processes
- **Performance Analytics**: Track carrier performance and document usage metrics

## Accessing Settings

### Navigation
1. Log into the Producer Portal
2. Click on **Settings** in the left sidebar
3. Select the appropriate tab:
   - **Carriers** for carrier profile management
   - **Documents** for template management
   - **Automations** for workflow configuration

### User Permissions
- **Admin Users**: Full access to all settings
- **Producer Users**: Read/write access to carrier and document settings
- **Support Users**: Read-only access for troubleshooting

## Carrier Profile Management

### Adding a New Carrier

#### Step 1: Basic Information
1. Click **Add Carrier** button
2. Fill in required fields:
   - **Carrier Name**: Full legal name (e.g., "Liberty Mutual Insurance Company")
   - **Carrier Code**: Short identifier (e.g., "LM")
   - **A.M. Best Rating**: Financial strength rating
   - **Status**: Active, Inactive, or Pending

#### Step 2: Contact Information
Configure primary contacts for submissions:
- **Primary Contact Name**: Underwriter or submission coordinator
- **Email Address**: Primary submission email
- **Phone Number**: Direct contact number
- **Underwriting Email**: Dedicated underwriting inbox

#### Step 3: Appetite Configuration
Define the carrier's risk appetite:

**Geographic Coverage**
- Select states where carrier writes business
- Note any regional restrictions or preferences

**Industry Preferences**
- NAICS codes the carrier targets
- Industries they avoid or require special consideration

**Revenue Ranges**
- Minimum premium requirements
- Maximum policy limits
- Sweet spot revenue ranges

**Risk Tolerance**
- Conservative: Strict underwriting, established businesses only
- Moderate: Balanced approach, some flexibility
- Aggressive: Willing to take higher risks for appropriate pricing

#### Step 4: Coverage Lines
Select available coverage types:
- General Liability
- Professional Liability
- Cyber Liability
- Commercial Property
- Workers Compensation
- Commercial Auto
- Directors & Officers
- Employment Practices Liability

#### Step 5: Submission Requirements
Configure required documents and forms:
- ACORD forms (125, 126, 140, etc.)
- Supplemental questionnaires
- Financial statements
- Loss run requirements
- Additional documentation needs

### Carrier Performance Tracking

The system automatically tracks key performance metrics:

**Quote Metrics**
- Quote rate percentage
- Average response time
- Quote accuracy score

**Binding Metrics**
- Bind rate percentage
- Time from quote to bind
- Policy retention rates

**Service Metrics**
- Claims handling rating
- Customer service scores
- Producer satisfaction ratings

### Managing Carrier Relationships

#### Updating Carrier Information
1. Navigate to the carrier profile
2. Click **Edit** button
3. Modify necessary fields
4. Click **Save Changes**

#### Deactivating Carriers
1. Open carrier profile
2. Change status to "Inactive"
3. Set effective date for deactivation
4. Add notes explaining reason for deactivation

#### Carrier Notes and Special Instructions
Use the notes section to document:
- Special submission requirements
- Preferred communication methods
- Underwriter preferences
- Historical performance notes

## Document Template Management

### Template Categories

**ACORD Forms**
- Standardized industry forms
- Version controlled and updated automatically
- Pre-populated with client data where possible

**Supplemental Questionnaires**
- Industry-specific questionnaires
- Custom forms for specialized coverage
- Carrier-specific requirements

**Carrier-Specific Forms**
- Proprietary carrier applications
- Custom submission requirements
- Specialized coverage forms

**Endorsements and Amendments**
- Policy modification forms
- Coverage enhancement documents
- Exclusion and limitation forms

### Adding New Document Templates

#### Step 1: Template Information
1. Click **Add Template** button
2. Enter template details:
   - **Template Name**: Descriptive name
   - **Form Number**: Official form identifier (e.g., "ACORD 125")
   - **Version**: Current version number
   - **Category**: Select appropriate category

#### Step 2: Configuration
Set up template parameters:
- **Line of Business**: Applicable coverage types
- **Industry Types**: Relevant NAICS codes
- **Associated Carriers**: Which carriers accept this form
- **Auto-Populate**: Enable automatic data filling

#### Step 3: Field Mapping
Configure data mapping for auto-population:
- Map prospect data fields to form fields
- Set up conditional logic for dynamic forms
- Configure validation rules

#### Step 4: Presentation Order
Set the order in which forms appear:
- Primary application forms first
- Supplemental questionnaires second
- Carrier-specific forms last
- Supporting documents as needed

### Template Versioning

**Version Control**
- Automatic version tracking
- Change history maintenance
- Rollback capabilities

**Update Management**
- Notification of new ACORD versions
- Automatic template updates
- Legacy version support

### Document Template Best Practices

**Organization**
- Use consistent naming conventions
- Group related templates together
- Maintain clear version control

**Data Mapping**
- Map all available prospect data
- Use conditional logic to reduce client burden
- Validate data accuracy before submission

**Carrier Alignment**
- Ensure templates match carrier requirements
- Update templates when carrier requirements change
- Maintain carrier-specific versions when necessary

## Workflow Automations

### Automation Types

**Stage-Based Triggers**
- Prospect moves between stages
- Automatic actions based on progress
- Conditional logic for different scenarios

**Time-Based Triggers**
- Scheduled actions and reminders
- Follow-up sequences
- Deadline monitoring

**Document-Based Triggers**
- Actions triggered by document uploads
- OCR completion notifications
- Missing document reminders

**Carrier Response Triggers**
- Quote received notifications
- Submission acknowledgments
- Request for additional information

### Creating Automation Rules

#### Step 1: Define Trigger
1. Click **Create Rule** button
2. Select trigger type:
   - Stage Change
   - Time-Based
   - Document Upload
   - Form Completion
   - Carrier Response

#### Step 2: Set Conditions
Configure when the rule should fire:
- Specific stage transitions
- Time delays or schedules
- Document types or statuses
- Form completion criteria

#### Step 3: Define Actions
Set up automated responses:
- Send email notifications
- Create tasks for team members
- Update prospect status
- Generate documents
- Notify external systems

#### Step 4: Test and Activate
- Test the automation with sample data
- Verify all conditions work correctly
- Activate the rule for production use

### Common Automation Examples

**Welcome Sequence**
- Trigger: New prospect created
- Actions: Send welcome email, create initial tasks, schedule follow-up

**Document Reminder**
- Trigger: 3 days in docs stage without uploads
- Actions: Send reminder email, create follow-up task

**Quote Notification**
- Trigger: Quote received from carrier
- Actions: Notify producer, email client, update status

**Binding Confirmation**
- Trigger: Policy bound
- Actions: Generate certificate, send welcome package, schedule renewal reminder

### Automation Performance Monitoring

**Trigger Metrics**
- Number of times triggered
- Success/failure rates
- Average execution time

**Effectiveness Tracking**
- Response rates to automated emails
- Task completion rates
- Process efficiency improvements

## Best Practices

### Carrier Management

**Regular Reviews**
- Quarterly appetite reviews
- Annual performance assessments
- Ongoing relationship management

**Data Accuracy**
- Keep contact information current
- Update appetite criteria regularly
- Maintain accurate performance metrics

**Communication**
- Regular check-ins with carrier contacts
- Feedback on submission quality
- Market updates and changes

### Document Template Management

**Version Control**
- Regular template updates
- Version change documentation
- Legacy support planning

**Quality Assurance**
- Regular template testing
- Data mapping validation
- User feedback incorporation

**Efficiency Optimization**
- Minimize client data entry
- Maximize auto-population
- Streamline approval processes

### Workflow Automation

**Start Simple**
- Begin with basic automations
- Add complexity gradually
- Monitor performance closely

**Regular Maintenance**
- Review automation performance monthly
- Update rules as processes change
- Remove outdated automations

**User Training**
- Train team on automation capabilities
- Document automation workflows
- Provide troubleshooting guides

## Troubleshooting

### Common Issues

**Carrier Configuration Problems**
- **Issue**: Submissions not routing correctly
- **Solution**: Verify appetite criteria and contact information
- **Prevention**: Regular carrier data audits

**Document Template Errors**
- **Issue**: Auto-population not working
- **Solution**: Check field mapping configuration
- **Prevention**: Test templates after any changes

**Automation Failures**
- **Issue**: Rules not triggering as expected
- **Solution**: Review trigger conditions and test scenarios
- **Prevention**: Regular automation testing

### Performance Issues

**Slow Template Loading**
- Check template file sizes
- Optimize image and document assets
- Review server performance

**Automation Delays**
- Monitor system load during peak times
- Review automation complexity
- Consider staggering automated actions

### Data Integrity

**Carrier Data Accuracy**
- Regular data validation checks
- Cross-reference with carrier websites
- Maintain change logs

**Template Synchronization**
- Ensure all templates are current
- Verify ACORD form versions
- Check carrier-specific requirements

## Support and Resources

### Getting Help
- **Technical Support**: Available 24/7 for system issues
- **Training Resources**: Video tutorials and documentation
- **User Community**: Forums and best practice sharing

### Additional Resources
- ACORD standards documentation
- Carrier appetite guides
- Industry best practices
- Regulatory compliance updates

### Contact Information
- **Support Email**: support@insuretech.com
- **Training Team**: training@insuretech.com
- **Account Management**: success@insuretech.com

---

*This guide is updated regularly to reflect system enhancements and industry changes. Last updated: January 2024*