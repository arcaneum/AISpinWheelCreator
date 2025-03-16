# AI Spin Wheel Creator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

AI Spin Wheel Creator is a web application that allows users to create customisable spin wheels for decision-making, random selection, or just for fun!  What sets this spin wheel apart is its **AI-powered option generation feature**, powered by the Groq API.  Simply provide a prompt, and the AI will suggest creative and relevant options for your wheel segments, saving you time and sparking inspiration.

This application is built using a modern web stack, combining a React frontend for a dynamic user interface and a Node.js/Express backend to handle API requests and integrate with the Groq AI API.

## ✨ Key Features

*   **Customisable Spin Wheels:** Easily create spin wheels with a variety of segments and colours.
*   **AI-Powered Option Generation:**  Generate creative and relevant wheel segment options using the Groq API. Simply provide a prompt, and let AI suggest options for you.
*   **User-Friendly Interface:**  Intuitive and easy-to-use interface for creating and spinning wheels.
*   **Responsive Design:**  The application is designed to be responsive and work well on both desktop and mobile devices.
*   **Local and Web Deployment:**  Run the application locally for development or deploy it to the web for free using platforms like Vercel (deployment instructions provided).
*   **Sound Effects:**  Engaging spin sound effects to enhance the user experience.
*   ** visually appealing and customisable UI components:** using Radix UI and other modern React libraries.

## 🚀 How to Use

1.  **Create a New Wheel:** Click the "New Wheel" button to open the wheel creation dialog.
2.  **Enter Wheel Details:**
    *   Give your wheel a descriptive name.
    *   Enter the segment options. You can manually type them in, or use the "Generate with AI" button.
3.  **Generate AI Options (Optional):**
    *   Click the "Generate with AI" button ( <Wand2 className="h-4 w-4 inline-block align-text-top" /> icon) to use the AI option generator.
    *   Enter a relevant prompt in the "AI Prompt" field (e.g., "5 popular pizza toppings", "Music genres", "Things to do on a Saturday").
    *   Click "Generate Options". The AI-generated options will be populated in the segments list.
    *   You can edit or refine the AI-generated options as needed.
4.  **Customise Segments:** Add, remove, or reorder segments as desired.
5.  **Create Wheel:** Click the "Create Wheel" button to save your new wheel.
6.  **Select a Wheel:** Choose a wheel from the "Wheel List" to load it into the spin wheel area.
7.  **Spin the Wheel:** Click the "Spin!" button to spin the selected wheel.
8.  **View Results:**  The winning segment will be displayed in a toast notification after the wheel stops spinning.

## 🛠️ Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/) - JavaScript library for building user interfaces
    *   [TypeScript](https://www.typescriptlang.org/) -  Superset of JavaScript that adds static typing.
    *   [Vite](https://vitejs.dev/) -  Fast build tool and development server for modern web projects
    *   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
    *   [Radix UI](https://www.radix-ui.com/) -  Set of unstyled, accessible UI primitives
    *   [Lucide React](https://lucide.dev/icons) -  Beautifully simple vector icons
    *   [React Query](https://tanstack.com/query/latest) -  Data fetching and caching library for React
    *   [wouter](https://github.com/molefrog/wouter) -  Minimalist routing library for React
    *   [framer-motion](https://www.framer.com/motion/) -  Animation library for React

*   **Backend:**
    *   [Node.js](https://nodejs.org/en/) -  JavaScript runtime environment
    *   [Express](https://expressjs.com/) -  Minimalist Node.js web application framework
    *   [TypeScript](https://www.typescriptlang.org/) -  Superset of JavaScript that adds static typing.
    *   [Groq API](https://groq.com/) -  For AI-powered option generation
    *   [Drizzle ORM](https://orm.drizzle.team/) -  TypeScript ORM for SQL databases

## 💻 Local Development

To run the AI Spin Wheel Creator locally after cloning the project from GitHub, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/arcaneum/AISpinWheelCreator.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd AISpinWheelCreator
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
5.  **Access the application:** Open your browser and go to `http://localhost:5002` (or the port shown in your terminal output after running `npm run dev`).

Before running locally, ensure you have Node.js and npm (Node Package Manager) installed on your system.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Created with ❤️ using AI assistance!
