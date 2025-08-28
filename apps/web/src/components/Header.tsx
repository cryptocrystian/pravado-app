import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - page title will go here */}
        <div className="flex-1">
          {/* Page title can be added here based on current route */}
        </div>
        
        {/* Right side - theme toggle and other controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}