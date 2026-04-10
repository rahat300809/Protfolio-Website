import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  BookOpen,
  FileText,
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  Cpu,
  Upload,
  User,
  Calendar,
  Info,
  File,
  Zap,
  LogOut,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { certificates, researchItems, blogPosts, portfolioSettings, projects as demoProjects, skillCategories as demoSkills } from '../data/mockData';
import { Project, SkillCategory, SkillItem, LifeEvent, WorkExperience, Research, Certificate, BlogPost, QuickInfo } from '../types';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

import { auth, storage } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, User as FirebaseUser } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const { settings, updateSettings, settingsLoading, projects, setProjects, saveProject, deleteProjectItem, skillCategories, saveSkillCategory, deleteSkillCategoryItem, lifeEvents, saveLifeEvent, deleteLifeEventItem, workExperiences, saveWorkExperience, deleteWorkExperienceItem, researchItems, saveResearchItem, deleteResearchItem, certificates, saveCertificate, deleteCertificateItem, blogPosts, saveBlogPost, deleteBlogPostItem, quickInfos, saveQuickInfo, deleteQuickInfoItem } = usePortfolio();

  const handleRestoreDemoData = async () => {
    if (!window.confirm("Are you sure? This will add all demo projects and skills to your live portfolio. Existing items with the same ID will be overwritten.")) return;
    try {
      for (const p of demoProjects) {
        await saveProject(p);
      }
      for (const s of demoSkills) {
        await saveSkillCategory(s);
      }
      alert("Demo data restored successfully! Refresh the page if you don't see the changes immediately.");
    } catch (err) {
      console.error(err);
      alert("Error restoring demo data. See console for details.");
    }
  };
  const [activeTab, setActiveTab] = useState('dashboard');

  // Project Management States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectImageUploading, setProjectImageUploading] = useState(false);

  // Skill Management States
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ categoryId: string, skill: SkillItem } | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  // Event Management States
  const [editingEvent, setEditingEvent] = useState<LifeEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventImageUploading, setEventImageUploading] = useState(false);

  // Experience Management States
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [experienceLogoUploading, setExperienceLogoUploading] = useState(false);

  // Research Management States
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [researchImageUploading, setResearchImageUploading] = useState(false);

  // Certificate Management States
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateImageUploading, setCertificateImageUploading] = useState(false);

  // Blog Management States
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogImageUploading, setBlogImageUploading] = useState(false);

  // Quick Info Management States
  const [editingQuickInfo, setEditingQuickInfo] = useState<QuickInfo | null>(null);
  const [isQuickInfoModalOpen, setIsQuickInfoModalOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(settings.profileImage);
  const [name, setName] = useState(settings.name);
  const [title, setTitle] = useState(settings.title);
  const [bio, setBio] = useState(settings.bio);
  const [cvUrl, setCvUrl] = useState(settings.cvUrl || '');
  const [cvUploading, setCvUploading] = useState(false);
  const [aboutText, setAboutText] = useState(settings.aboutText || '');
  const [aboutImage, setAboutImage] = useState(settings.aboutImage || '');
  const [blogVideoUrl, setBlogVideoUrl] = useState(settings.blogVideoUrl || '');
  const [projectsCompleted, setProjectsCompleted] = useState<number | string>(settings.stats?.projectsCompleted ?? 150);
  const [happyClients, setHappyClients] = useState<number | string>(settings.stats?.happyClients ?? 1200);
  const [yearsExperience, setYearsExperience] = useState<number | string>(settings.stats?.yearsExperience ?? 12);
  const [satisfactionRate, setSatisfactionRate] = useState<number | string>(settings.stats?.satisfactionRate ?? 98);
  const [githubUrl, setGithubUrl] = useState(settings.socialLinks?.github || '');
  const [linkedinUrl, setLinkedinUrl] = useState(settings.socialLinks?.linkedin || '');
  const [xUrl, setXUrl] = useState(settings.socialLinks?.x || '');
  const [dribbbleUrl, setDribbbleUrl] = useState(settings.socialLinks?.dribbble || '');
  const [aboutImageUploading, setAboutImageUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(settings.isMaintenanceMode || false);

  const toggleMaintenanceMode = async () => {
    const newVal = !isMaintenanceMode;
    setIsMaintenanceMode(newVal);
    try {
      await updateSettings({ ...settings, isMaintenanceMode: newVal });
    } catch (e) {
      console.error(e);
      setIsMaintenanceMode(!newVal);
    }
  };

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // Security Settings
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setResetMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setLoginError(error.message || 'Failed to login');
      if (error.code === 'auth/invalid-credential') {
        setLoginError('Invalid email or password.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setLoginError('Please enter your email address to reset your password.');
      return;
    }
    setLoginError('');
    setResetMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      setLoginError(error.message || 'Failed to send password reset email.');
      if (error.code === 'auth/user-not-found') {
        setLoginError('No user found with this email address.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 aspect-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-display font-bold mb-2">Admin Login</h1>
            <p className="text-slate-400">Sign in to manage your portfolio</p>
          </div>
          {loginError && <p className="text-rose-400 text-sm mb-4 text-center">{loginError}</p>}
          {resetMessage && <p className="text-emerald-400 text-sm mb-4 text-center">{resetMessage}</p>}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-emerald-400 hover:underline">Forgot Password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <button type="submit" className="glass-button w-full justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold border-transparent py-3 transition-colors">
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center relative z-10">
            <Link to="/" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">Return to Portfolio</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to webp base64 (very small size)
          const base64String = canvas.toDataURL('image/webp', 0.8);
          setProfileImage(base64String);
          setImageUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Image upload failed. Please try again.');
      setImageUploading(false);
    }
  };

  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingEvent) return;

    setEventImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const base64String = canvas.toDataURL('image/webp', 0.8);
          setEditingEvent({ ...editingEvent, image: base64String });
          setEventImageUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Image upload failed.');
      setEventImageUploading(false);
    }
  };

  const handleGenericImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUploading: (v: boolean) => void, onComplete: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const base64String = canvas.toDataURL('image/webp', 0.8);
          onComplete(base64String);
          setUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image compression failed:', err);
      alert('Image upload failed.');
      setUploading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller PDF.");
      return;
    }

    setCvUploading(true);
    try {
      const storageRef = ref(storage, `cv/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error("Upload failed", error);
          alert("CV upload failed. Please try again.");
          setCvUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setCvUrl(downloadURL);
          setCvUploading(false);
        }
      );
    } catch (err) {
      console.error('CV upload failed:', err);
      alert('CV upload failed.');
      setCvUploading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await updateSettings({ 
        name, title, bio, profileImage, cvUrl, aboutText, aboutImage, blogVideoUrl,
        stats: {
          projectsCompleted: Number(projectsCompleted),
          happyClients: Number(happyClients),
          yearsExperience: Number(yearsExperience),
          satisfactionRate: Number(satisfactionRate)
        },
        socialLinks: {
          github: githubUrl,
          linkedin: linkedinUrl,
          x: xUrl,
          dribbble: dribbbleUrl
        }
      });
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdateSecurity = async (type: 'email' | 'password') => {
    if (!user || !user.email) return;
    setSecurityMessage({ type: '', text: '' });

    if (!currentPassword) {
      setSecurityMessage({ type: 'error', text: 'Current password is required.' });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      if (type === 'email') {
        if (!newEmail) throw new Error('New email is required.');
        await updateEmail(user, newEmail);
        setSecurityMessage({ type: 'success', text: 'Email updated successfully.' });
        setNewEmail('');
      } else if (type === 'password') {
        if (!newPassword) throw new Error('New password is required.');
        await updatePassword(user, newPassword);
        setSecurityMessage({ type: 'success', text: 'Password updated successfully.' });
        setNewPassword('');
      }
      setCurrentPassword('');
    } catch (error: any) {
      console.error(error);
      setSecurityMessage({ type: 'error', text: error.message || `Failed to update ${type}` });
    }
  };

  const stats = [
    { name: 'Total Projects', value: projects.length, icon: Briefcase, color: 'text-emerald-400' },
    { name: 'Certificates', value: certificates.length, icon: GraduationCap, color: 'text-cyan-400' },
    { name: 'Research Papers', value: researchItems.length, icon: BookOpen, color: 'text-purple-400' },
    { name: 'Blog Posts', value: blogPosts.length, icon: FileText, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold text-sm">
            RM
          </div>
          <span className="font-display font-bold text-lg">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1">
            <LogOut size={16} /> Exit
          </Link>
          <button onClick={handleLogout} className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs">
            Logout
          </button>
        </div>
      </header>
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold">
            RM
          </div>
          <span className="font-display font-bold text-xl">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { id: 'projects', name: 'Projects', icon: Briefcase },
            { id: 'events', name: 'Events', icon: Calendar },
            { id: 'experience', name: 'Work Experience', icon: Briefcase },
            { id: 'skills', name: 'Skills', icon: Cpu },
            { id: 'aboutinfo', name: 'About Info', icon: Info },
            { id: 'certificates', name: 'Certificates', icon: GraduationCap },
            { id: 'research', name: 'Research', icon: BookOpen },
            { id: 'blog', name: 'Blog', icon: FileText },
            { id: 'cv', name: 'CV Generator', icon: FileText },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-slate-400 hover:bg-white/5"
                }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white transition-all w-full text-left">
            <LogOut size={18} />
            Return Home
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all w-full text-left">
            <LogOut size={18} />
            Exit Admin
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 py-2">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'projects', icon: Briefcase },
          { id: 'experience', icon: Briefcase },
          { id: 'events', icon: Calendar },
          { id: 'aboutinfo', icon: Info },
          { id: 'skills', icon: Cpu },
          { id: 'settings', icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === item.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-white'
              }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium capitalize">{item.id}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto pb-24 lg:pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold capitalize">{activeTab}</h1>
            <p className="text-slate-500">Manage your portfolio content and settings.</p>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl glass flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Stats</span>
                  </div>
                  <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
                  <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Recent Projects</h3>
                  <button onClick={() => setActiveTab('projects')} className="text-emerald-400 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-sm">{p.title}</p>
                          <p className="text-slate-500 text-xs">{p.category}</p>
                        </div>
                      </div>
                      <button className="p-2 text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'Update CV', icon: FileText, actionTab: 'settings' },
                    { name: 'New Blog', icon: FileText, actionTab: 'blog' },
                    { name: 'Add Cert', icon: GraduationCap, actionTab: 'certificates' },
                    { name: 'Settings', icon: Settings, actionTab: 'settings' },
                  ].map((action) => (
                    <button
                      key={action.name}
                      onClick={() => setActiveTab(action.actionTab)}
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl glass hover:bg-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
                        <action.icon size={20} />
                      </div>
                      <span className="text-sm font-medium text-slate-400 group-hover:text-white">{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-8">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="glass-card p-8 group/cat">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{cat.category}</h3>
                  <div className="flex gap-2 opacity-100 md:opacity-0 group-hover/cat:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete category "${cat.category}"?`)) deleteSkillCategoryItem(cat.id); }}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-rose-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cat.skills.map((skill, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group/skill">
                      <div>
                        <p className="font-bold text-sm">{skill.name}</p>
                        <p className="text-emerald-400 text-xs font-bold">{skill.level}%</p>
                      </div>
                      <div className="flex gap-2 opacity-100 md:opacity-0 group-hover/skill:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingSkill({ categoryId: cat.id, skill }); setIsSkillModalOpen(true); }}
                          className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete skill "${skill.name}"?`)) {
                              const newCat = { ...cat, skills: cat.skills.filter((_, i) => i !== index) };
                              saveSkillCategory(newCat);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEditingSkill({ categoryId: cat.id, skill: { name: '', level: 50, tags: [] } });
                      setIsSkillModalOpen(true);
                    }}
                    className="p-4 rounded-xl border border-dashed border-white/10 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Skill
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setEditingCategory({ id: Date.now().toString(), category: 'Programming', skills: [] });
                setIsCategoryModalOpen(true);
              }}
              className="w-full py-4 rounded-2xl border border-dashed border-white/20 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Create New Skill Category
            </button>

            {isCategoryModalOpen && editingCategory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-6">
                  <h3 className="text-xl font-bold">Category</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Category Name</label>
                      <select
                        value={editingCategory.category}
                        onChange={e => setEditingCategory({ ...editingCategory, category: e.target.value as any })}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                      >
                        <option value="Programming">Programming</option>
                        <option value="Embedded Systems">Embedded Systems</option>
                        <option value="AI Tools">AI Tools</option>
                        <option value="Vibe Coding Tools">Vibe Coding Tools</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Research & Leadership">Research & Leadership</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-white/5">Cancel</button>
                    <button
                      onClick={() => { saveSkillCategory(editingCategory); setIsCategoryModalOpen(false); }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isSkillModalOpen && editingSkill && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 space-y-6">
                  <h3 className="text-xl font-bold">Skill</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Name</label>
                      <input
                        type="text"
                        value={editingSkill.skill.name}
                        onChange={e => setEditingSkill({ ...editingSkill, skill: { ...editingSkill.skill, name: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 flex justify-between">
                        <span>Proficiency Level</span>
                        <span className="text-emerald-400">{editingSkill.skill.level}%</span>
                      </label>
                      <input
                        type="range"
                        min="0" max="100"
                        value={editingSkill.skill.level}
                        onChange={e => setEditingSkill({ ...editingSkill, skill: { ...editingSkill.skill, level: parseInt(e.target.value) } })}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setIsSkillModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:bg-white/5">Cancel</button>
                    <button
                      onClick={() => {
                        const cat = skillCategories.find(c => c.id === editingSkill.categoryId);
                        if (cat) {
                          const existingIndex = cat.skills.findIndex(s => s.name === editingSkill.skill.name);
                          let newSkills = [...cat.skills];
                          if (existingIndex >= 0) newSkills[existingIndex] = editingSkill.skill;
                          else newSkills.push(editingSkill.skill);
                          saveSkillCategory({ ...cat, skills: newSkills });
                        }
                        setIsSkillModalOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                    >
                      Save Skill
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingEvent({
                    id: Date.now().toString(),
                    title: '',
                    cursiveTitle: '',
                    description: '',
                    image: '',
                    date: new Date().toISOString().split('T')[0],
                    category: 'Life Event'
                  });
                  setIsEventModalOpen(true);
                }}
                className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={18} /> Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifeEvents.map((event) => (
                <div key={event.id} className="glass-card overflow-hidden group">
                  <div className="h-48 relative overflow-hidden">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">No Image</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{event.category}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{event.date}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingEvent(event); setIsEventModalOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete event "${event.title}"?`)) {
                              deleteLifeEventItem(event.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {lifeEvents.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No events found. Add one to get started!</p>
                </div>
              )}
            </div>

            {isEventModalOpen && editingEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 md:p-8 space-y-6 my-auto">
                  <h3 className="text-2xl font-bold font-display">{editingEvent.id.length > 13 ? 'Edit' : 'New'} Event</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Event Title (Normal)</label>
                      <input
                        type="text"
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. Won Hackathon 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Cursive Lines (On My Life)</label>
                      <textarea
                        rows={2}
                        value={editingEvent.cursiveTitle || ''}
                        onChange={(e) => setEditingEvent({ ...editingEvent, cursiveTitle: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 text-cursive text-xl"
                        placeholder="e.g. A journey of growth..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Date</label>
                        <input
                          type="date"
                          value={editingEvent.date}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 [&::-webkit-calendar-picker-indicator]:invert"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Category</label>
                        <select
                          value={editingEvent.category}
                          onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                          className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 text-white"
                        >
                          <option value="Life Event">Life Event</option>
                          <option value="Achievement">Achievement</option>
                          <option value="Team Work">Team Work</option>
                          <option value="Research">Research</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Event Image</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-32 h-32 rounded-xl bg-white/5 border border-dashed border-white/20 overflow-hidden relative flex-shrink-0">
                          {editingEvent.image ? (
                            <img src={editingEvent.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Upload size={24} />
                            </div>
                          )}
                          {eventImageUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <label className="inline-block py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-medium cursor-pointer transition-colors text-center sm:text-left self-start">
                            Upload Image
                            <input type="file" className="hidden" accept="image/*" onChange={handleEventImageUpload} />
                          </label>
                          <p className="text-xs text-slate-500 mt-2">Recommended size: 800x600px max.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Description</label>
                      <textarea
                        rows={4}
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 resize-y min-h-[100px]"
                        placeholder="Describe the event..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => setIsEventModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!editingEvent.title) {
                          alert("Title is required");
                          return;
                        }
                        saveLifeEvent(editingEvent);
                        setIsEventModalOpen(false);
                      }}
                      disabled={eventImageUploading}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
                    >
                      Save Event
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User size={20} className="text-emerald-400" />
                Profile Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-400">Profile Image</p>
                  <div className="relative group">
                    <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden glass border-white/10">
                      <img
                        src={profileImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {imageUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-emerald-400 font-bold">Uploading...</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer p-3 rounded-full bg-emerald-500 text-slate-950 hover:scale-110 transition-transform">
                            <Upload size={20} />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-3">
                      <p className="text-[10px] text-slate-500 text-center">Recommended: 800x1000px (4:5 ratio)</p>
                      {profileImage !== portfolioSettings.profileImage && (
                        <button
                          onClick={() => setProfileImage(portfolioSettings.profileImage)}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:underline transition-colors"
                        >
                          Remove custom photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Professional Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Short Bio</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">About Section Text</label>
                    <textarea
                      rows={6}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 resize-y min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">About Section Image</label>
                    <div className="flex gap-4 items-center">
                      {aboutImage ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={aboutImage} className="w-full h-full object-cover" alt="About Preview" />
                          <button
                            onClick={() => setAboutImage('')}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                          {aboutImageUploading ? <Zap className="animate-spin text-emerald-400" /> : <Upload className="text-slate-500" />}
                        </div>
                      )}
                      <div className="flex-1">
                        <label className={`cursor-pointer inline-flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${aboutImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className="flex items-center gap-2">
                            <Upload size={16} />
                            {aboutImageUploading ? 'Uploading...' : 'Upload Image'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleGenericImageUpload(e, setAboutImageUploading, setAboutImage)}
                            disabled={aboutImageUploading}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Blog Video URL (Google Drive ID or Link)</label>
                    <input
                      type="text"
                      value={blogVideoUrl}
                      onChange={(e) => setBlogVideoUrl(e.target.value)}
                      placeholder="e.g. 1A2b3C4d5E6f7G8h9I0j or full link..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Custom CV/Resume (PDF)</label>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
                        <span className="truncate text-slate-300">
                          {cvUrl ? 'Custom CV Uploaded' : 'No custom CV. Auto-generator will be used.'}
                        </span>
                        {cvUrl && (
                          <div className="flex items-center gap-2">
                            <a href={cvUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">View</a>
                            <button onClick={() => setCvUrl('')} className="text-rose-400 hover:text-rose-300">Remove</button>
                          </div>
                        )}
                      </div>
                      <label className={`cursor-pointer shrink-0 inline-flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${cvUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                         <div className="flex items-center gap-2">
                            {cvUploading ? <Zap className="animate-spin text-emerald-400" size={16} /> : <File size={16} />}
                            {cvUploading ? 'Uploading...' : 'Upload PDF'}
                         </div>
                         <input
                           type="file"
                           accept="application/pdf"
                           className="hidden"
                           onChange={handleCVUpload}
                           disabled={cvUploading}
                         />
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-200">About Us Stats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Projects Completed</label>
                        <input type="number" value={projectsCompleted} onChange={(e) => setProjectsCompleted(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Happy Clients</label>
                        <input type="number" value={happyClients} onChange={(e) => setHappyClients(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Years Experience</label>
                        <input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Satisfaction Rate (%)</label>
                        <input type="number" value={satisfactionRate} onChange={(e) => setSatisfactionRate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-200">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">GitHub</label>
                        <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/yourusername" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">LinkedIn</label>
                        <input type="text" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourusername" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">X (Twitter)</label>
                        <input type="text" value={xUrl} onChange={(e) => setXUrl(e.target.value)} placeholder="https://x.com/yourusername" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Dribbble</label>
                        <input type="text" value={dribbbleUrl} onChange={(e) => setDribbbleUrl(e.target.value)} placeholder="https://dribbble.com/yourusername" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveSettings}
                      disabled={imageUploading || savingSettings}
                      className="glass-button bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingSettings ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" />
                Security Settings
              </h3>

              {securityMessage.text && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${securityMessage.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                  {securityMessage.text}
                </div>
              )}

              <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Current Password (Required for changes)</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">New Email Address</label>
                    <div className="flex gap-4">
                      <input
                        type="email"
                        value={newEmail}
                        placeholder={user?.email || "Enter new email"}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        onClick={() => handleUpdateSecurity('email')}
                        className="glass-button whitespace-nowrap bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        Update Email
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">New Password</label>
                    <div className="flex gap-4">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        onClick={() => handleUpdateSecurity('password')}
                        className="glass-button whitespace-nowrap bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings size={20} className="text-slate-400" />
                System Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-bold text-sm">Maintenance Mode</p>
                    <p className="text-slate-500 text-xs">Temporarily disable the public site.</p>
                  </div>
                  <div 
                    onClick={toggleMaintenanceMode}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors border ${
                      isMaintenanceMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-slate-800 border-transparent'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                      isMaintenanceMode ? 'right-1 bg-emerald-400' : 'left-1 bg-slate-500'
                    }`} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-bold text-sm">Email Notifications</p>
                    <p className="text-slate-500 text-xs">Receive alerts for new contact messages.</p>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-emerald-500/20 relative cursor-pointer border border-emerald-500/30">
                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="font-bold text-sm">Restore Demo Data</p>
                    <p className="text-slate-500 text-xs">Reset the database with initial template projects and skills.</p>
                  </div>
                  <button onClick={handleRestoreDemoData} className="px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 transition-colors text-xs whitespace-nowrap">
                    Restore Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Projects Management</h3>
              <button
                onClick={() => {
                  setEditingProject({
                    id: Date.now().toString(),
                    title: '', category: '', description: '', fullDescription: '',
                    technologies: [], features: [], status: 'Completed', image: '',
                    githubLink: '', linkedinLink: '', websiteLink: ''
                  });
                  setIsProjectModalOpen(true);
                }}
                className="glass-button flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              >
                <Plus size={18} /> Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <div key={p.id} className="glass-card p-6 flex flex-col h-full">
                  <div className="w-full aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <Briefcase size={32} />
                        <span className="text-xs mt-2">No Image</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-lg leading-tight">{p.title || 'Untitled'}</h4>
                  <p className="text-sm text-emerald-400 mb-2">{p.category || 'No Category'}</p>
                  <p className="text-sm text-slate-400 mb-6 flex-grow line-clamp-2">{p.description || 'No description provided.'}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingProject(p); setIsProjectModalOpen(true); }}
                      className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors flex justify-center items-center gap-2 text-sm"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete "${p.title}"?`)) deleteProjectItem(p.id); }}
                      className="flex-1 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors flex justify-center items-center gap-2 text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <p>No projects found. Create one to get started.</p>
                </div>
              )}
            </div>

            {isProjectModalOpen && editingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold">{editingProject.id.length > 20 ? 'Edit' : 'Add'} Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Title</label>
                      <input type="text" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Category</label>
                      <input type="text" value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-400">Short Description</label>
                      <textarea rows={2} value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 resize-none" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-400">Full Description</label>
                      <textarea rows={4} value={editingProject.fullDescription} onChange={e => setEditingProject({ ...editingProject, fullDescription: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Project Image</label>
                      <div className="flex gap-4 items-center">
                        {editingProject.image ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <img src={editingProject.image} className="w-full h-full object-cover" alt="Project Preview" />
                            <button
                              onClick={() => setEditingProject({ ...editingProject, image: '' })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                            {projectImageUploading ? <Zap className="animate-spin text-emerald-400" /> : <Upload className="text-slate-500" />}
                          </div>
                        )}
                        <div className="flex-1">
                          <label className={`cursor-pointer inline-flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${projectImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className="flex items-center gap-2">
                              <Upload size={16} />
                              {projectImageUploading ? 'Uploading...' : 'Upload Image'}
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleGenericImageUpload(e, setProjectImageUploading, (base64) => setEditingProject({ ...editingProject, image: base64 }))}
                              disabled={projectImageUploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Status</label>
                      <select value={editingProject.status} onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white">
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Research">Research</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">GitHub Link</label>
                      <input type="text" value={editingProject.githubLink || ''} onChange={e => setEditingProject({ ...editingProject, githubLink: e.target.value })} placeholder="https://github.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">LinkedIn Link</label>
                      <input type="text" value={editingProject.linkedinLink || ''} onChange={e => setEditingProject({ ...editingProject, linkedinLink: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Website Link</label>
                      <input type="text" value={editingProject.websiteLink || ''} onChange={e => setEditingProject({ ...editingProject, websiteLink: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-400">Technologies (comma separated)</label>
                      <input type="text" value={editingProject.technologies.join(', ')} onChange={e => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()).filter(p => p !== '') })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-400">Features (comma separated)</label>
                      <input type="text" value={editingProject.features.join(', ')} onChange={e => setEditingProject({ ...editingProject, features: e.target.value.split(',').map(s => s.trim()).filter(p => p !== '') })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-white/10">
                    <button onClick={() => setIsProjectModalOpen(false)} className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5">Cancel</button>
                    <button
                      onClick={() => { saveProject(editingProject); setIsProjectModalOpen(false); }}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cv' && (
          <div className="glass-card p-8 text-center py-20">
            <LayoutDashboard size={48} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h3>
            <p className="text-slate-500 mb-8">This section is under development in the admin panel.</p>
            <button className="glass-button mx-auto">
              <Plus size={18} /> Add New {activeTab === 'cv' ? 'Section' : activeTab.slice(0, -1)}
            </button>
          </div>
        )}
        {activeTab === 'aboutinfo' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingQuickInfo({
                    id: Date.now().toString(),
                    title: '',
                    subtitle: '',
                    icon: 'other',
                    description: ''
                  });
                  setIsQuickInfoModalOpen(true);
                }}
                className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={18} /> Add Quick Info
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickInfos.map((info) => (
                <div key={info.id} className="glass-card p-6 flex items-start justify-between group">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{info.title}</h3>
                    <p className="text-sm text-emerald-400 mb-2">{info.subtitle}</p>
                    <p className="text-sm text-slate-400 line-clamp-2">{info.description}</p>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded mt-3 inline-block font-mono text-slate-300">Icon: {info.icon}</span>
                  </div>
                  <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                    <button
                      onClick={() => { setEditingQuickInfo(info); setIsQuickInfoModalOpen(true); }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete info block "${info.title}"?`)) {
                          deleteQuickInfoItem(info.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {quickInfos.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <Info size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No quick info blocks found. Add one to show in the About section!</p>
                </div>
              )}
            </div>

            {isQuickInfoModalOpen && editingQuickInfo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 md:p-8 space-y-6 my-auto">
                  <h3 className="text-2xl font-bold font-display">{editingQuickInfo.id.length > 13 ? 'Edit' : 'New'} Quick Info Box</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Title</label>
                      <input
                        type="text"
                        value={editingQuickInfo.title}
                        onChange={(e) => setEditingQuickInfo({ ...editingQuickInfo, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. Education"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Subtitle</label>
                      <input
                        type="text"
                        value={editingQuickInfo.subtitle}
                        onChange={(e) => setEditingQuickInfo({ ...editingQuickInfo, subtitle: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. B.Sc. in CSE, DIU"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Icon</label>
                      <select
                        value={editingQuickInfo.icon}
                        onChange={(e) => setEditingQuickInfo({ ...editingQuickInfo, icon: e.target.value as any })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 [&>option]:bg-slate-900"
                      >
                        <option value="education">Education (Graduation Cap)</option>
                        <option value="focus">Focus (Briefcase)</option>
                        <option value="location">Location (Map Pin)</option>
                        <option value="experience">Experience (Calendar)</option>
                        <option value="other">Other (Info Circle)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Detailed Description (Popup on click)</label>
                      <textarea
                        value={editingQuickInfo.description}
                        onChange={(e) => setEditingQuickInfo({ ...editingQuickInfo, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 min-h-[120px]"
                        placeholder="Detailed info that appears when user clicks this box..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsQuickInfoModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveQuickInfo(editingQuickInfo);
                        setIsQuickInfoModalOpen(false);
                      }}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Save Quick Info
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingCertificate({
                    id: Date.now().toString(),
                    title: '',
                    organization: '',
                    image: ''
                  });
                  setIsCertificateModalOpen(true);
                }}
                className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={18} /> Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="glass-card overflow-hidden group">
                  <div className="h-48 relative overflow-hidden">
                    {cert.image ? (
                      <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{cert.title}</h3>
                    <p className="text-sm text-emerald-400 mb-4">{cert.organization}</p>
                    <div className="flex items-center justify-end text-xs text-slate-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingCertificate(cert); setIsCertificateModalOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete certificate "${cert.title}"?`)) {
                              deleteCertificateItem(cert.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {certificates.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <GraduationCap size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No certificates found. Add one to get started!</p>
                </div>
              )}
            </div>

            {isCertificateModalOpen && editingCertificate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 md:p-8 space-y-6 my-auto">
                  <h3 className="text-2xl font-bold font-display">{editingCertificate.id.length > 13 ? 'Edit' : 'New'} Certificate</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Certificate Title</label>
                      <input
                        type="text"
                        value={editingCertificate.title}
                        onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. AWS Certified Developer"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Organization</label>
                      <input
                        type="text"
                        value={editingCertificate.organization}
                        onChange={(e) => setEditingCertificate({ ...editingCertificate, organization: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. Amazon Web Services"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Certificate Image</label>
                      <div className="flex gap-4 items-center">
                        {editingCertificate.image ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <img src={editingCertificate.image} className="w-full h-full object-cover" alt="Certificate Preview" />
                            <button
                              onClick={() => setEditingCertificate({ ...editingCertificate, image: '' })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                            {certificateImageUploading ? <Zap className="animate-spin text-emerald-400" /> : <Upload className="text-slate-500" />}
                          </div>
                        )}
                        <div className="flex-1">
                          <label className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${certificateImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload size={18} />
                            {certificateImageUploading ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleGenericImageUpload(e, setCertificateImageUploading, (base64) => setEditingCertificate({ ...editingCertificate, image: base64 }))}
                              disabled={certificateImageUploading}
                            />
                          </label>
                          <p className="text-xs text-slate-500 mt-2">Recommended: clear image of the certificate.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsCertificateModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveCertificate(editingCertificate);
                        setIsCertificateModalOpen(false);
                      }}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Save Certificate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingResearch({
                    id: Date.now().toString(),
                    title: '',
                    authors: '',
                    abstract: '',
                    publicationDate: '',
                    link: '',
                    image: '',
                    githubLink: '',
                    linkedinLink: '',
                    websiteLink: ''
                  });
                  setIsResearchModalOpen(true);
                }}
                className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={18} /> Add Research
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchItems.map((research) => (
                <div key={research.id} className="glass-card overflow-hidden group">
                  <div className="h-48 relative overflow-hidden">
                    {research.image ? (
                      <img src={research.image} alt={research.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{research.title}</h3>
                    <p className="text-sm text-emerald-400 mb-4">{research.authors}</p>
                    <div className="flex items-center justify-end text-xs text-slate-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingResearch(research); setIsResearchModalOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete research "${research.title}"?`)) {
                              deleteResearchItem(research.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {researchItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No research found. Add one to get started!</p>
                </div>
              )}
            </div>

            {isResearchModalOpen && editingResearch && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 my-auto">
                  <h3 className="text-2xl font-bold font-display">{editingResearch.id.length > 13 ? 'Edit' : 'New'} Research</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Title</label>
                      <input
                        type="text"
                        value={editingResearch.title}
                        onChange={(e) => setEditingResearch({ ...editingResearch, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. A Deep Dive into IoT Security"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Authors</label>
                        <input
                          type="text"
                          value={editingResearch.authors}
                          onChange={(e) => setEditingResearch({ ...editingResearch, authors: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="e.g. Rahat Mahamud, John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Publication Date</label>
                        <input
                          type="text"
                          value={editingResearch.publicationDate}
                          onChange={(e) => setEditingResearch({ ...editingResearch, publicationDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="e.g. Fall 2024"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Link URL</label>
                      <input
                        type="text"
                        value={editingResearch.link}
                        onChange={(e) => setEditingResearch({ ...editingResearch, link: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. https://doi.org/..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">GitHub Link</label>
                        <input
                          type="text"
                          value={editingResearch.githubLink || ''}
                          onChange={(e) => setEditingResearch({ ...editingResearch, githubLink: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">LinkedIn Link</label>
                        <input
                          type="text"
                          value={editingResearch.linkedinLink || ''}
                          onChange={(e) => setEditingResearch({ ...editingResearch, linkedinLink: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Website Link</label>
                        <input
                          type="text"
                          value={editingResearch.websiteLink || ''}
                          onChange={(e) => setEditingResearch({ ...editingResearch, websiteLink: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Abstract</label>
                      <textarea
                        value={editingResearch.abstract}
                        onChange={(e) => setEditingResearch({ ...editingResearch, abstract: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 min-h-[100px]"
                        placeholder="Research abstract..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Research Image</label>
                      <div className="flex gap-4 items-center">
                        {editingResearch.image ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <img src={editingResearch.image} className="w-full h-full object-cover" alt="Research Preview" />
                            <button
                              onClick={() => setEditingResearch({ ...editingResearch, image: '' })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                            {researchImageUploading ? <Zap className="animate-spin text-emerald-400" /> : <Upload className="text-slate-500" />}
                          </div>
                        )}
                        <div className="flex-1">
                          <label className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${researchImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload size={18} />
                            {researchImageUploading ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleGenericImageUpload(e, setResearchImageUploading, (base64) => setEditingResearch({ ...editingResearch, image: base64 }))}
                              disabled={researchImageUploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsResearchModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveResearchItem(editingResearch);
                        setIsResearchModalOpen(false);
                      }}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Save Research
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingBlog({
                    id: Date.now().toString(),
                    title: '',
                    summary: '',
                    content: '',
                    publishedAt: '',
                    readTime: '',
                    image: '',
                    link: ''
                  });
                  setIsBlogModalOpen(true);
                }}
                className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={18} /> Add Blog Post
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((blog) => (
                <div key={blog.id} className="glass-card overflow-hidden group">
                  <div className="h-48 relative overflow-hidden">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">No Image</div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{blog.summary}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{blog.publishedAt}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingBlog(blog); setIsBlogModalOpen(true); }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete blog post "${blog.title}"?`)) {
                              deleteBlogPostItem(blog.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {blogPosts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No blog posts found. Add one to get started!</p>
                </div>
              )}
            </div>

            {isBlogModalOpen && editingBlog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 my-auto">
                  <h3 className="text-2xl font-bold font-display">{editingBlog.id.length > 13 ? 'Edit' : 'New'} Blog Post</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Title</label>
                      <input
                        type="text"
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. My Coding Journey"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Published Date</label>
                        <input
                          type="text"
                          value={editingBlog.publishedAt}
                          onChange={(e) => setEditingBlog({ ...editingBlog, publishedAt: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="e.g. October 12, 2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Read Time</label>
                        <input
                          type="text"
                          value={editingBlog.readTime}
                          onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="e.g. 5 min read"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">External Link (Optional)</label>
                      <input
                        type="text"
                        value={editingBlog.link || ''}
                        onChange={(e) => setEditingBlog({ ...editingBlog, link: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. https://medium.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Summary</label>
                      <textarea
                        value={editingBlog.summary}
                        onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 min-h-[80px]"
                        placeholder="Short description..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Content (Markdown supported)</label>
                      <textarea
                        value={editingBlog.content}
                        onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 min-h-[150px]"
                        placeholder="Blog content..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Cover Image</label>
                      <div className="flex gap-4 items-center">
                        {editingBlog.image ? (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                            <img src={editingBlog.image} className="w-full h-full object-cover" alt="Blog Preview" />
                            <button
                              onClick={() => setEditingBlog({ ...editingBlog, image: '' })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-lg border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                            {blogImageUploading ? <Zap className="animate-spin text-emerald-400" /> : <Upload className="text-slate-500" />}
                          </div>
                        )}
                        <div className="flex-1">
                          <label className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${blogImageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload size={18} />
                            {blogImageUploading ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleGenericImageUpload(e, setBlogImageUploading, (base64) => setEditingBlog({ ...editingBlog, image: base64 }))}
                              disabled={blogImageUploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsBlogModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveBlogPost(editingBlog);
                        setIsBlogModalOpen(false);
                      }}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Save Blog Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingExperience({
                    id: Date.now().toString(),
                    role: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                  });
                  setIsExperienceModalOpen(true);
                }}
                className="py-2 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2 font-bold"
              >
                <Plus size={18} /> Add Experience
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workExperiences.map((exp) => (
                <div key={exp.id} className="glass-card p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {exp.logo ? (
                          <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="text-slate-600 text-[10px] text-center p-1">No Logo</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{exp.role}</h3>
                        <p className="text-emerald-400 font-medium">{exp.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingExperience(exp); setIsExperienceModalOpen(true); }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete experience "${exp.role}"?`)) {
                            deleteWorkExperienceItem(exp.id);
                          }
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar size={14} />
                    <span>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}

              {workExperiences.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No work experiences found. Add one to get started!</p>
                </div>
              )}
            </div>

            {isExperienceModalOpen && editingExperience && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
                <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 md:p-8 space-y-6 my-auto">
                  <h3 className="text-2xl font-bold font-display">{editingExperience.id.length > 13 ? 'Edit' : 'New'} Experience</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Role / Job Title</label>
                      <input
                        type="text"
                        value={editingExperience.role}
                        onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. Frontend Developer"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Company</label>
                      <input
                        type="text"
                        value={editingExperience.company}
                        onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                        placeholder="e.g. Google"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Company Logo</label>
                      <div className="flex gap-4 items-center">
                        {editingExperience.logo ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/10">
                            <img src={editingExperience.logo} className="w-full h-full object-contain bg-white/5 p-2" alt="Company Logo" />
                            <button
                              onClick={() => setEditingExperience({ ...editingExperience, logo: '' })}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full border border-dashed border-white/20 bg-white/5 flex items-center justify-center shrink-0">
                            {experienceLogoUploading ? <Zap className="animate-spin text-emerald-400" /> : <Upload className="text-slate-500" />}
                          </div>
                        )}
                        <div className="flex-1">
                          <label className={`cursor-pointer w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${experienceLogoUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload size={16} />
                            {experienceLogoUploading ? 'Uploading...' : 'Upload Logo'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleGenericImageUpload(e, setExperienceLogoUploading, (base64) => setEditingExperience({ ...editingExperience, logo: base64 }))}
                              disabled={experienceLogoUploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Start Date</label>
                        <input
                          type="text"
                          value={editingExperience.startDate}
                          onChange={(e) => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="e.g. Jan 2020"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">End Date</label>
                        <input
                          type="text"
                          value={editingExperience.endDate}
                          onChange={(e) => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50"
                          placeholder="e.g. Present"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Description</label>
                      <textarea
                        value={editingExperience.description}
                        onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 min-h-[120px]"
                        placeholder="Key responsibilities and achievements..."
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsExperienceModalOpen(false)}
                      className="px-6 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        saveWorkExperience(editingExperience);
                        setIsExperienceModalOpen(false);
                      }}
                      className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Save Experience
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
