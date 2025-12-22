
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { NAV_ITEMS } from '@/config/GlobalVariableConfig';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SidebarMenu({ open, onClose }: SidebarMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out font-outfit">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">Menu</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item: any) => (
                <div key={item.label}>
                    {item.children ? (
                        <div className="space-y-2">
                            <div className="px-4 py-2 font-bold text-gray-500 uppercase text-xs tracking-wider">
                                {item.label}
                            </div>
                            {item.children.map((child: any) => (
                                <Link
                                    key={child.label}
                                    to={child.href}
                                    onClick={onClose}
                                    className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium ml-4"
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <Link
                            to={item.href}
                            onClick={onClose}
                            className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-bold"
                        >
                            {item.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
      </div>
    </div>
  );
}
