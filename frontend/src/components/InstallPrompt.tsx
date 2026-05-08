import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem('expense-tracker-install-dismissed') === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem('expense-tracker-install-dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      localStorage.setItem('expense-tracker-install-dismissed', 'true');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const dismiss = () => {
    localStorage.setItem('expense-tracker-install-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] rounded-lg border border-blue-200 bg-white p-4 shadow-2xl sm:left-auto sm:right-5 sm:max-w-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-600 p-2 text-white">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-950">Install Expense Tracker</p>
          <p className="mt-1 text-sm leading-5 text-slate-600">Add it to your home screen and open it like a mobile app.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={install} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Install App
            </button>
            <button onClick={dismiss} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Later
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Dismiss install prompt">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
