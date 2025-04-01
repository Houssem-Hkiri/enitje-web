"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, ArrowLeft, Linkedin, Facebook, Twitter, ChevronRight } from "lucide-react"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { newsData } from "../../data/news"

// Sample news content (this would typically come from a CMS or API)
const newsContent = {
  fr: {
    1: `
      <p>Nous sommes ravis d'annoncer notre Conférence Technologique Annuelle 2023, qui aura lieu le 15 juin 2023, au Campus ENIT. La conférence de cette année présentera une liste d'experts de l'industrie, des présentations innovantes et des opportunités de réseautage.</p>
      
      <p>La conférence se concentrera sur les technologies émergentes et leur impact sur divers secteurs. Les participants auront l'occasion d'en apprendre davantage sur les dernières tendances, les meilleures pratiques et les orientations futures en matière de technologie.</p>
      
      <h3>Conférenciers Vedettes</h3>
      <ul>
        <li>Dr. Sarah Johnson - Experte en IA et Apprentissage Automatique</li>
        <li>Ahmed Benali - CTO de TechSolutions Inc.</li>
        <li>Prof. Mohamed Karim - Spécialiste en Cybersécurité</li>
        <li>Leila Mansour - Développeuse Blockchain</li>
      </ul>
      
      <h3>Programme</h3>
      <p>9h00 - Inscription et Café de Bienvenue</p>
      <p>10h00 - Discours d'Ouverture : L'Avenir de la Technologie</p>
      <p>11h30 - Table Ronde : Technologies Émergentes</p>
      <p>13h00 - Pause Déjeuner</p>
      <p>14h00 - Ateliers (IA, Blockchain, IoT)</p>
      <p>16h30 - Session de Réseautage</p>
      <p>18h00 - Remarques de Clôture</p>
      
      <p>Ne manquez pas cette opportunité de vous connecter avec des leaders de l'industrie, d'en apprendre davantage sur les technologies de pointe et d'élargir votre réseau professionnel. Inscrivez-vous dès maintenant pour réserver votre place !</p>
    `,
    2: `
      <p>ENIT Junior Entreprise est fière d'annoncer un nouveau partenariat stratégique avec TechCorp, une entreprise technologique de premier plan spécialisée dans le développement de logiciels et la transformation numérique.</p>
      
      <p>Ce partenariat nous permettra d'élargir nos services et d'offrir plus d'opportunités à nos membres étudiants d'acquérir une expérience pratique dans des projets réels. TechCorp collaborera avec nous sur diverses initiatives, notamment :</p>
      
      <ul>
        <li>Projets conjoints en développement de logiciels et solutions numériques</li>
        <li>Programmes de mentorat pour nos membres étudiants</li>
        <li>Ateliers et sessions de formation sur les technologies de pointe</li>
        <li>Opportunités de stage pour les étudiants de l'ENIT</li>
      </ul>
      
      <p>"Nous sommes ravis de nous associer à ENIT Junior Entreprise," a déclaré Ahmed Benali, PDG de TechCorp. "Le talent et l'enthousiasme de ces jeunes ingénieurs sont impressionnants, et nous sommes impatients de travailler ensemble sur des projets innovants."</p>
      
      <p>Cette collaboration marque une étape importante dans notre mission de combler le fossé entre les connaissances académiques et l'expérience professionnelle. Nous croyons que ce partenariat créera des opportunités précieuses pour nos membres et contribuera à leur développement professionnel.</p>
      
      <p>Restez à l'écoute pour plus de mises à jour sur les projets passionnants et les initiatives qui émergeront de ce partenariat !</p>
    `,
    3: `
      <p>Nous sommes fiers d'annoncer qu'une équipe de membres d'ENIT Junior Entreprise a reçu le prestigieux Prix National d'Innovation Étudiante pour leur projet révolutionnaire dans le domaine de l'énergie renouvelable.</p>
      
      <p>L'équipe, composée de Yasmine Trabelsi, Mohamed Karim et Sarah Ben Ali, a développé un système intelligent de surveillance de l'énergie solaire qui optimise la consommation d'énergie et réduit le gaspillage. Leur solution innovante combine la technologie IoT, l'analyse de données et l'apprentissage automatique pour fournir des informations en temps réel et des recommandations pour l'utilisation de l'énergie.</p>
      
      <h3>Points Forts du Projet</h3>
      <ul>
        <li>Surveillance en temps réel des performances des panneaux solaires</li>
        <li>Alertes de maintenance prédictive pour prévenir les défaillances du système</li>
        <li>Algorithmes d'optimisation de la consommation d'énergie</li>
        <li>Application mobile conviviale pour la surveillance à distance</li>
      </ul>
      
      <p>Le Prix National d'Innovation Étudiante récompense des projets exceptionnels qui démontrent créativité, excellence technique et potentiel d'impact dans le monde réel. La compétition était féroce, avec plus de 200 soumissions d'universités de tout le pays.</p>
      
      <p>"Cette réalisation reflète le dévouement, la créativité et les compétences techniques de notre équipe," a déclaré Yasmine Trabelsi, la chef de projet. "Nous sommes reconnaissants pour le soutien et les conseils que nous avons reçus de nos mentors et de la communauté ENIT Junior Entreprise."</p>
      
      <p>Le prix comprend une récompense en espèces de 10 000 TND et une opportunité de présenter le projet au Sommet International de l'Innovation à Paris le mois prochain.</p>
      
      <p>Nous félicitons Yasmine, Mohamed et Sarah pour cette remarquable réussite et nous sommes impatients de voir le développement continu et l'impact de leur solution innovante.</p>
    `,
    4: `
      <p>Rejoignez-nous pour un atelier passionnant sur les bases de l'intelligence artificielle et de l'apprentissage automatique ! Cette session pratique est conçue pour les débutants qui souhaitent comprendre les fondamentaux de l'IA et commencer avec des applications pratiques.</p>
      
      <h3>Détails de l'Atelier</h3>
      <p><strong>Date :</strong> 22 mars 2023</p>
      <p><strong>Heure :</strong> 14h00 - 17h00</p>
      <p><strong>Lieu :</strong> Campus ENIT, Salle 302</p>
      <p><strong>Instructeur :</strong> Dr. Sarah Johnson, Chercheuse et Consultante en IA</p>
      
      <h3>Ce Que Vous Apprendrez</h3>
      <ul>
        <li>Concepts de base et terminologie en IA et apprentissage automatique</li>
        <li>Différents types d'algorithmes d'apprentissage automatique</li>
        <li>Techniques de préparation et de prétraitement des données</li>
        <li>Construction et entraînement de modèles simples d'apprentissage automatique</li>
        <li>Applications pratiques de l'IA dans divers secteurs</li>
      </ul>
      
      <h3>Prérequis</h3>
      <ul>
        <li>Connaissances de base en programmation (Python préféré)</li>
        <li>Ordinateur portable avec Python installé</li>
        <li>Enthousiasme pour apprendre !</li>
      </ul>
      
      <p>Cet atelier est ouvert à tous les étudiants de l'ENIT, quel que soit leur domaine d'étude. C'est une excellente opportunité d'explorer le monde passionnant de l'IA et de découvrir comment elle peut être appliquée pour résoudre des problèmes réels.</p>
      
      <p>Les places sont limitées, alors inscrivez-vous dès maintenant pour réserver votre place ! L'inscription est gratuite pour les membres d'ENIT Junior Entreprise et 20 TND pour les non-membres.</p>
    `,
    5: `
      <p>ENIT Junior Entreprise lance sa Campagne de Recrutement 2023 ! Nous recherchons des étudiants talentueux et motivés pour rejoindre notre équipe et contribuer à des projets passionnants tout en développant leurs compétences professionnelles.</p>
      
      <h3>Postes Disponibles</h3>
      <ul>
        <li><strong>Développeurs de Logiciels</strong> - Développeurs front-end, back-end et full-stack avec expérience en technologies web et mobiles.</li>
        <li><strong>Designers UI/UX</strong> - Individus créatifs avec une passion pour la conception centrée sur l'utilisateur et l'esthétique visuelle.</li>
        <li><strong>Analystes d'Affaires</strong> - Étudiants orientés détail avec de solides compétences analytiques et une acuité commerciale.</li>
        <li><strong>Spécialistes Marketing</strong> - Esprits créatifs avec des compétences en marketing digital, création de contenu et gestion des médias sociaux.</li>
        <li><strong>Chefs de Projet</strong> - Individus organisés avec des compétences en leadership et la capacité de coordonner des équipes et des projets.</li>
      </ul>
      
      <h3>Pourquoi Rejoindre ENIT Junior Entreprise ?</h3>
      <ul>
        <li>Acquérir une expérience pratique en travaillant sur des projets réels</li>
        <li>Développer des compétences professionnelles qui complètent vos connaissances académiques</li>
        <li>Construire un réseau de contacts industriels et d'autres étudiants</li>
        <li>Améliorer votre CV avec une expérience pratique</li>
        <li>Contribuer à des projets significatifs qui font une différence</li>
      </ul>
      
      <h3>Processus de Candidature</h3>
      <ol>
        <li>Soumettez votre candidature en ligne avant le 28 février 2023</li>
        <li>Les candidats sélectionnés seront invités à un entretien de premier tour</li>
        <li>Les candidats finalistes participeront à une étude de cas ou une évaluation technique</li>
        <li>Les candidats retenus seront notifiés d'ici le 15 mars 2023</li>
      </ol>
      
      <p>Ne manquez pas cette opportunité de faire partie d'une organisation dynamique gérée par des étudiants qui comble le fossé entre les connaissances académiques et l'expérience professionnelle. Postulez dès maintenant et faites le premier pas vers un parcours enrichissant avec ENIT Junior Entreprise !</p>
    `,
    6: `
      <p>Nous sommes ravis de présenter notre dernier projet : Solutions pour Ville Intelligente. Cette initiative innovante se concentre sur le développement de solutions intelligentes pour répondre aux défis urbains et améliorer la qualité de vie dans les villes.</p>
      
      <p>Notre équipe d'étudiants talentueux a travaillé sur diverses composantes de ce projet, en exploitant des technologies telles que l'IoT, l'IA et l'analyse de données pour créer des applications pratiques pour la gestion des villes intelligentes.</p>
      
      <h3>Composantes Clés</h3>
      
      <h4>1. Système de Gestion du Trafic Intelligent</h4>
      <p>Notre solution de gestion du trafic utilise des données en temps réel provenant de capteurs et de caméras pour optimiser le flux de trafic, réduire la congestion et minimiser le temps de trajet. Le système comprend :</p>
      <ul>
        <li>Contrôle adaptatif des feux de circulation</li>
        <li>Surveillance et analyse du trafic en temps réel</li>
        <li>Gestion prédictive de la congestion</li>
        <li>Application mobile pour les conducteurs avec optimisation d'itinéraire</li>
      </ul>
      
      <h4>2. Optimisation de la Gestion des Déchets</h4>
      <p>Notre solution de gestion des déchets améliore l'efficacité de la collecte et du traitement des déchets grâce à :</p>
      <ul>
        <li>Poubelles intelligentes avec capteurs de niveau de remplissage</li>
        <li>Itinéraires de collecte optimisés basés sur des données en temps réel</li>
        <li>Analyse du tri et du recyclage des déchets</li>
        <li>Plateforme d'engagement citoyen pour les signalements et retours</li>
      </ul>
      
      <h4>3. Surveillance de l'Efficacité Énergétique</h4>
      <p>Notre solution énergétique aide les villes à réduire leur empreinte carbone et leurs coûts énergétiques grâce à :</p>
      <ul>
        <li>Éclairage public intelligent avec contrôle adaptatif de la luminosité</li>
        <li>Surveillance et optimisation de la consommation d'énergie des bâtiments</li>
        <li>Intégration et gestion des énergies renouvelables</li>
        <li>Analyse de la consommation d'énergie et recommandations</li>
      </ul>
      
      <p>Ce projet a été développé en collaboration avec le Gouvernement Municipal et a déjà été mis en œuvre dans certaines zones de la ville comme programme pilote. Les résultats initiaux montrent une réduction de 15% de la congestion du trafic, 20% d'économies sur les coûts de collecte des déchets et 25% de réduction de la consommation d'énergie pour l'éclairage public.</p>
      
      <p>Nous sommes fiers du travail acharné et de l'innovation de notre équipe dans le développement de ces solutions pour ville intelligente. Ce projet démontre comment la technologie peut être exploitée pour répondre aux défis urbains et créer des villes plus durables, efficaces et agréables à vivre.</p>
    `,
  },
  en: {
    1: `
      <p>We are excited to announce our Annual Tech Conference 2023, which will take place on June 15, 2023, at the ENIT Campus. This year's conference will feature a lineup of industry experts, innovative showcases, and networking opportunities.</p>
      
      <p>The conference will focus on emerging technologies and their impact on various industries. Attendees will have the opportunity to learn about the latest trends, best practices, and future directions in technology.</p>
      
      <h3>Featured Speakers</h3>
      <ul>
        <li>Dr. Sarah Johnson - AI and Machine Learning Expert</li>
        <li>Ahmed Benali - CTO of TechSolutions Inc.</li>
        <li>Prof. Mohamed Karim - Cybersecurity Specialist</li>
        <li>Leila Mansour - Blockchain Developer</li>
      </ul>
      
      <h3>Schedule</h3>
      <p>9:00 AM - Registration and Welcome Coffee</p>
      <p>10:00 AM - Opening Keynote: The Future of Technology</p>
      <p>11:30 AM - Panel Discussion: Emerging Technologies</p>
      <p>1:00 PM - Lunch Break</p>
      <p>2:00 PM - Workshops (AI, Blockchain, IoT)</p>
      <p>4:30 PM - Networking Session</p>
      <p>6:00 PM - Closing Remarks</p>
      
      <p>Don't miss this opportunity to connect with industry leaders, learn about cutting-edge technologies, and expand your professional network. Register now to secure your spot!</p>
    `,
    2: `
      <p>ENIT Junior Entreprise is proud to announce a new strategic partnership with TechCorp, a leading technology company specializing in software development and digital transformation.</p>
      
      <p>This partnership will enable us to expand our services and provide more opportunities for our student members to gain hands-on experience in real-world projects. TechCorp will collaborate with us on various initiatives, including:</p>
      
      <ul>
        <li>Joint projects in software development and digital solutions</li>
        <li>Mentorship programs for our student members</li>
        <li>Workshops and training sessions on cutting-edge technologies</li>
        <li>Internship opportunities for ENIT students</li>
      </ul>
      
      <p>"We are thrilled to partner with ENIT Junior Entreprise," said Ahmed Benali, CEO of TechCorp. "The talent and enthusiasm of these young engineers are impressive, and we look forward to working together on innovative projects."</p>
      
      <p>This collaboration marks a significant milestone in our mission to bridge the gap between academic knowledge and professional experience. We believe that this partnership will create valuable opportunities for our members and contribute to their professional development.</p>
      
      <p>Stay tuned for more updates on the exciting projects and initiatives that will emerge from this partnership!</p>
    `,
    3: `
      <p>We are proud to announce that a team of ENIT Junior Entreprise members has received the prestigious National Student Innovation Award for their groundbreaking project in renewable energy.</p>
      
      <p>The team, consisting of Yasmine Trabelsi, Mohamed Karim, and Sarah Ben Ali, developed a smart solar energy monitoring system that optimizes energy consumption and reduces waste. Their innovative solution combines IoT technology, data analytics, and machine learning to provide real-time insights and recommendations for energy usage.</p>
      
      <h3>Project Highlights</h3>
      <ul>
        <li>Real-time monitoring of solar panel performance</li>
        <li>Predictive maintenance alerts to prevent system failures</li>
        <li>Energy consumption optimization algorithms</li>
        <li>User-friendly mobile application for remote monitoring</li>
      </ul>
      
      <p>The National Student Innovation Award recognizes outstanding projects that demonstrate creativity, technical excellence, and potential for real-world impact. The competition was fierce, with over 200 submissions from universities across the country.</p>
      
      <p>"This achievement reflects the dedication, creativity, and technical skills of our team," said Yasmine Trabelsi, the project leader. "We are grateful for the support and guidance we received from our mentors and the ENIT Junior Entreprise community."</p>
      
      <p>The award includes a cash prize of 10,000 TND and an opportunity to present the project at the International Innovation Summit in Paris next month.</p>
      
      <p>We congratulate Yasmine, Mohamed, and Sarah on this remarkable achievement and look forward to seeing the continued development and impact of their innovative solution.</p>
    `,
    4: `
      <p>Join us for an exciting workshop on the basics of artificial intelligence and machine learning! This hands-on session is designed for beginners who want to understand the fundamentals of AI and get started with practical applications.</p>
      
      <h3>Workshop Details</h3>
      <p><strong>Date:</strong> March 22, 2023</p>
      <p><strong>Time:</strong> 2:00 PM - 5:00 PM</p>
      <p><strong>Location:</strong> ENIT Campus, Room 302</p>
      <p><strong>Instructor:</strong> Dr. Sarah Johnson, AI Researcher and Consultant</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Basic concepts and terminology in AI and machine learning</li>
        <li>Different types of machine learning algorithms</li>
        <li>Data preparation and preprocessing techniques</li>
        <li>Building and training simple machine learning models</li>
        <li>Practical applications of AI in various industries</li>
      </ul>
      
      <h3>Requirements</h3>
      <ul>
        <li>Basic programming knowledge (Python preferred)</li>
        <li>Laptop with Python installed</li>
        <li>Enthusiasm to learn!</li>
      </ul>
      
      <p>This workshop is open to all ENIT students, regardless of their field of study. It's a great opportunity to explore the exciting world of AI and discover how it can be applied to solve real-world problems.</p>
      
      <p>Space is limited, so register now to secure your spot! Registration is free for ENIT Junior Entreprise members and 20 TND for non-members.</p>
    `,
    5: `
      <p>ENIT Junior Entreprise is launching its Recruitment Drive 2023! We're looking for talented, motivated students to join our team and contribute to exciting projects while developing their professional skills.</p>
      
      <h3>Available Positions</h3>
      <ul>
        <li><strong>Software Developers</strong> - Front-end, back-end, and full-stack developers with experience in web and mobile technologies.</li>
        <li><strong>UI/UX Designers</strong> - Creative individuals with a passion for user-centered design and visual aesthetics.</li>
        <li><strong>Business Analysts</strong> - Detail-oriented students with strong analytical skills and business acumen.</li>
        <li><strong>Marketing Specialists</strong> - Creative minds with skills in digital marketing, content creation, and social media management.</li>
        <li><strong>Project Managers</strong> - Organized individuals with leadership skills and the ability to coordinate teams and projects.</li>
      </ul>
      
      <h3>Why Join ENIT Junior Entreprise?</h3>
      <ul>
        <li>Gain hands-on experience working on real-world projects</li>
        <li>Develop professional skills that complement your academic knowledge</li>
        <li>Build a network of industry contacts and fellow students</li>
        <li>Enhance your resume with practical experience</li>
        <li>Contribute to meaningful projects that make a difference</li>
      </ul>
      
      <h3>Application Process</h3>
      <ol>
        <li>Submit your application online by February 28, 2023</li>
        <li>Selected candidates will be invited for a first-round interview</li>
        <li>Final candidates will participate in a case study or technical assessment</li>
        <li>Successful applicants will be notified by March 15, 2023</li>
      </ol>
      
      <p>Don't miss this opportunity to be part of a dynamic, student-run organization that bridges the gap between academic knowledge and professional experience. Apply now and take the first step towards an enriching journey with ENIT Junior Entreprise!</p>
    `,
    6: `
      <p>We are excited to showcase our latest project: Smart City Solutions. This innovative initiative focuses on developing intelligent solutions to address urban challenges and improve the quality of life in cities.</p>
      
      <p>Our team of talented students has been working on various components of this project, leveraging technologies such as IoT, AI, and data analytics to create practical applications for smart city management.</p>
      
      <h3>Key Components</h3>
      
      <h4>1. Smart Traffic Management System</h4>
      <p>Our traffic management solution uses real-time data from sensors and cameras to optimize traffic flow, reduce congestion, and minimize travel time. The system includes:</p>
      <ul>
        <li>Adaptive traffic signal control</li>
        <li>Real-time traffic monitoring and analysis</li>
        <li>Predictive congestion management</li>
        <li>Mobile app for drivers with route optimization</li>
      </ul>
      
      <h4>2. Waste Management Optimization</h4>
      <p>Our waste management solution improves the efficiency of waste collection and processing through:</p>
      <ul>
        <li>Smart bins with fill-level sensors</li>
        <li>Optimized collection routes based on real-time data</li>
        <li>Waste sorting and recycling analytics</li>
        <li>Citizen engagement platform for reporting and feedback</li>
      </ul>
      
      <h4>3. Energy Efficiency Monitoring</h4>
      <p>Our energy solution helps cities reduce their carbon footprint and energy costs by:</p>
      <ul>
        <li>Smart street lighting with adaptive brightness control</li>
        <li>Building energy consumption monitoring and optimization</li>
        <li>Renewable energy integration and management</li>
        <li>Energy usage analytics and recommendations</li>
      </ul>
      
      <p>This project has been developed in collaboration with the Municipal Government and has already been implemented in selected areas of the city as a pilot program. Initial results show a 15% reduction in traffic congestion, 20% savings in waste collection costs, and 25% reduction in energy consumption for street lighting.</p>
      
      <p>We are proud of our team's hard work and innovation in developing these smart city solutions. This project demonstrates how technology can be leveraged to address urban challenges and create more sustainable, efficient, and livable cities.</p>
    `,
  },
}

