import React from 'react';
import { Header } from '../components/Header';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen">
      <Header title={title} subtitle={description} />
      <main className="p-4 sm:p-6 lg:p-8">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {['REST API ready', 'PostgreSQL model ready', 'Dashboard integration ready'].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
