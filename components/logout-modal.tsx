"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center gap-4">
                <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <LogOut className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">
                    Confirm Logout
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Are you sure you want to log out of your account?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <button
                    onClick={onClose}
                    className="w-full h-10 rounded-lg border border-input bg-background hover:bg-muted text-foreground font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="w-full h-10 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
