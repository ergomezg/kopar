import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_EXPENSES, 
  INITIAL_HOUSEHOLD, 
  INITIAL_MEMBERS 
} from './data';
import { 
  ActiveTab, 
  Category, 
  Expense, 
  Household, 
  Member, 
  SplitType 
} from './types';

// Components
import { Header } from './components/Header';
import { BalanceCard } from './components/BalanceCard';
import { QuickActions } from './components/QuickActions';
import { RecentActivity } from './components/RecentActivity';
import { BottomNavigation } from './components/BottomNavigation';

// Tabs
import { ActividadTab } from './components/tabs/ActividadTab';
import { PresupuestoTab } from './components/tabs/PresupuestoTab';
import { HogarTab } from './components/tabs/HogarTab';

// Modals
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { InviteModal } from './components/modals/InviteModal';
import { SettleModal } from './components/modals/SettleModal';
import { ExpenseDetailModal } from './components/modals/ExpenseDetailModal';
import { HelpModal } from './components/modals/HelpModal';

// Auth Components
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { AuthScreen } from './components/auth/AuthScreen';
import { OnboardingWizard, OnboardingData } from './components/auth/OnboardingWizard';
import { ConnectivityBanner } from './components/ui/ConnectivityBanner';

export default function App() {
  // Auth Flow State ('welcome' | 'onboarding' | 'login' | 'signup' | 'authenticated')
  const [authView, setAuthView] = useState<'welcome' | 'onboarding' | 'login' | 'signup' | 'authenticated'>(() => {
    const savedStatus = localStorage.getItem('splithome_auth_status');
    return savedStatus === 'authenticated' ? 'authenticated' : 'welcome';
  });

  // LocalStorage persistence helpers with sanitization for 1-admin rule and Alex removal
  const [household, setHousehold] = useState<Household>(() => {
    const saved = localStorage.getItem('splithome_household');
    if (saved) {
      try {
        const parsed: Household = JSON.parse(saved);
        let foundAdmin = false;
        const filteredMembers = (parsed.members?.filter((m) => !m.name.toLowerCase().includes('alex') && m.id !== 'user_1') || []).map((m) => {
          let role = m.role;
          if (role === 'admin') {
            if (!foundAdmin) {
              foundAdmin = true;
            } else {
              role = 'member';
            }
          }
          return {
            ...m,
            role,
            name: m.name === 'Natalia' ? 'Natalia Gómez' : m.name === 'Mateo' ? 'Mateo Morales' : m.name,
          };
        });

        if (filteredMembers.length > 0) {
          if (!foundAdmin) {
            filteredMembers[0].role = 'admin';
          }
          const sanitizedName = parsed.name === 'SplitHome' || parsed.name === 'DUOPAY+' ? 'KOPAR' : (parsed.name || 'KOPAR');
          return { ...parsed, name: sanitizedName, members: filteredMembers };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HOUSEHOLD;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('splithome_members');
    if (saved) {
      try {
        const parsed: Member[] = JSON.parse(saved);
        let foundAdmin = false;
        const filtered = parsed
          .filter((m) => !m.name.toLowerCase().includes('alex') && m.id !== 'user_1')
          .map((m) => {
            let role = m.role;
            if (role === 'admin') {
              if (!foundAdmin) {
                foundAdmin = true;
              } else {
                role = 'member';
              }
            }
            return {
              ...m,
              role,
              name: m.name === 'Natalia' ? 'Natalia Gómez' : m.name === 'Mateo' ? 'Mateo Morales' : m.name,
            };
          });

        if (filtered.length > 0) {
          if (!foundAdmin) {
            filtered[0].role = 'admin';
          }
          return filtered;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEMBERS;
  });

  const [currentMember, setCurrentMember] = useState<Member>(() => {
    const saved = localStorage.getItem('splithome_current_member');
    if (saved) {
      try {
        const parsed: Member = JSON.parse(saved);
        if (!parsed.name.toLowerCase().includes('alex') && parsed.id !== 'user_1') {
          return {
            ...parsed,
            name: parsed.name === 'Natalia' ? 'Natalia Gómez' : parsed.name === 'Mateo' ? 'Mateo Morales' : parsed.name,
          };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEMBERS[0];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('splithome_categories');
    if (saved) {
      try {
        const parsed: Category[] = JSON.parse(saved);
        // Check if saved categories match new taxonomy
        const hasTaxonomy = parsed.some((c) => c.id === 'cat_fijos' || c.subcategories?.length > 0);
        if (hasTaxonomy) {
          // Merge with INITIAL_CATEGORIES to ensure subcategories and definitions are up to date
          return INITIAL_CATEGORIES.map((initCat) => {
            const existing = parsed.find((p) => p.id === initCat.id);
            return existing ? { ...initCat, budgetLimit: existing.budgetLimit } : initCat;
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('splithome_expenses');
    if (saved) {
      try {
        const parsed: Expense[] = JSON.parse(saved);
        return parsed.map((exp) => {
          // Map legacy category IDs if any
          let catId = exp.categoryId;
          let subcat = exp.subcategory;
          if (catId === 'cat_1') { catId = 'cat_ocasionales'; subcat = subcat || 'Cena restaurante'; }
          else if (catId === 'cat_2') { catId = 'cat_fijos'; subcat = subcat || 'Internet hogar'; }
          else if (catId === 'cat_3') { catId = 'cat_fijos'; subcat = subcat || 'Arriendo / Hipoteca'; }
          else if (catId === 'cat_4') { catId = 'cat_recurrentes'; subcat = subcat || 'Paseador mascotas'; }
          else if (catId === 'cat_5') { catId = 'cat_recurrentes'; subcat = subcat || 'Streaming video'; }

          return {
            ...exp,
            categoryId: catId,
            subcategory: subcat,
            paidById: exp.paidById === 'user_1' ? 'user_2' : exp.paidById,
            splits: exp.splits.map((s) => ({
              ...s,
              memberId: s.memberId === 'user_1' ? 'user_2' : s.memberId,
            })),
          };
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_EXPENSES;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');

  // Modal Visibility States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Scroll to Y:0 whenever activeTab or authView changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab, authView]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('splithome_household', JSON.stringify(household));
  }, [household]);

  useEffect(() => {
    localStorage.setItem('splithome_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('splithome_current_member', JSON.stringify(currentMember));
  }, [currentMember]);

  useEffect(() => {
    localStorage.setItem('splithome_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('splithome_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Handlers
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleUpdateExpense = (expenseId: string, updatedData: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === expenseId
          ? {
              ...e,
              ...updatedData,
            }
          : e
      )
    );
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
  };

  const handleTransferAdmin = (newAdminMemberId: string) => {
    const updatedMembers = members.map((m) => ({
      ...m,
      role: m.id === newAdminMemberId ? ('admin' as const) : ('member' as const),
    }));
    setMembers(updatedMembers);
    setHousehold((prev) => ({
      ...prev,
      members: prev.members.map((m) => ({
        ...m,
        role: m.id === newAdminMemberId ? ('admin' as const) : ('member' as const),
      })),
    }));
    setCurrentMember((prev) => ({
      ...prev,
      role: prev.id === newAdminMemberId ? 'admin' : 'member',
    }));
  };

  const handleInviteMember = (email: string, name: string) => {
    // Business rule: only 1 admin allowed. Any new member is strictly a 'member'.
    const newMember: Member = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: 'member',
      status: 'pending',
    };
    setMembers((prev) => [...prev, newMember]);
    setHousehold((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
  };

  const handleDeleteMember = (memberId: string) => {
    // Cannot delete the only admin
    const target = members.find((m) => m.id === memberId);
    if (target?.role === 'admin') {
      return;
    }
    const updated = members.filter((m) => m.id !== memberId);
    setMembers(updated);
    setHousehold((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));

    if (currentMember.id === memberId) {
      const adminMember = updated.find((m) => m.role === 'admin') || updated[0];
      if (adminMember) {
        setCurrentMember(adminMember);
      }
    }
  };

  const handleUpdateCategoryBudget = (categoryId: string, newLimit: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, budgetLimit: newLimit } : c))
    );
  };

  const handleUpdateAllCategoryBudgets = (updatedBudgets: Record<string, number>) => {
    setCategories((prev) =>
      prev.map((c) =>
        updatedBudgets[c.id] !== undefined
          ? { ...c, budgetLimit: updatedBudgets[c.id] }
          : c
      )
    );
  };

  const handleUpdateHouseholdName = (newName: string) => {
    setHousehold((prev) => ({ ...prev, name: newName }));
  };

  const handleUpdateSplitRule = (rule: SplitType) => {
    setHousehold((prev) => ({ ...prev, defaultSplitRule: rule }));
  };

  const handleUpdateCurrency = (curr: string) => {
    setHousehold((prev) => ({ ...prev, currency: curr }));
  };

  const handleUpdateCoverImage = (newCoverUrl: string) => {
    setHousehold((prev) => ({ ...prev, coverImage: newCoverUrl }));
  };

  const handleSettlePeriod = (settlementNote: string) => {
    // Mark all pending expenses as PAGADO / Conciliados
    setExpenses((prev) =>
      prev.map((e) => ({ ...e, status: 'PAGADO' as const }))
    );
  };

  const handleResetData = () => {
    localStorage.clear();
    setHousehold(INITIAL_HOUSEHOLD);
    setMembers(INITIAL_MEMBERS);
    setCurrentMember(INITIAL_MEMBERS[0]);
    setCategories(INITIAL_CATEGORIES);
    setExpenses(INITIAL_EXPENSES);
    setAuthView('welcome');
  };

  const handleAuthSuccess = (userData: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'member';
    householdName?: string;
    currency?: string;
  }) => {
    // Check if user already exists
    const existingIndex = members.findIndex((m) => m.email.toLowerCase() === userData.email.toLowerCase());
    if (existingIndex >= 0) {
      setCurrentMember(members[existingIndex]);
    } else {
      if (userData.role === 'admin') {
        const normalizedMembers = members.map((m) => ({ ...m, role: 'member' as const }));
        const newMember: Member = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: 'admin',
          status: 'active',
        };
        setMembers([newMember, ...normalizedMembers]);
        setCurrentMember(newMember);
        setHousehold((prev) => ({
          ...prev,
          members: [newMember, ...prev.members.map((m) => ({ ...m, role: 'member' as const }))],
        }));
      } else {
        const newMember: Member = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          role: 'member',
          status: 'active',
        };
        setMembers((prev) => [newMember, ...prev]);
        setCurrentMember(newMember);
        setHousehold((prev) => ({
          ...prev,
          members: [newMember, ...prev.members],
        }));
      }
    }

    if (userData.householdName) {
      setHousehold((prev) => ({ ...prev, name: userData.householdName! }));
    }

    if (userData.currency) {
      setHousehold((prev) => ({ ...prev, currency: userData.currency! }));
    }

    localStorage.setItem('splithome_auth_status', 'authenticated');
    setAuthView('authenticated');
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    // Generate initial-based generic avatar if none provided
    const getInitialsAvatar = (name: string) => {
      const cleanName = name.trim() || 'Usuario';
      const initials = cleanName
        .split(/\s+/)
        .map((p) => p.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();
      // Clean SVG Data URI matching KOPAR design tokens (#eef0f3 background, #0052ff text)
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="100%" height="100%" fill="%23eef0f3"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="52" font-weight="700" fill="%230052ff">${initials}</text></svg>`;
      return `data:image/svg+xml;utf8,${svg}`;
    };

    // 1. Create admin member
    const adminAvatar = data.creatorAvatar || getInitialsAvatar(data.creatorName);
    const adminMember: Member = {
      id: `user_${Date.now()}`,
      name: data.creatorName,
      email: data.creatorEmail,
      avatar: adminAvatar,
      role: 'admin',
      status: 'active',
    };

    // 2. Create invited members with generic initial avatars
    const invitedMembersList: Member[] = data.invitedMembers.map((inv, idx) => ({
      id: `user_${Date.now() + idx + 1}`,
      name: inv.name,
      email: inv.email,
      avatar: getInitialsAvatar(inv.name),
      role: 'member',
      status: 'active',
    }));

    const allHouseholdMembers: Member[] = [adminMember, ...invitedMembersList];

    // 3. Update Household
    const newHousehold: Household = {
      id: `hh_${Date.now()}`,
      name: data.householdName,
      code: `KOPAR-${Math.floor(1000 + Math.random() * 9000)}`,
      currency: data.currency,
      defaultSplitRule: data.defaultSplitRule || '50_50',
      createdDate: new Date().toISOString().split('T')[0],
      members: allHouseholdMembers,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    };

    // 4. Update Categories with Budget if provided
    if (data.budget && data.budget.categories.length > 0) {
      setCategories((prevCategories) =>
        prevCategories.map((cat) => {
          const allocation = data.budget?.categories.find((c) => c.categoryId === cat.id);
          if (allocation && allocation.amount > 0) {
            return {
              ...cat,
              budgetLimit: allocation.amount,
            };
          }
          return cat;
        })
      );
    }

    // 5. Initial Expense if provided
    let newExpenses: Expense[] = [];
    if (data.initialExpense && data.initialExpense.amount > 0) {
      const payer = data.initialExpense.paidBy === 'creator' ? adminMember : (invitedMembersList[0] || adminMember);
      const splitAmount = Math.round(data.initialExpense.amount / allHouseholdMembers.length);
      const firstExpense: Expense = {
        id: `exp_${Date.now()}`,
        title: data.initialExpense.title,
        amount: data.initialExpense.amount,
        categoryId: data.initialExpense.categoryId || 'cat_fijos',
        subcategory: 'Gasto inicial',
        paidById: payer.id,
        date: new Date().toISOString().split('T')[0],
        status: 'PAGADO',
        splits: allHouseholdMembers.map((m) => ({
          memberId: m.id,
          amount: splitAmount,
          percentage: Math.round(100 / allHouseholdMembers.length),
        })),
        createdAt: new Date().toISOString(),
      };
      newExpenses = [firstExpense];
    }

    setHousehold(newHousehold);
    setMembers(allHouseholdMembers);
    setCurrentMember(adminMember);
    setExpenses(newExpenses);
    setActiveTab('inicio');

    // Immediate synchronous write to localStorage to guarantee data persistence
    localStorage.setItem('splithome_household', JSON.stringify(newHousehold));
    localStorage.setItem('splithome_members', JSON.stringify(allHouseholdMembers));
    localStorage.setItem('splithome_current_member', JSON.stringify(adminMember));
    localStorage.setItem('splithome_expenses', JSON.stringify(newExpenses));
    localStorage.setItem('splithome_auth_status', 'authenticated');
    setAuthView('authenticated');
  };

  const handleLogout = () => {
    localStorage.setItem('splithome_auth_status', 'logged_out');
    setAuthView('welcome');
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('splithome_auth_status', 'authenticated');
    setAuthView('authenticated');
  };

  // Render Auth Views if not authenticated
  if (authView === 'welcome') {
    return (
      <WelcomeScreen
        onGoToLogin={() => setAuthView('login')}
        onGoToSignup={() => setAuthView('onboarding')}
        onContinueAsGuest={handleContinueAsGuest}
      />
    );
  }

  if (authView === 'onboarding') {
    return (
      <OnboardingWizard
        onBackToWelcome={() => setAuthView('welcome')}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (authView === 'login' || authView === 'signup') {
    return (
      <AuthScreen
        initialMode={authView}
        onBackToWelcome={() => setAuthView('welcome')}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0a0b0d] flex flex-col font-sans selection:bg-[#0052ff] selection:text-[#ffffff]">
      {/* Real-time offline / online connectivity banner */}
      <ConnectivityBanner />

      {/* Top Header App Bar */}
      <Header
        currentMember={currentMember}
        allMembers={members}
        onSwitchUser={(m) => setCurrentMember(m)}
        onOpenInvite={() => setIsInviteOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content View Port depending on active tab */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        {activeTab === 'inicio' && (
          <div className="animate-in fade-in duration-150">
            {/* Balance Card Hero */}
            <BalanceCard
              currentMember={currentMember}
              expenses={expenses}
              currency={household.currency}
              householdName={household.name}
              onOpenSettleModal={() => setIsSettleOpen(true)}
              coverImage={household.coverImage}
              onUpdateCoverImage={handleUpdateCoverImage}
            />

            {/* Quick Actions Buttons */}
            <QuickActions
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
              onOpenInvite={() => setIsInviteOpen(true)}
              onOpenSettleModal={() => setIsSettleOpen(true)}
            />

            {/* Recent Activity List */}
            <RecentActivity
              expenses={expenses}
              categories={categories}
              members={members}
              currentMember={currentMember}
              currency={household.currency}
              onSelectExpense={(exp) => setSelectedExpense(exp)}
              onViewAll={() => setActiveTab('actividad')}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />
          </div>
        )}

        {activeTab === 'actividad' && (
          <div className="animate-in fade-in duration-150">
            <ActividadTab
              expenses={expenses}
              categories={categories}
              members={members}
              currentMember={currentMember}
              currency={household.currency}
              onSelectExpense={(exp) => setSelectedExpense(exp)}
              onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            />
          </div>
        )}

        {activeTab === 'presupuesto' && (
          <div className="animate-in fade-in duration-150">
            <PresupuestoTab
              categories={categories}
              expenses={expenses}
              currency={household.currency}
              onUpdateCategoryBudget={handleUpdateCategoryBudget}
              onUpdateAllBudgets={handleUpdateAllCategoryBudgets}
            />
          </div>
        )}

        {activeTab === 'hogar' && (
          <div className="animate-in fade-in duration-150">
            <HogarTab
              household={household}
              currentMember={currentMember}
              onOpenInvite={() => setIsInviteOpen(true)}
              onUpdateHouseholdName={handleUpdateHouseholdName}
              onUpdateSplitRule={handleUpdateSplitRule}
              onUpdateCurrency={handleUpdateCurrency}
              onResetData={handleResetData}
              onLogout={handleLogout}
              onDeleteMember={handleDeleteMember}
              onTransferAdmin={handleTransferAdmin}
            />
          </div>
        )}
      </main>

      {/* Floating Help Button (FAB) positioned above the bottom navbar on the bottom right */}
      <div className="fixed bottom-[72px] right-4 sm:right-[max(1rem,calc(50%-240px))] z-30">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsHelpOpen(true)}
          className="w-10 h-10 sm:w-11 sm:h-11 p-0 pb-0 rounded-full bg-[#ffffff] border border-[#dedfe2] text-[#5b616e] hover:text-[#0052ff] hover:border-[#0052ff]/40 shadow-md hover:shadow-lg flex items-center justify-center transition-colors cursor-pointer group"
          title="Centro de ayuda y preguntas frecuentes"
          aria-label="Ayuda"
        >
          <HelpCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
        </motion.button>
      </div>

      {/* Bottom Sticky Navigation Bar */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Modals & Sheets */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setEditingExpense(null);
        }}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        initialExpense={editingExpense}
        categories={categories}
        members={members}
        currentMember={currentMember}
        currency={household.currency}
      />

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        household={household}
        onInviteMember={handleInviteMember}
      />

      <SettleModal
        isOpen={isSettleOpen}
        onClose={() => setIsSettleOpen(false)}
        expenses={expenses}
        members={members}
        currentMember={currentMember}
        currency={household.currency}
        onSettlePeriod={handleSettlePeriod}
      />

      <ExpenseDetailModal
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
        onEditExpense={(exp) => {
          setSelectedExpense(null);
          setEditingExpense(exp);
          setIsAddExpenseOpen(true);
        }}
        onDeleteExpense={handleDeleteExpense}
        categories={categories}
        members={members}
        currency={household.currency}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
