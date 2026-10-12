"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ blogs: 0, projects: 0, categories: 0 });

  useEffect(() => {
    // In a real app we would fetch count from APIs
    const fetchData = async () => {
      try {
        const [blogRes, projRes] = await Promise.all([
          fetch("/api/blogs"),
          fetch("/api/projects")
        ]);
        let blogs = await blogRes.json();
        let projects = await projRes.json();
        
        if (!Array.isArray(blogs)) blogs = [];
        if (!Array.isArray(projects)) projects = [];
        
        const categories = new Set(projects.map(p => p.category)).size;

        setStats({ blogs: blogs.length, projects: projects.length, categories });
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6">
          <div className="size-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">article</span>
          </div>
          <div>
            <p className="text-4xl font-black">{stats.blogs}</p>
            <p className="text-muted tracking-wide text-sm font-bold uppercase mt-1">Total Blogs</p>
          </div>
        </div>
        
        <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6">
          <div className="size-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">folder</span>
          </div>
          <div>
            <p className="text-4xl font-black">{stats.projects}</p>
            <p className="text-muted tracking-wide text-sm font-bold uppercase mt-1">Total Projects</p>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-white/5 flex items-center gap-6">
          <div className="size-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl">category</span>
          </div>
          <div>
            <p className="text-4xl font-black">{stats.categories}</p>
            <p className="text-muted tracking-wide text-sm font-bold uppercase mt-1">Categories</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/blog?action=new" className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">add</span> Add New Blog
        </Link>
        <Link href="/admin/projects?action=new" className="bg-surface hover:bg-white/10 border border-white/5 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">add</span> Add New Project
        </Link>
        <Link href="/admin/media" className="bg-surface hover:bg-white/10 border border-white/5 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">upload</span> Upload Media
        </Link>
        <Link href="/admin/services" className="bg-surface hover:bg-white/10 border border-white/5 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">workspace_premium</span> Manage Service Certificates
        </Link>
      </div>
    </div>
  );
}
