import React, { useRef, useState } from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { Download, Upload, Trash2, Database, ShieldAlert, Leaf } from 'lucide-react';
import Preloader from './Preloader';
import { showToast } from './Toast';

export default function Settings() {
  const { inputs, habitsHistory, streakCount, badges, activeRecommendations, completedRecommendations, resetAllData, importData } = useCarbonStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const backup = {
      hasCalculated: true,
      inputs,
      habitsHistory,
      streakCount,
      badges,
      activeRecommendations,
      completedRecommendations,
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terraguide-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      setTimeout(() => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          
          const success = importData(parsed);
          setImporting(false);
          
          if (success) {
            showToast('Settings and progress data imported successfully!', 'success');
          } else {
            showToast('Failed to parse file. Please verify the JSON structure.', 'error');
          }
        } catch {
          setImporting(false);
          showToast('Invalid file type. Please upload a valid JSON backup file.', 'error');
        }
      }, 1200); // Simulate import loading animation
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    showToast('All calculations, history, streaks, and badges have been deleted.', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {importing && <Preloader message="Importing database backup..." />}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-50">Settings & Local Data</h2>
        <p className="text-xs text-muted-foreground">Manage your offline footprint profile, achievements, and data backups.</p>
      </div>

      {/* Backup Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Data Backup & Portability
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          TerraGuide is fully private and serverless. Your profile data never leaves your browser. You can export a local `.json` backup file to save your progress, or import a backup on another device.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex-1 py-2.5 px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Backup (JSON)
          </button>
          
          <button
            onClick={handleImportClick}
            className="flex-1 py-2.5 px-4 border border-border bg-card text-emerald-900 dark:text-emerald-100 hover:bg-emerald-500/[0.02] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Upload className="w-4 h-4" /> Import Backup (JSON)
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {/* Privacy Policy / Offline Mode info */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Offline Privacy Policy
        </h3>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-5 leading-relaxed">
          <li><strong>Zero Tracking:</strong> No tracking cookies, no Google Analytics, no telemetry.</li>
          <li><strong>No Networking:</strong> The application does not issue any network requests after the first load. All calculations, recommendations, and chart drawings happen in-browser on the client side.</li>
          <li><strong>Storage details:</strong> State is compiled and preserved inside your browser&apos;s persistent `localStorage` database under the key `terraguide-state`.</li>
        </ul>
      </div>

      {/* Destructive Actions Card */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" /> Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground">
          Clearing profile data will permanently wipe your carbon calculations, tracked streak logs, active plan items, and earned achievement badges. This action is irreversible.
        </p>

        {showResetConfirm ? (
          <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-950/40 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">Are you absolutely sure? All local files & logs will be deleted!</span>
            <div className="flex gap-2.5">
              <button
                onClick={handleConfirmReset}
                className="py-1.5 px-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-1.5 px-3.5 border border-border bg-card font-semibold rounded-lg text-xs hover:bg-emerald-500/[0.02] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleResetClick}
            className="py-2.5 px-4 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Reset All Local Data
          </button>
        )}
      </div>

    </div>
  );
}
