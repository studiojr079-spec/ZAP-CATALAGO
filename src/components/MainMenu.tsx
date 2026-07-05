/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Briefcase, Folder, Palette, Menu } from 'lucide-react';

interface MainMenuProps {
  activeTab: 'dashboard' | 'products' | 'categories' | 'personalize' | 'more' | 'orders' | 'subscriptions' | 'admin';
  onChangeTab: (tab: 'dashboard' | 'products' | 'categories' | 'personalize' | 'more' | 'orders' | 'subscriptions' | 'admin') => void;
  unreadNotificationsCount?: number;
}

export default function MainMenu({ activeTab, onChangeTab, unreadNotificationsCount = 0 }: MainMenuProps) {
  const tabs = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'products', icon: <Briefcase className="w-5 h-5" />, label: 'Produtos' },
    { id: 'categories', icon: <Folder className="w-5 h-5" />, label: 'Categorias' },
    { id: 'personalize', icon: <Palette className="w-5 h-5" />, label: 'Personalizar' },
    { id: 'more', icon: <Menu className="w-5 h-5" />, label: 'Menu' }
  ];

  return (
    <nav
      id="bottom-navbar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#090909] border-t border-white/10 pt-3 pb-2.5 px-3 flex flex-col justify-between items-center"
    >
      {/* Tabs Row */}
      <div className="w-full flex justify-around items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id || 
            (tab.id === 'more' && ['orders', 'subscriptions', 'admin', 'tutorials', 'finance'].includes(activeTab));

          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => onChangeTab(tab.id as any)}
              className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 group"
            >
              <div
                className={`relative transition-colors duration-200 ${
                  isActive ? 'text-[#FF2D7A]' : 'text-gray-400 group-hover:text-gray-400'
                }`}
              >
                {tab.icon}

                {/* Notification badge for the 'more' (Menu) tab */}
                {tab.id === 'more' && unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#FF2D7A] text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>

              <span
                className={`text-[12px] font-medium tracking-tight font-sans transition-colors ${
                  isActive ? 'text-[#FF2D7A]' : 'text-[#8E8E93] group-hover:text-gray-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Simulation Bar */}
      <div className="w-36 h-1 bg-gray-300 rounded-full mt-3.5 mb-0.5" />
    </nav>
  );
}
