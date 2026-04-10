import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, SkillCategory, PortfolioSettings, LifeEvent, WorkExperience, Research, Certificate, BlogPost, QuickInfo } from '../types';
import { portfolioSettings as initialSettings, projects as initialProjects, skillCategories as initialSkills, researchItems as initialResearch, certificates as initialCertificates, blogPosts as initialBlogPosts, quickInfos as initialQuickInfos } from '../data/mockData';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

interface PortfolioContextType {
  settings: PortfolioSettings;
  updateSettings: (newSettings: Partial<PortfolioSettings>) => Promise<void>;
  settingsLoading: boolean;

  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  saveProject: (project: Project) => Promise<void>;
  deleteProjectItem: (id: string) => Promise<void>;

  skillCategories: SkillCategory[];
  setSkillCategories: React.Dispatch<React.SetStateAction<SkillCategory[]>>;
  saveSkillCategory: (category: SkillCategory) => Promise<void>;
  deleteSkillCategoryItem: (id: string) => Promise<void>;

  lifeEvents: LifeEvent[];
  setLifeEvents: React.Dispatch<React.SetStateAction<LifeEvent[]>>;
  saveLifeEvent: (event: LifeEvent) => Promise<void>;
  deleteLifeEventItem: (id: string) => Promise<void>;

  workExperiences: WorkExperience[];
  setWorkExperiences: React.Dispatch<React.SetStateAction<WorkExperience[]>>;
  saveWorkExperience: (exp: WorkExperience) => Promise<void>;
  deleteWorkExperienceItem: (id: string) => Promise<void>;

  researchItems: Research[];
  setResearchItems: React.Dispatch<React.SetStateAction<Research[]>>;
  saveResearchItem: (item: Research) => Promise<void>;
  deleteResearchItem: (id: string) => Promise<void>;

  certificates: Certificate[];
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>;
  saveCertificate: (cert: Certificate) => Promise<void>;
  deleteCertificateItem: (id: string) => Promise<void>;

  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  saveBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPostItem: (id: string) => Promise<void>;

  quickInfos: QuickInfo[];
  setQuickInfos: React.Dispatch<React.SetStateAction<QuickInfo[]>>;
  saveQuickInfo: (info: QuickInfo) => Promise<void>;
  deleteQuickInfoItem: (id: string) => Promise<void>;

  isCVOpen: boolean;
  setIsCVOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const SETTINGS_DOC = doc(db, 'portfolio', 'settings');

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PortfolioSettings>(initialSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isCVOpen, setIsCVOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(initialSkills);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [researchItems, setResearchItems] = useState<Research[]>(initialResearch);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [quickInfos, setQuickInfos] = useState<QuickInfo[]>(initialQuickInfos);

  useEffect(() => {
    if (settings.profileImage) {
      const createCircularFavicon = async () => {
        try {
          const img = new Image();
          // To prevent CORS issues if using an external URL
          img.crossOrigin = "anonymous"; 
          img.src = settings.profileImage;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });

          const size = 120; // Favicon size
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Clear canvas and clip into a circle
          ctx.clearRect(0, 0, size, size);
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          
          // Draw image to cover the circle
          const scale = Math.max(size / img.width, size / img.height);
          const x = (size - img.width * scale) / 2;
          const y = (size - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = canvas.toDataURL("image/png");
        } catch (error) {
          console.error("Failed to generate circular favicon", error);
          let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = settings.profileImage;
        }
      };

      createCircularFavicon();
    }
  }, [settings.profileImage]);

  // Load settings from Firestore on first render
  useEffect(() => {
    getDoc(SETTINGS_DOC).then((snap) => {
      if (snap.exists()) {
        setSettings({ ...initialSettings, ...(snap.data() as Partial<PortfolioSettings>) });
      }
    }).catch((err) => {
    }).catch((err) => {
      console.warn('Failed to load settings from Firestore, using defaults:', err);
    }).finally(() => setSettingsLoading(false));

    // Load projects
    getDocs(collection(db, 'portfolio/data/projects')).then((snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map(doc => doc.data() as Project));
      }
    }).catch(err => {
      console.error('Failed to load projects:', err);
    });

