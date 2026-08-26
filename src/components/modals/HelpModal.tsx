import React, { useState, useMemo } from 'react';
import {
  X,
  HelpCircle,
  Users,
  Receipt,
  PieChart,
  CheckCircle2,
  Search,
  BookOpen,
  Info,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Article {
  id: string;
  categoryId: string;
  question: string;
  summary: string;
  steps: string[];
  tip: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todo', icon: HelpCircle },
  { id: 'start', name: 'Empezar', icon: Users },
  { id: 'expenses', name: 'Anotar y dividir', icon: Receipt },
  { id: 'balances', name: 'Balances', icon: PieChart },
  { id: 'settle', name: 'Saldar cuentas', icon: CheckCircle2 },
  { id: 'glossary', name: 'Glosario', icon: BookOpen },
];

const ARTICLES: Article[] = [
  {
    id: 'invite-members',
    categoryId: 'start',
    question: '¿Cómo invito a mi pareja o compañeros de casa a nuestro hogar?',
    summary:
      'Puedes sumar a las personas que viven contigo compartiéndoles un enlace directo o el código único de tu hogar.',
    steps: [
      'Ve a la pestaña Hogar en la parte inferior o toca el botón Invitar.',
      'Copia el enlace de invitación o el código de 6 dígitos que aparece en pantalla.',
      'Envíalo por WhatsApp o tu app de mensajes favorita. Al abrirlo, se unirán automáticamente a las cuentas del hogar.',
    ],
    tip: 'Todos los integrantes verán los mismos gastos en tiempo real desde sus propios teléfonos.',
  },
  {
    id: 'switch-member',
    categoryId: 'start',
    question: '¿Cómo cambio de integrante para ver lo que me corresponde a mí?',
    summary:
      'En KOPAR puedes alternar fácilmente entre los integrantes para ver exactamente cuánto debe o tiene a favor cada uno.',
    steps: [
      'Toca tu foto o nombre en la esquina superior derecha de la pantalla.',
      'Selecciona la persona que deseas consultar en la lista.',
      'La pantalla principal se actualizará al instante con los números correspondientes a ese integrante.',
    ],
    tip: 'Esto es muy práctico para revisar las cuentas individuales antes de hacer una transferencia entre ustedes.',
  },
  {
    id: 'add-expense',
    categoryId: 'expenses',
    question: '¿Cómo anoto un nuevo gasto del hogar?',
    summary:
      'Cada vez que compres algo para la casa (mercado, servicios, arriendo), anótalo en segundos con el botón principal.',
    steps: [
      'Toca el botón azul «+» en la barra inferior o la acción rápida Añadir gasto.',
      'Escribe el valor, el concepto (ej. Supermercado) y selecciona la categoría.',
      'Confirma quién pagó la cuenta y pulsa Guardar gasto.',
    ],
    tip: 'Si guardas el recibo o foto de la factura, puedes adjuntarlo para que todos tengan claro qué se compró.',
  },
  {
    id: 'custom-split',
    categoryId: 'expenses',
    question: '¿Cómo divido un gasto si no todos aportamos lo mismo?',
    summary:
      'Al crear o editar un gasto, puedes elegir si se reparte en partes iguales o con porcentajes a medida.',
    steps: [
      'En el formulario del gasto, ve a la sección ¿Cómo se divide?.',
      'Elige Partes iguales (50 / 50) si se reparte por igual, o Personalizado si alguien asume una parte diferente.',
      'Si eliges personalizado, ajusta el porcentaje o monto exacto que le corresponde a cada quien.',
    ],
    tip: 'KOPAR calcula automáticamente cuánto le toca poner a cada persona para que nadie haga cuentas a mano.',
  },
  {
    id: 'default-rule',
    categoryId: 'expenses',
    question: '¿Qué es la regla predeterminada de gastos?',
    summary:
      'Es la forma en que KOPAR dividirá automáticamente tus gastos cada vez que abras el formulario, para ahorrarte tiempo.',
    steps: [
      'Abre la pestaña Hogar.',
      'Busca el selector Regla predeterminada de gastos.',
      'Elige entre Partes iguales (50 / 50) (ideal si siempre pagan mitades) o Personalizado por gasto (si cada compra se divide diferente).',
    ],
    tip: 'Aunque tengas una regla fija, siempre podrás cambiar la división en un gasto individual cuando lo necesites.',
  },
  {
    id: 'understand-balance',
    categoryId: 'balances',
    question: '¿Qué significan «Balance neto», «Debes» y «Te deben»?',
    summary:
      'Es el termómetro de tus finanzas en casa. Te dice de forma transparente quién ha puesto dinero y quién debe ponerse al día.',
    steps: [
      'Balance neto (en grande): Es la diferencia final entre lo que te deben y lo que debes. Si está en verde, tienes saldo a favor; si está en rojo, tienes pagos pendientes.',
      'Debes: La suma de tus partes en compras que pagaron otros integrantes del hogar.',
      'Te deben: El dinero que tú pagaste de tu bolsillo y que los demás deben reponerte.',
    ],
    tip: 'Cuando el balance neto marca $0, ¡felicitaciones!, el hogar está completamente en paz y nadie le debe a nadie.',
  },
  {
    id: 'settle-up',
    categoryId: 'settle',
    question: '¿Cómo registro un pago cuando le transfiero dinero a alguien?',
    summary:
      'Cuando le hagas una transferencia o le des efectivo a un integrante para saldar tu parte, anótalo en KOPAR para descontarlo del balance.',
    steps: [
      'Toca el botón Saldar cuentas (o Liquidar) en las acciones rápidas de la pantalla principal.',
      'Elige quién entrega el dinero y quién lo recibe.',
      'Confirma el valor pagado y toca Registrar pago.',
    ],
    tip: 'Al registrar el pago, los balances de ambos se actualizan de inmediato y la deuda queda saldada en el historial.',
  },
  {
    id: 'banking-clarification',
    categoryId: 'settle',
    question: '¿KOPAR descuenta dinero de mi banco o hace transferencias automáticas?',
    summary:
      'No. KOPAR es tu libreta inteligente de acuerdos y convivencia, no una cuenta bancaria.',
    steps: [
      'Tú y tus compañeros hacen las transferencias reales como de costumbre (por Nequi, Daviplata, Bancolombia o efectivo).',
      'Luego, entran a KOPAR y tocan Saldar cuentas para avisarle a la app que el pago ya se hizo.',
      'KOPAR descuenta la deuda para que todo quede en limpio y sin confusiones.',
    ],
    tip: 'KOPAR no te pide claves de bancos ni cobra comisiones; su misión es mantener la transparencia y la paz en el hogar.',
  },
];

const GLOSSARY_ITEMS = [
  {
    term: 'Balance neto',
    definition:
      'La resta final entre lo que te deben y lo que debes, que te muestra si tienes plata a favor o por pagar.',
  },
  {
    term: 'Debes',
    definition: 'El total acumulado de tu parte en compras que otros pagaron por ti.',
  },
  {
    term: 'Te deben',
    definition: 'El dinero que pagaste completo de tu bolsillo y tus compañeros deben reponerte.',
  },
  {
    term: 'Quedar en paz (Saldar)',
    definition:
      'Registrar que ya se hizo la transferencia entre ustedes para dejar las deudas en cero.',
  },
  {
    term: 'Tu parte',
    definition:
      'El porcentaje o monto exacto que te corresponde asumir de un gasto compartido.',
  },
  {
    term: 'Regla predeterminada',
    definition:
      'La opción que la app selecciona por defecto (mitades o personalizada) al crear un gasto.',
  },
  {
    term: 'Gasto compartido',
    definition: 'Cualquier compra o factura del hogar asumida entre dos o más integrantes.',
  },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(ARTICLES[0].id);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.categoryId === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        article.question.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tip.toLowerCase().includes(query) ||
        article.steps.some((step) => step.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, selectedCategory]);

  const filteredGlossary = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'glossary') {
      return [];
    }
    if (!searchQuery.trim()) return GLOSSARY_ITEMS;
    const query = searchQuery.toLowerCase();
    return GLOSSARY_ITEMS.filter(
      (item) =>
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const toggleArticle = (id: string) => {
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop sutil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0a0b0d]/40"
        />

        {/* Modal Contenedor Plano (Design System: rounded-[24px], border 1px #dedfe2, bg #ffffff, sin sombras) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#ffffff] rounded-[24px] border border-[#dedfe2] z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 bg-[#ffffff] shrink-0 space-y-1">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[18px] sm:text-[20px] font-semibold text-[#0a0b0d] leading-tight">
                Centro de ayuda
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#5b616e] hover:text-[#0a0b0d] hover:bg-[#f7f8f9] transition-colors cursor-pointer shrink-0 -mr-1"
                aria-label="Cerrar ayuda"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[14px] text-[#5b616e] leading-snug w-full">
              Guías sencillas para llevar las cuentas en paz
            </p>
          </div>

          {/* Search Input & Filter Tags Integrados */}
          <div className="px-6 pb-4 bg-[#ffffff] shrink-0 space-y-3">
            {/* Buscador minimalista */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#5b616e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar preguntas, palabras clave o dudas..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-[#ffffff] border border-[#dedfe2] text-[14px] text-[#0a0b0d] placeholder-[#5b616e] focus:outline-hidden focus:border-[#0052ff] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5b616e] hover:text-[#0a0b0d] cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Filter Tags oficiales */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-[2px] pb-[6px]">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#0052ff] text-[#ffffff]'
                        : 'bg-[#ffffff] text-[#5b616e] border border-[#dedfe2] hover:border-[#0a0b0d]/30'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divisor estructural */}
          <div className="h-[1px] bg-[#dedfe2] w-full shrink-0" />

          {/* Contenido Plano: Acordeones con divisores sutiles (Cero Cards Anidadas) */}
          <div className="px-6 py-2 overflow-y-auto grow divide-y divide-[#dedfe2]">
            {/* Artículos de soporte */}
            {selectedCategory !== 'glossary' && (
              <>
                {filteredArticles.length === 0 && filteredGlossary.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <HelpCircle className="w-9 h-9 text-[#8a919e] mx-auto mb-2 opacity-60" />
                    <p className="text-[15px] font-semibold text-[#0a0b0d]">No encontramos resultados</p>
                    <p className="text-[13px] text-[#5b616e] mt-1">
                      Intenta con palabras cotidianas como «dividir», «balance», «50/50», «transferir» o «invitar».
                    </p>
                  </div>
                ) : (
                  filteredArticles.map((article) => {
                    const isExpanded = expandedArticleId === article.id;
                    return (
                      <div key={article.id} className="py-4">
                        {/* Fila Acordeón */}
                        <button
                          onClick={() => toggleArticle(article.id)}
                          className="w-full text-left flex items-start justify-between gap-4 group cursor-pointer"
                        >
                          <span
                            className={`font-display text-[15px] sm:text-[16px] font-semibold transition-colors ${
                              isExpanded ? 'text-[#0052ff]' : 'text-[#0a0b0d] group-hover:text-[#0052ff]'
                            }`}
                          >
                            {article.question}
                          </span>
                          <span
                            className={`w-5 h-5 flex items-center justify-center shrink-0 text-[#5b616e] transition-transform duration-200 mt-0.5 ${
                              isExpanded ? 'rotate-180 text-[#0052ff]' : ''
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </span>
                        </button>

                        {/* Despliegue de Contenido */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden pt-3 space-y-3.5 text-[#5b616e]"
                            >
                              <p className="text-[14px] leading-relaxed text-[#5b616e]">
                                {article.summary}
                              </p>

                              {/* Pasos limpios */}
                              <div className="space-y-2 pt-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a919e]">
                                  Paso a paso
                                </span>
                                <ol className="space-y-2">
                                  {article.steps.map((step, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#0a0b0d]">
                                      <span className="w-5 h-5 rounded-full bg-[#f7f8f9] border border-[#dedfe2] text-[#0a0b0d] text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                        {idx + 1}
                                      </span>
                                      <span className="leading-snug">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {/* Tip con icono Info */}
                              <div className="flex items-start gap-2.5 p-3 rounded-[8px] bg-[#f7f8f9] border border-[#dedfe2]">
                                <Info className="w-4 h-4 text-[#0052ff] shrink-0 mt-0.5" />
                                <p className="text-[13px] text-[#5b616e] leading-snug">
                                  <strong className="text-[#0a0b0d] font-semibold">Consejo útil: </strong>
                                  {article.tip}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* Sección Glosario */}
            {(selectedCategory === 'all' || selectedCategory === 'glossary') && filteredGlossary.length > 0 && (
              <div className="pt-6 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0052ff]" />
                  <h3 className="font-display text-[15px] font-semibold text-[#0a0b0d]">
                    Glosario amigable
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {filteredGlossary.map((item, idx) => (
                    <div key={idx} className="py-2 border-b border-[#dedfe2]/60 last:border-none">
                      <p className="text-[14px] font-semibold text-[#0a0b0d]">
                        {item.term}
                      </p>
                      <p className="text-[13px] text-[#5b616e] leading-relaxed mt-0.5">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Minimalista */}
          <div className="px-6 py-4 border-t border-[#dedfe2] bg-[#ffffff] shrink-0">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#0052ff] hover:bg-[#0045d8] text-[#ffffff] text-[14px] font-semibold transition-colors cursor-pointer text-center"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
