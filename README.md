# 📋 Eqorascale MVP - Enterprise Supply Chain Document Management

<div align="center">
<img src="https://i.ibb.co/3mCsdXcQ/image.png" alt="image" border="0" /></a>
</div>

## 🚀 Overview

**Eqorascale MVP** is an enterprise-grade supply chain document management system designed to revolutionize how organizations handle critical procurement documents. Built with modern web technologies, this platform provides advanced file indexing, AI-powered document processing, and integrated tracking for RFQs (Request for Quotations), POs (Purchase Orders), and Quotations.

Whether you're managing complex supply chains or streamlining procurement workflows, Eqorascale delivers intelligent document processing capabilities powered by Google's Gemini AI to extract, organize, and analyze procurement data with unprecedented efficiency.

## ✨ Key Features

### 📁 Advanced File Management
- **Hierarchical File Organization**: Intuitive folder structure with support for nested directories
- **Multi-format Support**: Handle PDFs, images, and various document types seamlessly
- **Real-time File Explorer**: Browse and navigate your document library with instant search capabilities
- **Drag-and-drop Interface**: Intuitive file management with context menus for quick actions
- **File Versioning**: Track document changes and maintain historical records

### 🤖 AI-Powered Document Processing
- **Gemini AI Integration**: Leverage Google's advanced AI models for intelligent document analysis
- **Automatic Data Extraction**: Extract key information from procurement documents automatically
- **Smart Document Classification**: Categorize documents by type (RFQ, PO, Quotation, Invoice, etc.)
- **OCR & Text Recognition**: Process both digital and scanned documents with high accuracy
- **Intelligent Search**: Find documents quickly using AI-powered semantic search

### 📊 Supply Chain Tracking
- **RFQ Management**: Create, track, and manage Request for Quotations throughout their lifecycle
- **Purchase Order Tracking**: Monitor POs from creation through delivery and payment
- **Quotation Analysis**: Compare supplier quotations and track acceptance/rejection status
- **Dashboard Analytics**: Visualize key metrics and supply chain performance indicators
- **Real-time Status Updates**: Stay informed with instant document processing notifications

### 🔐 Security & Authentication
- **Secure Authentication**: User login with session persistence
- **Role-based Access**: Different user roles with appropriate permissions
- **Data Privacy**: Secure API key management and encrypted data storage
- **Local Session Storage**: User data stored securely in browser localStorage

### 🎨 User Experience
- **Dark Mode Support**: Toggle between light and dark themes for comfortable viewing
- **Responsive Design**: Fully responsive interface that works on desktop and tablet devices
- **Toast Notifications**: Real-time user feedback for actions and errors
- **Confirmation Modals**: Safe operations with confirmation dialogs for destructive actions
- **PDF Viewer**: Built-in PDF preview and viewing capabilities
- **Table View**: Structured data presentation with sortable columns

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with latest features |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool and dev server |
| **React Router v7** | Client-side routing and navigation |
| **Tailwind CSS** | Utility-first styling framework |
| **Google Gemini AI** | AI-powered document processing |
| **Google GenAI SDK** | Integration with Google's AI models |

## 📋 Project Structure

```
├── components/
│   ├── Dashboard/
│   │   └── RepositoryView.tsx          # Main dashboard displaying documents
│   ├── FileExplorer/
│   │   ├── FileExplorer.tsx            # File browser with navigation
│   │   ├── FileDetailModal.tsx         # Document details and preview
│   │   ├── PdfViewer.tsx               # PDF viewing capabilities
│   │   └── TableView.tsx               # Tabular data display
│   ├── Forms/
│   │   └── AuthForm.tsx                # Login/authentication form
│   ├── Landing/
│   │   └── LandingPage.tsx             # Welcome and onboarding page
│   ├── Layout/
│   │   ├── DashboardLayout.tsx         # Main app layout wrapper
│   │   └── Sidebar.tsx                 # Navigation sidebar
│   └── UI/
│       ├── ConfirmationModal.tsx       # Confirmation dialogs
│       └── Toast.tsx                   # Toast notifications
├── services/
│   ├── ai.ts                           # AI integration utilities
│   └── gemini.ts                       # Google Gemini API client
├── store/
│   └── mockData.ts                     # Mock data for development
├── App.tsx                             # Main app component
├── types.ts                            # TypeScript type definitions
├── constants.tsx                       # App constants and configurations
├── index.tsx                           # React entry point
├── index.html                          # HTML template
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/skaleway/EquoraScale.git
   cd eqorascale-mvp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env.local` file in the project root
   - Add your Google Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

