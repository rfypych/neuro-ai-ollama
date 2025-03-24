import { useTheme } from 'next-themes';

export default function Logo() {
  const { theme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-colors"
      >
        {/* Neural Network Pattern */}
        <path
          d="M8 8L16 4L24 8L16 12L8 8Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        <path
          d="M8 16L16 12L24 16L16 20L8 16Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        <path
          d="M8 24L16 20L24 24L16 28L8 24Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        
        {/* Connection Lines */}
        <path
          d="M16 4L16 28"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/50"
        />
        <path
          d="M8 8L24 24"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/50"
        />
        <path
          d="M24 8L8 24"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/50"
        />
        
        {/* Center Dot */}
        <circle cx="16" cy="16" r="3" fill="currentColor" className="text-primary" />
      </svg>
      
      <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Neura AI
      </span>
    </div>
  );
} 