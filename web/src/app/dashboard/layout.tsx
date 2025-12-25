import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Providers from '@/components/Providers';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export const metadata = {
  title: "لوحة التحكم - Secret CFW",
  description: "لوحة تحكم الإداريين في Secret CFW",
};

const adminRoles = ['REVIEWER', 'SENIOR_REVIEWER', 'SUPERVISOR', 'ADMIN'];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in or not admin
  if (!session || !session.user?.role || !adminRoles.includes(session.user.role)) {
    redirect('/');
  }

  return (
    <Providers>
      <div className="flex min-h-screen">
        <DashboardSidebar userRole={session.user.role} />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </Providers>
  );
}
