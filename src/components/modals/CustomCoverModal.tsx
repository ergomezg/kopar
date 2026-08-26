import React, { useState } from 'react';
import { X, Camera, Upload, Link as LinkIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomCoverModalProps {
  currentCover: string;
  onSaveCover: (newCoverUrl: string) => void;
  onClose: () => void;
}

const PRESET_COVERS = [
  {
    id: 'preset_1',
    name: 'Casa & Convivencia',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset_2',
    name: 'Espacio Cálido',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset_3',
    name: 'Diseño Moderno',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset_4',
    name: 'Cocina & Compartir',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset_5',
    name: 'Exterior & Terraza',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset_6',
    name: 'Luz & Plantas',
    url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=80',
  },
];

export const CustomCoverModal: React.FC<CustomCoverModalProps> = ({
  currentCover,
  onSaveCover,
  onClose,
}) => {
  const [selectedCover, setSelectedCover] = useState(currentCover);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedCover(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setSelectedCover(customUrlInput.trim());
    }
  };

  const handleSave = () => {
    onSaveCover(selectedCover);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0a0b0d]/60 backdrop-blur-xs p-0 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-[#ffffff] rounded-t-[28px] sm:rounded-[28px] border border-[#dedfe2] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#dedfe2] bg-[#ffffff]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-[22px] font-bold text-[#0a0b0d]">Personalizar foto de portada</h2>
                <p className="text-[11px] text-[#5b616e]">Selecciona o sube la imagen principal del hogar</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#f7f8f9] text-[#0a0b0d] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Live Preview */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider">
                Vista Previa:
              </p>
              <div 
                className="w-full aspect-[21/9] rounded-[20px] bg-cover bg-center border border-[#dedfe2] relative overflow-hidden transition-all duration-300"
                style={{ backgroundImage: `url('${selectedCover}')` }}
              >
                <div className="absolute inset-0 bg-[#0a0b0d]/20" />
                <div className="absolute top-3 right-3 bg-[#0a0b0d] text-[#ffffff] px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wider border border-[#ffffff]/20">
                  HOGAR • CONVIVENCIA
                </div>
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex rounded-full border border-[#dedfe2] p-1 bg-[#f7f8f9]">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'presets'
                    ? 'bg-[#0052ff] text-[#ffffff]'
                    : 'text-[#5b616e] hover:text-[#0a0b0d]'
                }`}
              >
                Galería
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'upload'
                    ? 'bg-[#0052ff] text-[#ffffff]'
                    : 'text-[#5b616e] hover:text-[#0a0b0d]'
                }`}
              >
                Subir foto
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'url'
                    ? 'bg-[#0052ff] text-[#ffffff]'
                    : 'text-[#5b616e] hover:text-[#0a0b0d]'
                }`}
              >
                Enlace URL
              </button>
            </div>

            {/* Presets Grid */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-2 gap-3">
                {PRESET_COVERS.map((preset) => {
                  const isSelected = selectedCover === preset.url;
                  return (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={preset.id}
                      onClick={() => setSelectedCover(preset.url)}
                      className={`group relative rounded-[16px] overflow-hidden border transition-all text-left ${
                        isSelected
                          ? 'border-[#0052ff] ring-2 ring-[#0052ff]'
                          : 'border-[#dedfe2] hover:border-[#0a0b0d]'
                      }`}
                    >
                      <div 
                        className="w-full aspect-[16/9] bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url('${preset.url}')` }}
                      />
                      <div className="p-2.5 bg-[#ffffff] border-t border-[#dedfe2] flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0a0b0d] truncate">{preset.name}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-[#ffffff]" />
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* File Upload Option */}
            {activeTab === 'upload' && (
              <div className="p-6 border-2 border-dashed border-[#dedfe2] rounded-[24px] bg-[#f7f8f9] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0052ff] text-[#ffffff] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-[#ffffff]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0a0b0d]">Sube una imagen desde tu dispositivo</p>
                  <p className="text-xs text-[#5b616e]">Formatos permitidos: JPG, PNG, WEBP</p>
                </div>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0052ff] text-[#ffffff] hover:bg-[#0052ff]/90 font-semibold text-xs cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-[#ffffff]" />
                  <span>Seleccionar archivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Image URL Input Option */}
            {activeTab === 'url' && (
              <form onSubmit={handleApplyUrl} className="space-y-3">
                <label className="text-xs font-semibold text-[#5b616e] uppercase tracking-wider block">
                  Dirección web de la imagen (URL):
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-[#5b616e] absolute left-3.5 top-3" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#dedfe2] text-xs font-semibold text-[#0a0b0d] bg-[#ffffff] focus:ring-2 focus:ring-[#0052ff] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-full bg-[#0a0b0d] text-[#ffffff] font-semibold text-xs hover:bg-[#0a0b0d]/90 border border-[#0a0b0d]"
                  >
                    Vista previa
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-[#dedfe2] bg-[#ffffff] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#dedfe2] bg-[#ffffff] text-[#0a0b0d] hover:bg-[#f7f8f9] font-semibold text-xs transition-all"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-[#0052ff] text-[#ffffff] hover:bg-[#0052ff]/90 font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Guardar foto</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

