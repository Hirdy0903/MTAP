import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-5">
        <h1 className="text-8xl font-black bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">404</h1>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold">Page not found</h2>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Sorry, we couldn't find the page you're looking for. Please check the URL or head back home.
          </p>
        </div>
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 py-2.5 px-5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-indigo-400 font-semibold text-sm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
