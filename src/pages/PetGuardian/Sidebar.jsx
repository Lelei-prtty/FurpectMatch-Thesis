import React from 'react';
import { LogOut, User, X } from 'lucide-react';
import logo from '../../Assets/logo.svg';

const SideBar = ({
  activeTab,
  onNavClick,
  sidebarOpen,
  setSidebarOpen,
  navigationItems = [],
}) => {

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-200 shadow-xl transition-all duration-300 md:static md:translate-x-0 md:shadow-none ${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 md:w-20 md:translate-x-0'
        }`}
      >
        <div className="flex min-h-18 items-center justify-between border-b border-gray-200 px-3 py-4 sm:px-4 sm:py-6">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center w-full'}`}>
            <div className="flex items-center">
              <img
                src={logo}
                alt="FurpectMatch Logo"
                className="h-10 w-auto object-contain md:h-12 lg:h-14"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 hover:bg-gray-100 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavClick(item.id)}
                className={`relative flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-100 font-semibold text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onNavClick('profile')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              activeTab === 'profile' ? 'bg-purple-100 font-semibold text-purple-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Profile</span>}
          </button>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
