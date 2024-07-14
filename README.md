# MessageMagic

MessageMagic is a Next.js-based application that allows users to generate messages anonymously using AI technologies. The app creates personalized messages on behalf of the user, which can then be sent anonymously to recipients.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development Dependencies](#development-dependencies)

## Features

- AI-powered message generation tailored to user inputs
- Anonymous message sending capability
- User-friendly interface for crafting and sending messages
- Utilizes Next.js 14 for server-side rendering and routing
- Integrates with Google's Generative AI and OpenAI for advanced text generation
- Implements user authentication using NextAuth for secure access
- Uses React Hook Form for intuitive form handling and Zod for input validation
- Styled with Tailwind CSS and integrates Radix UI components for a modern look
- Supports email functionality with React Email and Resend for message delivery

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version compatible with Next.js 14.2.4)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/messagemagic.git
   cd messagemagic
   ```

2. Install the dependencies:
   ```
   npm install
   ```
   or if you're using yarn:
   ```
   yarn install
   ```

## Usage

To start the development server:

```
npm run dev
```

or with yarn:

```
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access MessageMagic. Follow the on-screen instructions to generate and send your anonymous message.

## Scripts

- `dev`: Starts the development server
- `build`: Builds the application for production
- `start`: Starts the production server
- `lint`: Runs the linter to check for code quality issues

## Dependencies

Key dependencies include:

- Next.js (v14.2.4)
- React (v18)
- @ai-sdk/google and @ai-sdk/openai for AI-powered message generation
- next-auth for user authentication
- mongoose for database integration
- react-hook-form and zod for form handling and input validation
- tailwindcss for styling

For a full list of dependencies, please refer to the `package.json` file.

## Development Dependencies

The project uses TypeScript and includes type definitions for React and Node.js. ESLint is configured for code quality control, and Tailwind CSS is set up with PostCSS.

For a complete list of dev dependencies, check the `devDependencies` section in the `package.json` file.

## Privacy and Security

MessageMagic takes user privacy seriously. While the app facilitates anonymous message sending, users should be aware of and comply with all applicable laws and regulations regarding anonymous communications.

## Disclaimer

This application is designed for entertainment and communication purposes. Users are responsible for the content they generate and send. MessageMagic does not endorse or encourage any misuse of its anonymous messaging feature.
