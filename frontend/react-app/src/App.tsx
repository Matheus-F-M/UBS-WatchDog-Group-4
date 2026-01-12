/* LEARNING NOTES FOR PAT
  - Defines the UI of the application.
  - Basically the parent for the other components (pages, layouts, routes, etc.)
    - It is kinda the center of the app
  - In the Future, it will be here where we will include
    - Routing (React Router)
    - Global State Management (Zustand)
*/

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function App() {

  return (
    <div className="relative min-h-screen">
      {/* background image layer with controlled opacity */}
      <div className="absolute inset-0 bg-[url(./assets/react.svg)] bg-contain bg-center bg-no-repeat opacity-30 pointer-events-none" />

      {/* content above the background */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="max-w-7xl p-4 text-center">
          <h1 className="text-3xl font-bold underline text-primary mb-6">
            Hello Vite + React!
          </h1>

          <p className="text-sm text-gray-500 mb-6">Welcome to the dashboard demo — sign in or create an account to proceed.</p>

          <div className="flex items-center justify-center gap-3">
            <Button asChild className="hover:scale-105 duration-1000">
              <Link to="/login">Sign in</Link>
            </Button>

            <Button variant="ghost" className="hover:outline-4 hover:outline-UBS-red"asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
