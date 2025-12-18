# LaTeX Resume Adapter Pro

A high-performance web application that uses Gemini AI to tailor your master CV to a specific job description, generating both a high-fidelity visual preview and professional LaTeX source code.

## Features
- **AI-Powered Adaptation**: Leverages Gemini 3 Flash for intelligent keyword matching and role-specific bullet point refactoring.
- **High-Fidelity PDF Export**: Uses 3x scaling and html2canvas for crisp, professional-grade PDF generation.
- **LaTeX Integration**: Provides raw LaTeX source for power users who prefer local compilation.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## Local Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file and add your `API_KEY`.
4. Run locally: `npm run dev`.

## Deployment Alternatives

### 1. Vercel (Recommended)
- Connect your GitHub repository to [Vercel](https://vercel.com).
- It will automatically detect the React framework.
- Add `API_KEY` in **Settings > Environment Variables**.
- Deployments are automatic on every `git push`.

### 2. Netlify
- Connect your repo to [Netlify](https://netlify.com).
- Set the Build Command to `npm run build` and the Publish Directory to `dist`.
- Add `API_KEY` in **Site Configuration > Environment variables**.

### 3. Cloudflare Pages
- Connect your repo to the [Cloudflare Dashboard](https://dash.cloudflare.com).
- Select **Workers & Pages > Create application > Pages > Connect to Git**.
- Add `API_KEY` in the **Environment variables** section during the setup wizard.

### 4. Render
- Create a new **Static Site** on [Render](https://render.com).
- Add `API_KEY` to the **Environment Variables** section.
- Set the build command to `npm run build` and the publish directory to `dist`.

## License
MIT
