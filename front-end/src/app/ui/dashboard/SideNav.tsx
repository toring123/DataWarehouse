// app/ui/dashboard/sidenav.tsx hoặc components/Sidebar.js

import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Sales', href: '/dashboard/sales' },
  { label: 'Storages', href: '/dashboard/storages' },
  { label: 'Table', href: '/dashboard/table'}
];

export default function SideNav() {
  return (
    <nav className="h-full bg-gray-900 text-white w-64 flex flex-col py-8 px-4">
      <div className="mb-8 text-2xl font-bold">Admin Panel</div>
      <ul className="flex-1 space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block py-2 px-3 rounded hover:bg-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
