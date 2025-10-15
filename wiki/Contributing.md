# Contributing

Thank you for your interest in contributing to Streamline! This guide will help you get started.

## Ways to Contribute

### 🐛 Report Bugs

Found a bug? Help us fix it:

1. **Check existing issues** - Search [GitHub Issues](https://github.com/givinghawk/streamline/issues) first
2. **Create detailed report** - Use the bug report template
3. **Include information**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos if applicable
   - System information (OS, Streamline version, FFmpeg version)
   - Error messages

### 💡 Suggest Features

Have an idea? We'd love to hear it:

1. **Check roadmap** - See if it's already planned
2. **Search existing issues** - Avoid duplicates
3. **Create feature request** - Use the feature request template
4. **Describe clearly**:
   - Problem it solves
   - Proposed solution
   - Alternative solutions considered
   - Use cases and examples

### 📝 Improve Documentation

Documentation contributions are valuable:

- Fix typos and grammatical errors
- Clarify confusing sections
- Add examples and tutorials
- Translate to other languages
- Update outdated information
- Add troubleshooting tips

### 🔧 Submit Code

Ready to code? Great!

1. **Find an issue** - Look for "good first issue" label
2. **Discuss first** - Comment on the issue to coordinate
3. **Fork and clone** - Create your own copy
4. **Create branch** - Use descriptive name
5. **Make changes** - Follow code style guidelines
6. **Test thoroughly** - Verify your changes work
7. **Submit PR** - Create pull request with clear description

### 🧪 Test and Review

Help test and review:

- Test pre-release versions
- Review pull requests
- Verify bug fixes
- Test on different platforms
- Provide feedback on features

## Getting Started

### 1. Fork the Repository

Click "Fork" on [GitHub repository](https://github.com/givinghawk/streamline)

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/streamline.git
cd streamline
```

### 3. Set Up Development Environment

Follow the [Development Guide](Development-Guide.md) to set up your environment.

### 4. Create a Branch

```bash
git checkout -b feature/my-feature-name
# or
git checkout -b fix/bug-description
```

Use descriptive branch names:
- `feature/video-comparison-tool`
- `fix/encoding-crash-windows`
- `docs/update-installation-guide`

### 5. Make Changes

Follow our coding standards and guidelines below.

### 6. Test Your Changes

```bash
# Run development server
npm run electron:dev

# Test your changes thoroughly
# Try edge cases
# Test on target platforms
```

### 7. Commit Changes

Use conventional commit messages:

```bash
git commit -m "feat: Add video comparison tool"
git commit -m "fix: Resolve encoding crash on Windows"
git commit -m "docs: Update installation guide"
git commit -m "refactor: Simplify preset selection"
git commit -m "test: Add unit tests for FFmpeg module"
```

**Commit Message Format**:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### 8. Push to Your Fork

```bash
git push origin feature/my-feature-name
```

### 9. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What and why
   - **Related Issue**: Link to issue (if applicable)
   - **Testing**: How you tested
   - **Screenshots**: For UI changes

### 10. Address Review Feedback

- Be responsive to feedback
- Make requested changes
- Push updates to same branch
- PR updates automatically

## Code Guidelines

### JavaScript/React Style

**General Principles**:
- Write clean, readable code
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**React Components**:
```javascript
import React, { useState, useEffect } from 'react';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 */
export default function MyComponent({ title, onAction }) {
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Effect logic with clear purpose
  }, [dependencies]);
  
  const handleClick = () => {
    setIsActive(!isActive);
    onAction?.();
  };
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2>{title}</h2>
      <button onClick={handleClick}>
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  );
}
```

**Naming Conventions**:
- **Components**: PascalCase (`MyComponent`)
- **Functions**: camelCase (`handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILES`)
- **Files**: PascalCase for components (`MyComponent.jsx`)

### CSS/Tailwind Style

**Use Tailwind Utilities**:
```javascript
// Good
<div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">

// Avoid (unless necessary)
<div style={{ display: 'flex', padding: '16px' }}>
```

**Dark Mode Support**:
```javascript
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
```

**Responsive Design**:
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### File Structure

**Organize by feature**:
```
src/
  components/
    MyFeature.jsx       # Component
    MyFeatureItem.jsx   # Sub-component
  contexts/
    MyFeatureContext.jsx
  utils/
    myFeatureUtils.js
