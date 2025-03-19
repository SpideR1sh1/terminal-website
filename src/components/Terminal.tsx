'use client';

import { useState, useEffect, useRef } from 'react';

interface Command {
  input: string;
  output: string | JSX.Element;
}

export default function Terminal() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const availableCommands = {
    help: () => (
      <div className="mt-2">
        <p>Available commands:</p>
        <ul className="ml-4">
          <li>about - Learn about me</li>
          <li>skills - View my technical skills</li>
          <li>projects - See my projects</li>
          <li>contact - Get my contact information</li>
          <li>clear - Clear the terminal</li>
          <li>help - Show this help message</li>
        </ul>
      </div>
    ),
    about: () => (
      <div className="mt-2">
        <p>Hi! I'm [Your Name]</p>
        <p className="mt-2">
          I'm a software developer passionate about creating elegant solutions to complex problems.
          When I'm not coding, you can find me [your interests/hobbies].
        </p>
      </div>
    ),
    skills: () => (
      <div className="mt-2">
        <p>Technical Skills:</p>
        <ul className="ml-4">
          <li>Languages: JavaScript, TypeScript, Python, etc.</li>
          <li>Frontend: React, Next.js, Tailwind CSS</li>
          <li>Backend: Node.js, Express, PostgreSQL</li>
          <li>Tools: Git, Docker, AWS</li>
        </ul>
      </div>
    ),
    projects: () => (
      <div className="mt-2">
        <p>Featured Projects:</p>
        <ul className="ml-4">
          <li>Project 1 - Description</li>
          <li>Project 2 - Description</li>
          <li>Project 3 - Description</li>
        </ul>
      </div>
    ),
    contact: () => (
      <div className="mt-2">
        <p>Get in touch:</p>
        <ul className="ml-4">
          <li>Email: your.email@example.com</li>
          <li>GitHub: github.com/yourusername</li>
          <li>LinkedIn: linkedin.com/in/yourusername</li>
        </ul>
      </div>
    ),
    clear: () => {
      setCommands([]);
      return '';
    },
  };

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    const command = availableCommands[trimmedInput as keyof typeof availableCommands];
    
    if (command) {
      return command();
    } else if (trimmedInput === '') {
      return '';
    } else {
      return `Command not found: ${trimmedInput}. Type 'help' for available commands.`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput) {
      const newCommand = {
        input: currentInput,
        output: handleCommand(currentInput),
      };
      
      setCommands([...commands, newCommand]);
      setCommandHistory([currentInput, ...commandHistory]);
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-button terminal-close" />
        <div className="terminal-button terminal-minimize" />
        <div className="terminal-button terminal-maximize" />
      </div>
      <div className="terminal-body" ref={terminalBodyRef}>
        <div className="welcome-message mb-4">
          <p>Welcome to my terminal portfolio! Type 'help' to see available commands.</p>
        </div>
        {commands.map((command, index) => (
          <div key={index} className="mb-4">
            <div className="command-line">
              <span className="prompt">$</span>
              <span>{command.input}</span>
            </div>
            <div className="mt-1 ml-6">{command.output}</div>
          </div>
        ))}
        <div className="command-line">
          <span className="prompt">$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none flex-1"
            autoFocus
          />
          {!currentInput && <span className="cursor" />}
        </div>
      </div>
    </div>
  );
} 