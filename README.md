# CV project

A CV site that renders print-ready HTML from JSON data.

## 🚀 Features

- **Print-ready** HTML output
- **Data handling**
    - HTML sanitization using DOMPurify
    - Phone number encoding
- **Automated deployment** via GitHub Actions
- **Modern build system** with Vite

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES Modules)
- **Build:** Vite
- **Code Quality:**
    - ESLint for linting
    - Prettier for formatting
- **Security:** DOMPurify for HTML sanitization
- **CI/CD:** GitHub Actions with hosting hooks

## 📋 Prerequisites

- Node.js (version specified in package.json)
- npm/yarn

## 🚦 Getting Started

Pretty standard stuff:

1. Fork the repository.

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cv.git
   cd cv
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create your CV data:
    - Copy `data/cv.template.json` to `data/cv.json`
    - Update `data/cv.json` with your information
    - Use `window.phoneEncode()` in browser console to encode phone numbers

5. Add CV data to GitHub Secrets for deployment:

   ### **Option 1: Using GitHub Web Interface**

```bash
# On macOS/Linux
base64 -i data/cv.json | pbcopy
```

```bash
# On Windows (PowerShell)
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("data/cv.json")) | Set-Clipboard
```

Then:

- Go to your GitHub repository
- Navigate to Settings → Secrets and variables → Actions
- Click "New repository secret"
- Name: `CV_DATA_JS_CONTENT`
- Value: Paste the copied base64 content
- Click "Add secret"

  ### **Option 2: Using GitHub CLI**

```bash
# Add the secret (one-line command)
gh secret set CV_DATA_JS_CONTENT "$(base64 -i data/cv.json)" -R yourusername/cv

# Verify the secret was added
gh secret list -R yourusername/cv
```

6. Start development server:

   ```bash
   npm run dev
   ```

## 🔧 Development

* Start dev server
    ```bash
    npm run dev
    ```

* Debug mode
    ```bash
    npm run debug
    ```

* Format code
    ```bash
    npm run format
    ```

* Build for production
    ```bash
    npm run build
    ```

* Preview production build
    ```bash
    npm run preview
    ```

## 📦 Deployment

The project uses GitHub Actions for automated deployment:

1. Push changes to `main` branch
2. Action builds and minifies assets
3. Deploys to the `build` branch
4. Hosting hooks handle the rest

## ⚠️ Limitations

- No text length validation for printed output
- CV data in base64 format must be under 48KB (GitHub Secrets limitation)

## 🔒 Security Features

- All `innerHTML` usage is sanitized
- External links are secured against tab-nabbing
- Phone numbers are encoded in storage

## 🛟 Developer Tools

- `window.phoneEncode()`: Console utility for phone number encoding
  ```javascript
  // Example: encode +1 012-345-6789
  phoneEncode("0123456789")
  ```

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🤝 Contributing

This project is a Proof of Concept (PoC) and a technical demo. While it's not actively seeking third-party
contributions, you're welcome to:

- Fork the repository
- Experiment with the code
- Use it as a learning resource
- Adapt it for your own needs
