"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type TranslationType = {
  hero: {
    welcome: string;
    title: string;
    subtitle: string;
    getStarted: string;
    learnMore: string;
    scrollDown: string;
  };
  about: {
    sectionTitle: string;
    title: string;
    description: string;
    features: string[];
    teamTitle: string;
    teamSubtitle: string;
    learnMoreButton: string;
  };
  projects: {
    sectionTitle: string;
    title: string;
    description: string;
    categories: string[];
    items: Array<{
      title: string;
      description: string;
      category: string;
    }>;
    viewProject: string;
    learnMore: string;
    viewAllButton: string;
  };
  news: {
    sectionTitle: string;
    title: string;
    description: string;
    readMore: string;
    items: Array<{
      title: string;
      excerpt: string;
      category: string;
      date: string;
    }>;
    viewAllButton: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
  };
  clients: {
    title: string;
    subtitle: string;
  };
};

const defaultTranslations: Record<string, TranslationType> = {
  fr: {
    hero: {
      welcome: "BIENVENUE À ENIT JUNIOR ENTREPRISE",
      title: "Qui sommes-nous ?",
      subtitle: "Nous comblons le fossé entre l'excellence académique et la réussite professionnelle grâce à une expérience pratique dans des projets réels.",
      getStarted: "Commencer",
      learnMore: "En Savoir Plus",
      scrollDown: "Défiler vers le bas",
    },
    about: {
      sectionTitle: "À PROPOS",
      title: "Qui sommes-nous ?",
      description: "ENIT Junior Entreprise est une association à but non lucratif gérée par des étudiants de l'École Nationale d'Ingénieurs de Tunis. Notre mission est de fournir des services de conseil de haute qualité aux entreprises tout en offrant aux étudiants une expérience pratique précieuse.",
      features: ["Expertise technique", "Innovation", "Professionnalisme", "Engagement"],
      teamTitle: "Notre équipe",
      teamSubtitle: "Découvrez nos équipes",
      learnMoreButton: "En savoir plus",
    },
    projects: {
      sectionTitle: "NOS PROJETS",
      title: "Découvrez nos réalisations",
      description: "Explorez notre portfolio de projets réussis qui démontrent notre expertise et notre engagement envers l'excellence.",
      categories: ["Tous", "Web", "Mobile", "Design", "Marketing"],
      items: [
        {
          title: "Projet 1",
          description: "Description du projet 1",
          category: "Web",
        },
        {
          title: "Projet 2",
          description: "Description du projet 2",
          category: "Mobile",
        },
        {
          title: "Projet 3",
          description: "Description du projet 3",
          category: "Design",
        },
      ],
      viewProject: "Voir le projet",
      learnMore: "En savoir plus",
      viewAllButton: "Voir tous les projets",
    },
    news: {
      sectionTitle: "ACTUALITÉS",
      title: "Restez informé",
      description: "Découvrez les dernières actualités et événements de ENIT Junior Entreprise.",
      readMore: "Lire la suite",
      items: [
        {
          title: "Actualité 1",
          excerpt: "Résumé de l'actualité 1",
          category: "Événement",
          date: "01/01/2023",
        },
        {
          title: "Actualité 2",
          excerpt: "Résumé de l'actualité 2",
          category: "Annonce",
          date: "15/02/2023",
        },
        {
          title: "Actualité 3",
          excerpt: "Résumé de l'actualité 3",
          category: "Projet",
          date: "10/03/2023",
        },
      ],
      viewAllButton: "Toutes les actualités",
    },
    cta: {
      title: "Prêt à collaborer ?",
      description: "Contactez-nous dès aujourd'hui pour discuter de votre projet.",
      button: "Contactez-nous",
    },
    newsletter: {
      title: "Restez informé",
      description: "Abonnez-vous à notre newsletter pour recevoir nos dernières actualités et mises à jour.",
      placeholder: "Votre adresse email",
      button: "S'abonner",
    },
    clients: {
      title: "Ceux qui nous font confiance",
      subtitle: "Découvrez nos partenaires et clients satisfaits",
    },
  },
  en: {
    hero: {
      welcome: "WELCOME TO ENIT JUNIOR ENTREPRISE",
      title: "Who we are",
      subtitle: "We bridge the gap between academic excellence and professional success through practical experience in real projects.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      scrollDown: "Scroll down",
    },
    about: {
      sectionTitle: "ABOUT",
      title: "Who we are",
      description: "ENIT Junior Entreprise is a non-profit organization managed by students from the National Engineering School of Tunis. Our mission is to provide high-quality consulting services to businesses while offering valuable hands-on experience to students.",
      features: ["Technical Expertise", "Innovation", "Professionalism", "Commitment"],
      teamTitle: "Our Team",
      teamSubtitle: "Discover our teams",
      learnMoreButton: "Learn more",
    },
    projects: {
      sectionTitle: "OUR PROJECTS",
      title: "Discover our achievements",
      description: "Explore our portfolio of successful projects that demonstrate our expertise and commitment to excellence.",
      categories: ["All", "Web", "Mobile", "Design", "Marketing"],
      items: [
        {
          title: "Project 1",
          description: "Description of project 1",
          category: "Web",
        },
        {
          title: "Project 2",
          description: "Description of project 2",
          category: "Mobile",
        },
        {
          title: "Project 3",
          description: "Description of project 3",
          category: "Design",
        },
      ],
      viewProject: "View project",
      learnMore: "Learn more",
      viewAllButton: "View all projects",
    },
    news: {
      sectionTitle: "NEWS",
      title: "Stay informed",
      description: "Discover the latest news and events from ENIT Junior Entreprise.",
      readMore: "Read more",
      items: [
        {
          title: "News 1",
          excerpt: "Summary of news 1",
          category: "Event",
          date: "01/01/2023",
        },
        {
          title: "News 2",
          excerpt: "Summary of news 2",
          category: "Announcement",
          date: "15/02/2023",
        },
        {
          title: "News 3",
          excerpt: "Summary of news 3",
          category: "Project",
          date: "10/03/2023",
        },
      ],
      viewAllButton: "All news",
    },
    cta: {
      title: "Ready to collaborate?",
      description: "Contact us today to discuss your project.",
      button: "Contact us",
    },
    newsletter: {
      title: "Stay informed",
      description: "Subscribe to our newsletter to receive our latest news and updates.",
      placeholder: "Your email address",
      button: "Subscribe",
    },
    clients: {
      title: "Our Trusted Partners",
      subtitle: "Discover our satisfied partners and clients",
    },
  },
};

type LanguageContextType = {
  language: "fr" | "en";
  setLanguage: (lang: "fr" | "en") => void;
  translations: TranslationType;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<"fr" | "en">("fr");
  const [translations, setTranslations] = useState<TranslationType>(defaultTranslations.fr);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "fr" | "en" | null;
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
      setTranslations(defaultTranslations[savedLanguage]);
    }
  }, []);

  const setLanguage = (lang: "fr" | "en") => {
    setLanguageState(lang);
    setTranslations(defaultTranslations[lang]);
    localStorage.setItem("language", lang);
  };

  const toggleLanguage = () => {
    const newLang = language === "fr" ? "en" : "fr";
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

