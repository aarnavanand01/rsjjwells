'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Profile } from '@/lib/types';
import { LogOut, Search, Trash2, Edit2, Users, TrendingUp, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminDashboard() {
  const router = useRouter();
  const { profile, loading, signOut, isAdmin } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, adminCount: 0, regularUsers: 0 });
  const [usersLoading, setUsersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter((u) => u.id !== userId));
      setDeleteConfirm(null);
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'USER') => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
      
      // Update stats
      if (newRole === 'ADMIN') {
        setStats(prev => ({
          ...prev,
          adminCount: prev.adminCount + 1,
          regularUsers: prev.regularUsers - 1,
        }));
      } else {
        setStats(prev => ({
          ...prev,
          adminCount: prev.adminCount - 1,
          regularUsers: prev.regularUsers + 1,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center space-y-4">
          <TrendingUp className="w-8 h-8 text-gold mx-auto animate-spin" />
          <p className="text-richblack-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-6">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="font-playfair text-3xl text-richblack">Access Denied</h1>
          <p className="text-richblack-muted">You don't have admin permissions.</p>
          <Button onClick={() => router.push('/')} className="btn-gold">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-4xl text-richblack mb-2">Admin Dashboard</h1>
            <p className="text-richblack-muted">Manage users and system settings</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-4 text-sm font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Total Users</span>
                <Users className="w-5 h-5 text-gold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-richblack">{stats.totalUsers}</p>
              <p className="text-sm text-richblack-muted mt-2">Active user accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Administrators</span>
                <Shield className="w-5 h-5 text-gold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-richblack">{stats.adminCount}</p>
              <p className="text-sm text-richblack-muted mt-2">Admin accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Regular Users</span>
                <TrendingUp className="w-5 h-5 text-gold" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-richblack">{stats.regularUsers}</p>
              <p className="text-sm text-richblack-muted mt-2">Customer accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products" className="btn-gold text-center py-3 rounded-lg">
            Manage Products
          </Link>
          <Link href="/admin/rates" className="btn-gold text-center py-3 rounded-lg">
            Manage Rates
          </Link>
          <Button variant="outline" className="py-3">
            View Orders
          </Button>
          <Button variant="outline" className="py-3">
            Generate Report
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage all user accounts</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-richblack-muted" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="text-center py-8">
                <TrendingUp className="w-6 h-6 text-gold mx-auto mb-2 animate-spin" />
                <p className="text-richblack-muted">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-richblack-muted">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value as 'ADMIN' | 'USER')
                            }
                            disabled={profile?.id === user.id}
                            className="px-2 py-1 border border-cream-deep rounded text-sm font-medium text-richblack bg-white hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </TableCell>
                        <TableCell className="text-sm text-richblack-muted">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {profile?.id !== user.id && (
                              <button
                                onClick={() =>
                                  deleteConfirm === user.id
                                    ? handleDeleteUser(user.id)
                                    : setDeleteConfirm(user.id)
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  deleteConfirm === user.id
                                    ? 'bg-red-100 text-red-600'
                                    : 'hover:bg-cream-deep text-richblack'
                                }`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {deleteConfirm === user.id && (
                            <div className="mt-2 text-xs text-red-600 font-medium">
                              Click again to confirm
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