    // Load skill categories
    getDocs(collection(db, 'portfolio/data/skills')).then((snap) => {
      if (!snap.empty) {
        setSkillCategories(snap.docs.map(doc => doc.data() as SkillCategory));
      }
    }).catch(err => {
      console.error('Failed to load skills:', err);
    });

    // Load life events
    getDocs(collection(db, 'portfolio/data/events')).then((snap) => {
      if (!snap.empty) {
        setLifeEvents(snap.docs.map(doc => doc.data() as LifeEvent));
      }
    }).catch(err => {
      console.error('Failed to load events:', err);
    });

    // Load work experience
    getDocs(collection(db, 'portfolio/data/experience')).then((snap) => {
      if (!snap.empty) {
        setWorkExperiences(snap.docs.map(doc => doc.data() as WorkExperience));
      }
    });

    // Load research
    getDocs(collection(db, 'portfolio/data/research')).then((snap) => {
      if (!snap.empty) {
        setResearchItems(snap.docs.map(doc => doc.data() as Research));
      }
    });

    // Load certificates
    getDocs(collection(db, 'portfolio/data/certificates')).then((snap) => {
      if (!snap.empty) {
        setCertificates(snap.docs.map(doc => doc.data() as Certificate));
      }
    });

    // Load blog posts
    getDocs(collection(db, 'portfolio/data/blog')).then((snap) => {
      if (!snap.empty) {
        setBlogPosts(snap.docs.map(doc => doc.data() as BlogPost));
      }
    });

