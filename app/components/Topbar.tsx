import { Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="bg-white border-b border-b-pink-600 px-6 py-4 flex justify-end">
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
      </div>
    </header>
  );
}
