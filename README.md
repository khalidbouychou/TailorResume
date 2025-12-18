# LaTeX Resume Adapter Pro

A high-performance web application that uses Gemini AI to tailor your master CV to a specific job description, generating both a high-fidelity visual preview and professional LaTeX source code.

## Features
- **AI-Powered Adaptation**: Leverages Gemini 3 Flash for intelligent keyword matching and role-specific bullet point refactoring.
- **High-Fidelity PDF Export**: Uses 3x scaling and html2canvas for crisp, professional-grade PDF generation.
- **LaTeX Integration**: Provides raw LaTeX source for power users who prefer local compilation.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file and add your `API_KEY`.
4. Run locally: `npm run dev`.

## Deployment (Render)
1. Push this code to a GitHub repository.
2. Create a new **Static Site** on Render.
3. Add `API_KEY` to the **Environment Variables** section in the Render dashboard.
4. Set the build command to `npm run build` and the publish directory to `dist`.

## License
MIT
