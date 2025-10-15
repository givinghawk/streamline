# Contributing to Streamline

Thank you for considering contributing to Streamline. This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful and constructive in all interactions. Harassment, discrimination, or abusive behaviour will not be tolerated.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the existing issues to avoid duplicates
2. Ensure you're using the latest version
3. Verify FFmpeg is installed correctly

When reporting a bug, include:
- Operating system and version
- Application version
- FFmpeg version (`ffmpeg -version`)
- Steps to reproduce
- Expected vs actual behaviour
- Console logs (if applicable)
- Screenshots (if relevant)

### Suggesting Features

Feature suggestions are welcome. Please:
- Check existing issues and discussions first
- Clearly describe the feature and its benefits
- Explain use cases
- Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Test thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork
7. Open a pull request

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- FFmpeg installed and in PATH
- Git

### Installation

```bash
git clone https://github.com/givinghawk/streamline.git
cd streamline
npm install
```

### Running Locally

```bash
npm run electron:dev
```

### Building

```bash
npm run build
npm run package
```

## Code Style

### JavaScript/React

- Use ES6+ features
- Prefer functional components and hooks
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Commits

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(encoder): add VP9 encoding support
fix(ui): resolve dropdown colour in dark mode
docs(readme): update installation instructions
```

## Project Structure

```
src/
├── components/       # React UI components
├── contexts/        # React context providers
├── constants/       # Preset definitions
├── utils/          # Utility functions
└── electron/       # Main process modules
    ├── ffmpeg.js   # FFmpeg operations
    └── thumbnails.js # Thumbnail generation
```

### Key Files

- `main.js` - Electron main process
- `preload.js` - Electron preload script
- `src/App.jsx` - Main React component
- `src/index.css` - Global styles

## Testing

Currently, the project doesn't have automated tests. Adding test coverage is a valuable contribution.

If you add tests:
- Use Jest for unit tests
- Test critical functionality
- Aim for meaningful coverage, not 100%

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for functions
- Update inline comments as needed
- Create markdown docs for complex features

## Release Process

Maintainers will handle releases:

1. Version bump in `package.json`
2. Update changelog
3. Create git tag (`v1.0.0`)
4. Push tag to trigger GitHub Actions
5. GitHub Actions builds and creates release

## Questions?

Open an issue with the `question` label or start a discussion.

## Licence

By contributing, you agree that your contributions will be licensed under the MIT Licence.