    // Load quick infos
    getDocs(collection(db, 'portfolio/data/quickInfos')).then((snap) => {
      if (!snap.empty) {
        setQuickInfos(snap.docs.map(doc => doc.data() as QuickInfo));
      }
    });
  }, []);

  const updateSettings = async (newSettings: Partial<PortfolioSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      await setDoc(SETTINGS_DOC, merged, { merge: true });
    } catch (err) {
      console.error('Failed to save settings to Firestore:', err);
    }
  };

  const saveProject = async (project: Project) => {
    console.log('Saving project:', project);
    setProjects(prev => {
      const exists = prev.find(p => p.id === project.id);
      if (exists) return prev.map(p => p.id === project.id ? project : p);
      return [...prev, project];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/projects', project.id), project);
      console.log('Project saved successfully');
    } catch (err) {
      console.error('Failed to save project:', err);
      // Rollback or show error? For now just log.
    }
  };

  const deleteProjectItem = async (id: string) => {
    console.log('Deleting project:', id);
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'portfolio/data/projects', id));
      console.log('Project deleted successfully');
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const saveSkillCategory = async (category: SkillCategory) => {
    console.log('Saving skill category:', category);
    setSkillCategories(prev => {
      const exists = prev.find(c => c.id === category.id);
      if (exists) return prev.map(c => c.id === category.id ? category : c);
      return [...prev, category];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/skills', category.id), category);
      console.log('Skill category saved successfully');
    } catch (err) {
      console.error('Failed to save skill category:', err);
    }
  };

  const deleteSkillCategoryItem = async (id: string) => {
    setSkillCategories(prev => prev.filter(c => c.id !== id));
    await deleteDoc(doc(db, 'portfolio/data/skills', id));
  };

  const saveLifeEvent = async (event: LifeEvent) => {
    console.log('Saving life event:', event);
    setLifeEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) return prev.map(e => e.id === event.id ? event : e);
      return [...prev, event];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/events', event.id), event);
      console.log('Life event saved successfully');
    } catch (err) {
      console.error('Failed to save life event:', err);
    }
  };

  const deleteLifeEventItem = async (id: string) => {
    setLifeEvents(prev => prev.filter(e => e.id !== id));
    await deleteDoc(doc(db, 'portfolio/data/events', id));
  };

  const saveWorkExperience = async (exp: WorkExperience) => {
    console.log('Saving work experience:', exp);
    setWorkExperiences(prev => {
      const exists = prev.find(e => e.id === exp.id);
      if (exists) return prev.map(e => e.id === exp.id ? exp : e);
      return [...prev, exp];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/experience', exp.id), exp);
      console.log('Work experience saved successfully');
    } catch (err) {
      console.error('Failed to save work experience:', err);
    }
  };

  const deleteWorkExperienceItem = async (id: string) => {
    console.log('Deleting work experience:', id);
    setWorkExperiences(prev => prev.filter(e => e.id !== id));
    try {
      await deleteDoc(doc(db, 'portfolio/data/experience', id));
      console.log('Work experience deleted successfully');
    } catch (err) {
      console.error('Failed to delete work experience:', err);
    }
  };

  const saveResearchItem = async (item: Research) => {
    console.log('Saving research item:', item);
    setResearchItems(prev => {
      const exists = prev.find(e => e.id === item.id);
      if (exists) return prev.map(e => e.id === item.id ? item : e);
      return [...prev, item];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/research', item.id), item);
      console.log('Research item saved successfully');
    } catch (err) {
      console.error('Failed to save research item:', err);
    }
  };

  const deleteResearchItem = async (id: string) => {
    setResearchItems(prev => prev.filter(e => e.id !== id));
    await deleteDoc(doc(db, 'portfolio/data/research', id));
  };

  const saveCertificate = async (cert: Certificate) => {
    console.log('Saving certificate:', cert);
    setCertificates(prev => {
      const exists = prev.find(e => e.id === cert.id);
      if (exists) return prev.map(e => e.id === cert.id ? cert : e);
      return [...prev, cert];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/certificates', cert.id), cert);
      console.log('Certificate saved successfully');
    } catch (err) {
      console.error('Failed to save certificate:', err);
    }
  };

  const deleteCertificateItem = async (id: string) => {
    setCertificates(prev => prev.filter(e => e.id !== id));
    await deleteDoc(doc(db, 'portfolio/data/certificates', id));
  };

  const saveBlogPost = async (post: BlogPost) => {
    console.log('Saving blog post:', post);
    setBlogPosts(prev => {
      const exists = prev.find(e => e.id === post.id);
      if (exists) return prev.map(e => e.id === post.id ? post : e);
      return [...prev, post];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/blog', post.id), post);
      console.log('Blog post saved successfully');
    } catch (err) {
      console.error('Failed to save blog post:', err);
    }
  };

  const deleteBlogPostItem = async (id: string) => {
    setBlogPosts(prev => prev.filter(e => e.id !== id));
    await deleteDoc(doc(db, 'portfolio/data/blog', id));
  };

  const saveQuickInfo = async (info: QuickInfo) => {
    console.log('Saving quick info:', info);
    setQuickInfos(prev => {
      const exists = prev.find(e => e.id === info.id);
      if (exists) return prev.map(e => e.id === info.id ? info : e);
      return [...prev, info];
    });
    try {
      await setDoc(doc(db, 'portfolio/data/quickInfos', info.id), info);
      console.log('Quick info saved successfully');
    } catch (err) {
      console.error('Failed to save quick info:', err);
    }
  };

  const deleteQuickInfoItem = async (id: string) => {
    setQuickInfos(prev => prev.filter(e => e.id !== id));
    await deleteDoc(doc(db, 'portfolio/data/quickInfos', id));
  };

  return (
    <PortfolioContext.Provider value={{
      settings, updateSettings, settingsLoading,
      projects, setProjects, saveProject, deleteProjectItem,
      skillCategories, setSkillCategories, saveSkillCategory, deleteSkillCategoryItem,
      lifeEvents, setLifeEvents, saveLifeEvent, deleteLifeEventItem,
      workExperiences, setWorkExperiences, saveWorkExperience, deleteWorkExperienceItem,
      researchItems, setResearchItems, saveResearchItem, deleteResearchItem,
      certificates, setCertificates, saveCertificate, deleteCertificateItem,
      blogPosts, setBlogPosts, saveBlogPost, deleteBlogPostItem,
      quickInfos, setQuickInfos, saveQuickInfo, deleteQuickInfoItem,
      isCVOpen, setIsCVOpen
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