export default function NewsDetailPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<"fr" | "en">("fr")
  const [newsItem, setNewsItem] = useState<any>(null)
  const params = useParams()
  const router = useRouter()

  // Toggle dark mode
  const toggleDarkMode = () => {
    // Disabled as requested
    return
  }

  // Set language
  const toggleLanguage = (lang: "fr" | "en") => {
    setLanguage(lang)
  }

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Find the news item based on the ID
  useEffect(() => {
    if (params.id) {
      const id = Number.parseInt(params.id as string)
      const currentNews = newsData[language]
      const item = currentNews.find((item) => item.id === id)

      if (item) {
        // Add content from our content object
        setNewsItem({
          ...item,
          content: newsContent[language][id as keyof (typeof newsContent)[typeof language]] || "",
        })
      } else {
        // Redirect to news page if item not found
        router.push("/news")
      }
    }
  }, [params.id, language, router])

  // Get related news (same category)
  const getRelatedNews = () => {
    if (!newsItem) return []

    const currentNews = newsData[language]
    return currentNews.filter((item) => item.id !== newsItem.id && item.category === newsItem.category).slice(0, 3)
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-300">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} language={language} toggleLanguage={toggleLanguage} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 to-navy/70 dark:from-navy/95 dark:to-navy/80 z-0"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <Link
              href="/news"
              className="inline-flex items-center text-white mb-6 hover:text-secondary transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "fr" ? "Retour aux Actualités" : "Back to News"}
            </Link>

            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-secondary text-white text-sm font-medium px-3 py-1 rounded-full">
                {newsItem.category}
              </span>
              <span className="text-gray-300 text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {newsItem.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{newsItem.title}</h1>

            <p className="text-xl text-gray-200 mb-8">{newsItem.excerpt}</p>

            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">Share:</span>
              <a
                href="#"
                className="text-gray-300 hover:text-secondary transition-colors duration-300"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-secondary transition-colors duration-300"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-secondary transition-colors duration-300"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image src={newsItem.image || "/placeholder.svg"} alt={newsItem.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-navy dark:prose-headings:text-white prose-a:text-secondary"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
          </div>
        </div>
      </section>

      {/* Related News */}
      <section className="py-16 bg-gray-50 dark:bg-navy/80">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 gradient-text text-center">
            {language === "fr" ? "Articles Similaires" : "Related News"}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {getRelatedNews().map((news, index) => (
              <motion.div
                key={news.id}
                className="bg-white dark:bg-navy/50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden h-48">
                  <Image
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{news.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-navy dark:text-white">{news.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{news.excerpt}</p>
                  <Link
                    href={`/news/${news.id}`}
                    className="text-secondary hover:text-secondary-dark transition-colors duration-300 flex items-center group"
                  >
                    {language === "fr" ? "Lire la suite" : "Read more"}
                    <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer language={language} toggleLanguage={toggleLanguage} />
    </div>
  )
}