```

**Keep components focused**:
- Single responsibility
- Reusable where possible
- Extract complex logic to utils

## Testing Guidelines

### Manual Testing Checklist

Before submitting PR, test:

- ✅ Feature works as intended
- ✅ No console errors or warnings
- ✅ Works in both dark and light themes
- ✅ Responsive on different screen sizes
- ✅ No performance regressions
- ✅ Edge cases handled
- ✅ Error handling works
- ✅ Works on target platforms

### Testing Platforms

If possible, test on:
- **Windows** 10/11
- **macOS** (Intel and Apple Silicon)
- **Linux** (Ubuntu/Fedora)

If you can't test all platforms, note this in PR.

## Pull Request Guidelines

### PR Title

Clear and descriptive:
- ✅ "Add video comparison tool for quality validation"
- ✅ "Fix encoding crash when output path contains spaces"
- ❌ "Update code"
- ❌ "Fix bug"

### PR Description

Use the template and include:

**What**:
- What changes were made
- What problem it solves

**Why**:
- Motivation for changes
- Context and background

**How**:
- Approach taken
- Key technical decisions

**Testing**:
- How you tested
- Test cases covered
- Platforms tested

**Screenshots**:
- Before/after for UI changes
- Error states
- New features in action

### Size

Keep PRs focused and manageable:
- ✅ Single feature or fix
- ✅ Related changes grouped
- ❌ Multiple unrelated changes
- ❌ Massive refactors with new features

**Large changes**: Break into smaller PRs

### Code Review

When your PR is reviewed:

- **Be patient** - Reviews take time
- **Be responsive** - Address feedback promptly
- **Be open** - Consider suggestions
- **Ask questions** - If unclear, ask
- **Explain** - Provide context for decisions

## Documentation Guidelines

### Code Comments

**Use comments for**:
- Complex algorithms
- Non-obvious decisions
- Workarounds and hacks
- Public API functions

**Don't comment**:
- Obvious code
- What code does (code should be self-explanatory)
- Outdated information

```javascript
// Good: Explains why
// Using setTimeout to avoid race condition with FFmpeg process
setTimeout(() => checkStatus(), 100);

// Bad: Explains what (obvious)
// Set isActive to true
setIsActive(true);
```

### Inline Documentation

Use JSDoc for functions:
```javascript
/**
 * Encodes a video file with specified settings
 * @param {string} inputPath - Path to input file
 * @param {Object} settings - Encoding settings
 * @param {string} settings.codec - Video codec to use
 * @param {number} settings.crf - Quality (CRF value)
 * @returns {Promise<string>} Path to output file
 */
async function encodeVideo(inputPath, settings) {
  // Implementation
}
```

### Wiki Documentation

When adding features, update wiki:
- Add to relevant pages
- Create new page if needed
- Update navigation in Home.md
- Include examples and screenshots

## Community Guidelines

### Code of Conduct

- **Be respectful** - Treat everyone with respect
- **Be inclusive** - Welcome all contributors
- **Be constructive** - Provide helpful feedback
- **Be patient** - Remember everyone is learning
- **Be professional** - Keep discussions on-topic

### Communication

- **Issues**: For bugs and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For questions and ideas (if enabled)

### Response Times

We aim to:
- Acknowledge issues within 48 hours
- Review PRs within 1 week
- Close or update stale issues monthly

Please be patient - maintainers are volunteers!

## Recognition

Contributors are recognized:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Profile linked in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Read the [Development Guide](Development-Guide.md)
- Check [existing issues](https://github.com/givinghawk/streamline/issues)
- Ask in PR/issue comments
- Be patient and respectful

## Getting Help

Need help contributing?

1. **Read documentation**:
   - [Development Guide](Development-Guide.md)
   - [User Guide](User-Guide.md)
   - [Troubleshooting](Troubleshooting.md)

2. **Search issues**:
   - Similar problems
   - Solutions already provided
   - Discussions on approaches

3. **Ask for help**:
   - Comment on issue
   - Open discussion (if enabled)
   - Be specific about problem

## Thank You!

Every contribution, no matter how small, helps make Streamline better. Thank you for being part of the community!

## Next Steps

- Check the [Roadmap](Roadmap.md) for planned features
- Look for ["good first issue"](https://github.com/givinghawk/streamline/labels/good%20first%20issue) labels
- Read the [Development Guide](Development-Guide.md) for setup instructions
- Join the discussion on existing PRs and issues
