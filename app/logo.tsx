import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <svg
        className="h-8 w-8 text-zinc-950 dark:text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span className="ml-2 text-xl font-bold text-zinc-950 dark:text-white">MyLogo</span>
    </div>
  );
};

export default Logo;
