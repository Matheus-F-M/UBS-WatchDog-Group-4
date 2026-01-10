import './App.css'
import { Button } from './components/ui/button'

function App() {

  return (
    <>
      <div>
        <h1 className="text-3xl underline"> Hello World </h1>
      </div>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button variant='outline'>Click Me</Button>
      </div>
    </>
  )
}

export default App
