# CV Project Improvement Plan

## High Priority Tasks

### Security & Dependencies ✅ COMPLETED
- [x] Update dependencies to fix security vulnerabilities
- [x] Add Content Security Policy headers 
- [x] Add runtime validation for CV data schema

### Testing
- [ ] Uncomment and modernize tests in cv.test.js
- [ ] Add test runner (Vitest/Jest) to package.json

## Medium Priority Tasks

### Code Quality
- [ ] Add tests for CvBuilder class
- [ ] Add tests for error handling scenarios
- [ ] Improve error messages and recovery in cv.js
- [ ] Add JSDoc param validation at runtime
- [ ] Extract magic strings to configuration files
- [ ] Split large functions in cv.builder.js

## Low Priority Tasks

### Performance & Development
- [ ] Add lazy loading for non-critical assets
- [ ] Add bundle size monitoring
- [ ] Add pre-commit hooks for formatting
- [ ] Create JSON schema for CV data validation

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Format: `npm run format`
- Security check: `npm audit`