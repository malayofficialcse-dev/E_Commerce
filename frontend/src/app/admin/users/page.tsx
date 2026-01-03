"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  User as UserIcon,
  Trash2,
  Ban
} from "lucide-react";

interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your user base and permissions.</p>
        </div>
        
        <div className="relative w-full md:w-96">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
           <input 
             type="text" 
             placeholder="Search customers..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-muted border border-border rounded-xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
           />
        </div>
      </div>

      <div className="bg-background rounded-[32px] border border-border shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-20 text-center text-muted-foreground font-bold">Loading Users...</div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left py-4 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                  <th className="text-right py-4 px-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                </tr>
               </thead>
              <tbody className="divide-y divide-border">
                 {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase">
                            {user.firstName[0]}{user.lastName[0]}
                         </div>
                         <div>
                            <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                               <Mail size={10} />
                               {user.email}
                            </div>
                         </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${
                         user.role === 'admin' 
                           ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                           : 'bg-muted text-muted-foreground'
                       }`}>
                          {user.role === 'admin' ? <Shield size={10} /> : <UserIcon size={10} />}
                          {user.role}
                       </span>
                    </td>
                     <td className="py-4 px-6 text-sm font-medium text-muted-foreground">
                       {/* Ensure consistent date formatting or client-side only render */}
                        <span suppressHydrationWarning>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                     </td>
                    <td className="py-4 px-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                             <Ban size={16} />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