5. **Build for Production**
   ```bash
   npm run build
   ```
   Output files will be in the `dist/` directory

6. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 🔑 Core Workflows

### 1. User Authentication
- Users land on the landing page
- Click to proceed to login
- Enter credentials in the AuthForm
- Session is stored in localStorage
- Redirected to dashboard on successful login

### 2. Document Management
- Navigate the FileExplorer to browse documents
- Click files to view details in FileDetailModal
- Right-click for context menu with rename/delete options
- Upload new documents using the upload trigger
- View PDFs directly in the PdfViewer

### 3. AI Document Processing
- Upload procurement documents (RFQ, PO, etc.)
- Gemini AI automatically analyzes and extracts data
- View extracted information in structured format
- Search using AI-powered semantic search
- Generate reports and insights from documents

### 4. Supply Chain Tracking
- View all RFQs, POs, and Quotations in Dashboard
- Filter and sort by status, date, or supplier
- Track document lifecycle from creation to completion
- Receive notifications for important status changes
- Export data for reporting and analysis

## 🔧 Configuration

### Customizing the Application

**Theme Configuration** (`constants.tsx`):
- Modify color schemes
- Update icon sets
- Configure document type colors

**API Configuration** (`services/gemini.ts`):
- Adjust AI model parameters
- Configure API endpoints
- Set request timeouts

**User Permissions** (`App.tsx`):
- Define role-based access levels
- Configure protected routes
- Customize dashboard permissions

## 📱 Features in Detail

### File Explorer
- Hierarchical directory navigation
- Real-time file filtering
- Context menu operations (rename, delete)
- File type indicators with color coding
- Breadcrumb navigation for easy path tracking

### Document Details
- PDF preview and full-screen viewing
- File metadata display (size, type, created date)
- Related documents suggestion
- Download capabilities
- Document history and versioning

### Dashboard
- Overview of all documents
- Quick statistics on RFQs, POs, and Quotations
- Recent activities feed
- Key performance indicators
- Quick action buttons

### Notifications
- Toast alerts for actions
- Success/error feedback
- Action confirmation dialogs
- Real-time status updates

## 🧪 Development

### Running Tests
Currently, the project focuses on component development. As the project matures, tests will be added:
```bash
npm run test       # Unit tests
npm run test:e2e   # End-to-end tests
```

### Debugging
- Enable React DevTools browser extension
- Use TypeScript for better IDE support
- Check console for detailed error messages
- Inspect localStorage for session data

### Code Style
- TypeScript for type safety
- React hooks for component logic
- Functional components throughout
- Tailwind CSS for styling consistency

## 🚢 Deployment

### Deploy to Production
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider:
   - **Vercel**: Connect GitHub repo for automatic deployments
   - **Netlify**: Drop `dist/` folder or connect GitHub
   - **AWS S3 + CloudFront**: Static site hosting
   - **Docker**: Containerize the application

3. Set environment variables in production:
   - `VITE_GEMINI_API_KEY` - Your production API key

## 🐛 Troubleshooting

### Application Won't Start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Verify ports 5173 (dev) or 3000 (preview) are available

### API Errors
- Verify GEMINI_API_KEY is correctly set
- Check API key has necessary permissions
- Review API quotas and rate limits
- Check network connectivity

### Build Issues
- Clear Vite cache: `rm -rf dist && rm -rf .vite`
- Update dependencies: `npm update`
- Check TypeScript errors: `npx tsc --noEmit`

## 📞 Support & Documentation

- **Issues**: Report bugs on GitHub Issues
- **Documentation**: Full API docs available in `docs/`
- **AI Studio**: [View on AI Studio](https://ai.studio/apps/drive/1YGp8GHcYgIWWAU6P3SMHj7DtLMvTqefq)

## 📄 License

This project is part of the Eqorascale enterprise suite.

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit a Pull Request

## 📈 Roadmap

- [ ] Advanced analytics and reporting dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Integration with ERP systems
- [ ] Machine learning for predictive analytics
- [ ] Automated workflow automation
- [ ] Enhanced security with 2FA

## ✅ Changelog

### Version 0.0.0 (MVP Release)
- Initial project setup with React 19 and Vite
- Core file management system
- Basic authentication
- Gemini AI integration
- Dashboard and file explorer components
- Responsive design with dark mode support

---

**Built with ❤️ for modern supply chain management**
