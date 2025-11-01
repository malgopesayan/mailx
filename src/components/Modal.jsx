import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-card w-full max-w-lg rounded-xl border border-border-color p-6 m-4"
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-text-secondary hover:bg-card-hover hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}