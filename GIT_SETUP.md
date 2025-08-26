# Git Setup Guide

## Initialize Git Repository

To start using version control with this project:

```bash
# Initialize git repository
git init

# Add files to staging
git add .

# Create first commit
git commit -m "Initial commit: Hakone Sengokuhara Hotel booking system"

# Add remote repository (optional)
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## .gitignore Configuration

The `.gitignore` file has been configured to exclude:

### Essential Exclusions
- **Environment files**: `.env*` files containing sensitive information
- **Node modules**: `node_modules/` directory
- **Build outputs**: `.next/`, `dist/`, `out/`
- **Database files**: `*.db`, `*.sqlite*` 
- **Log files**: `*.log` files

### Development Files
- **IDE settings**: `.vscode/`, `.idea/`
- **Cache files**: Various cache directories
- **Temporary files**: `tmp/`, `temp/`
- **OS files**: `.DS_Store`, `Thumbs.db`

### Upload Management
- **User uploads**: `public/uploads/*` (uploaded room images)
- **Temp files**: `public/temp/*` (temporary uploads)
- **Directory structure**: Preserved with `.gitkeep` files

### Security Notes
- ⚠️ **Never commit** the `.env` file - it contains sensitive API keys
- ✅ **Do commit** the `.env.example` file as a template
- ✅ **Static assets** in `public/images/` are tracked (hero background, floor plans)

## Clean Up Existing Files

If you already have unwanted files tracked in git:

```bash
# Remove files that should be ignored
git rm -r --cached node_modules/
git rm --cached .env
git rm --cached *.log
git rm --cached .DS_Store
git rm --cached tsconfig.tsbuildinfo

# Commit the removal
git commit -m "Remove files that should be ignored"
```

## Recommended Git Workflow

1. **Before making changes**:
   ```bash
   git pull origin main
   ```

2. **After making changes**:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin main
   ```

3. **For features**:
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   # Create pull request
   ```

## Environment Variables

Make sure to configure your `.env` file with:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `JWT_SECRET`: Secret key for JWT tokens
- `DATABASE_URL`: Database connection string
- `GMAIL_USER` & `GMAIL_APP_PASSWORD`: Email configuration

## File Structure Preservation

The upload directories are preserved with `.gitkeep` files:
- `public/uploads/.gitkeep`: Maintains room image upload directory
- `public/temp/.gitkeep`: Maintains temporary file directory

This ensures the necessary directory structure exists for the application while excluding user-uploaded content from version control.