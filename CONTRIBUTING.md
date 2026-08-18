# Contributing to the Enterprise Utility Dashboard

First off, thank you for considering contributing to this project! It's people like you that make open-source and collaborative development such a great community. 

These guidelines are designed to make it as easy as possible to get involved.

## Code of Conduct
This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainer.

## How Can I Contribute?

### Reporting Bugs
If you find a bug in the source code or a mistake in the data mapping, you can help us by [submitting an issue](https://github.com/EmmaOyerinde/my-portfolio/issues) to our GitHub Repository. Even better, you can submit a Pull Request with a fix.

When submitting a bug report, please include:
* A clear and descriptive title.
* Steps to reproduce the issue.
* The browser and operating system you are using.
* Screenshots or console error logs, if applicable.

### Suggesting Enhancements
If you have an idea for a new feature, a new utility to add to the database, or an improvement to the UI/UX, please [submit an enhancement request](https://github.com/EmmaOyerinde/my-portfolio/issues) via GitHub Issues. 
* Explain **why** this enhancement would be useful.
* Provide examples or mockups if possible.

## Local Development Setup

This project uses vanilla HTML, CSS, and ES6 JavaScript. There is no `npm install` or build step required, but **you must use a local web server** to run the project due to browser CORS policies regarding ES6 module imports (e.g., `import { db } from './db.js'`).

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone [https://github.com/EmmaOyerinde/my-portfolio.git](https://github.com/EmmaOyerinde/my-portfolio.git)
