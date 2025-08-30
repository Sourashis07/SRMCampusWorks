import { useEffect, useState } from 'react';

const CodeAnimation = () => {
  const [lines, setLines] = useState([]);

  const codeSnippets = [
    'const student = new Student();',
    'function submitAssignment() {',
    'if (deadline.isNear()) {',
    'return findHelper();',
    '}',
    'class Project {',
    'constructor(title, budget) {',
    'this.title = title;',
    'this.budget = budget;',
    '}',
    'async function collaborate() {',
    'const team = await findTeam();',
    'return team.work();',
    '}',
    'export default CampusWorks;'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLines(prev => {
        const newLines = [...prev];
        if (newLines.length > 20) newLines.shift();
        newLines.push({
          id: Date.now(),
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          opacity: 1
        });
        return newLines.map((line, index) => ({
          ...line,
          opacity: Math.max(0.1, 1 - (newLines.length - index) * 0.1)
        }));
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 dark:from-blue-900/10 dark:to-purple-900/10" />
      {lines.map((line, index) => (
        <div
          key={line.id}
          className="absolute left-4 font-mono text-sm text-blue-600/60 dark:text-blue-400/60 animate-pulse"
          style={{
            top: `${index * 30 + 20}px`,
            opacity: line.opacity,
            transform: `translateX(${Math.sin(index * 0.5) * 20}px)`
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
};

export default CodeAnimation;