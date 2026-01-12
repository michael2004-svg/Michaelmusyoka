import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronDown, Moon, Sun, Code, Briefcase, GraduationCap, Award, ArrowRight, Terminal, Zap, Shield, Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, } from '@react-three/drei';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import type { Variants } from "framer-motion";


// Types
interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  tech: string[];
  image: string;
  demoUrl: string;
  githubUrl: string;
  metrics: string[];
  featured: boolean;
  color: string;
}

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

// 3D Components
const AnimatedSphere = ({ color = "#3b82f6" }: { color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 2000;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
       <bufferAttribute
  attach="attributes-position"
  args={[positions, 3]}
/>

      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6366f1"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const FloatingCode = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
};

// Theme Hook
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') };
};

// Smooth Scroll Hook
const useSmoothScroll = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const href = target.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
};

// Data
const projects: Project[] = [
  {
    id: '1',
    title: 'Enterprise SaaS Dashboard',
    description: 'Real-time analytics platform serving 50K+ users',
    problem: 'Complex data visualization with slow load times and poor UX',
    solution: 'Built modular React architecture with WebSocket streaming and optimized rendering',
    tech: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Redis', 'AWS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    demoUrl: '#',
    githubUrl: '#',
    metrics: ['40% faster load time', '99.9% uptime', '50K+ active users'],
    featured: true,
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'AI-Powered Code Review Tool',
    description: 'Automated code analysis with ML-driven suggestions',
    problem: 'Manual code reviews bottleneck in CI/CD pipeline',
    solution: 'Integrated OpenAI API with custom AST parser for context-aware suggestions',
    tech: ['Python', 'FastAPI', 'React', 'OpenAI', 'Docker', 'GitHub Actions'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    demoUrl: '#',
    githubUrl: '#',
    metrics: ['60% faster reviews', '85% accuracy', '10K+ PRs analyzed'],
    featured: true,
    color: '#8b5cf6'
  },
  {
    id: '3',
    title: 'Real-Time Collaboration Platform',
    description: 'Multiplayer document editing with conflict resolution',
    problem: 'Concurrent editing causing data loss and sync issues',
    solution: 'Implemented CRDT algorithm with WebSocket infrastructure',
    tech: ['Node.js', 'Socket.io', 'MongoDB', 'React', 'Redis', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    demoUrl: '#',
    githubUrl: '#',
    metrics: ['Sub-100ms latency', '1M+ documents', '99.95% sync accuracy'],
    featured: true,
    color: '#ec4899'
  }
];

const skills: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React/Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Vue.js', level: 80 }
    ]
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js/Express', level: 90 },
      { name: 'Python/FastAPI', level: 85 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'GraphQL', level: 80 }
    ]
  },
  {
    category: 'DevOps & Tools',
    skills: [
      { name: 'AWS/GCP', level: 85 },
      { name: 'Docker/K8s', level: 80 },
      { name: 'CI/CD', level: 90 },
      { name: 'Git', level: 95 }
    ]
  }
];

const experience = [
  {
    role: 'Senior Full-Stack Engineer',
    company: 'Tech Innovations Inc.',
    period: '2022 - Present',
    description: 'Led development of microservices architecture serving 100K+ users. Mentored 5 junior developers.',
    icon: Briefcase
  },
  {
    role: 'Full-Stack Developer',
    company: 'Digital Solutions Co.',
    period: '2020 - 2022',
    description: 'Built customer-facing dashboards and internal tools. Reduced page load time by 60%.',
    icon: Code
  },
  {
    role: 'Computer Science Degree',
    company: 'University of Technology',
    period: '2016 - 2020',
    description: 'Focus on algorithms, system design, and software engineering. GPA: 3.8/4.0',
    icon: GraduationCap
  }
];

// Enhanced Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};


// Components
const Navigation = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MM
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {['About', 'Projects', 'Contact'].map(item => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </motion.button>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t dark:border-gray-800"
            >
              <div className="px-4 py-6 space-y-4">
                {['About', 'Projects', 'Contact'].map(item => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    whileHover={{ x: 10 }}
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

const Hero = () => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <AnimatedSphere color="#6366f1" />
            <ParticleField />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Suspense>
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <motion.span 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
            >
              <Sparkles size={16} />
              Available for new opportunities
            </motion.span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-black mb-6 leading-tight mt-6"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Senior Full-Stack
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Software Engineer
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Crafting exceptional digital experiences with{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">React</span>,{' '}
            <span className="font-bold text-purple-600 dark:text-purple-400">TypeScript</span>, and{' '}
            <span className="font-bold text-pink-600 dark:text-pink-400">modern tech</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-blue-500/50 relative overflow-hidden"
            >
              <span className="relative z-10">View My Work</span>
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, borderColor: "#3b82f6" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl font-bold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 transition-all shadow-xl"
            >
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={fadeInUp}
            className="mt-20 flex justify-center gap-6"
          >
            {[
              { icon: Github, href: '#', color: 'from-gray-700 to-gray-900' },
              { icon: Linkedin, href: '#', color: 'from-blue-600 to-blue-800' },
              { icon: Mail, href: '#', color: 'from-purple-600 to-pink-600' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                className={`p-4 bg-gradient-to-br ${social.color} text-white rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-shadow`}
              >
                <social.icon size={24} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-blue-600 dark:text-blue-400" size={40} />
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" ref={ref} className="py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-6"
            whileInView={{ scale: [0.9, 1.02, 1] }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About Me
            </span>
          </motion.h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Turning complex problems into elegant solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="relative h-96 rounded-3xl overflow-hidden group">
              <Canvas>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <FloatingCode />
                  <OrbitControls enableZoom={false} />
                </Suspense>
              </Canvas>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Terminal, label: '5+ Years', color: 'from-blue-500 to-cyan-500' },
                { icon: Zap, label: '50+ Projects', color: 'from-purple-500 to-pink-500' },
                { icon: Shield, label: '100K+ Users', color: 'from-green-500 to-emerald-500' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-6 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-xl`}
                >
                  <stat.icon className="mb-3" size={32} />
                  <p className="font-bold text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Journey</h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  With over 5 years of experience building production-ready applications, I specialize in creating
                  scalable solutions that balance technical excellence with exceptional user experiences.
                </p>
                <p>
                  I've architected systems serving hundreds of thousands of users, led cross-functional teams,
                  and mentored developers while staying hands-on with code. My passion lies in solving complex
                  problems with elegant, maintainable solutions.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Expertise</h4>
              {skills.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                >
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    {category.category}
                  </h5>
                  <div className="space-y-3">
                    {category.skills.map((skill, j) => (
                      <div key={j}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${skill.level}%` } : {}}
                            transition={{ duration: 1, delay: j * 0.1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full relative overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Experience Timeline</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />
            
            <div className="space-y-12">
              {experience.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.2 }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="inline-block bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border-2 border-gray-100 dark:border-gray-700"
                    >
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{exp.role}</h4>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mb-1">{exp.company}</p>
                      <p className="text-sm text-gray-500 mb-4">{exp.period}</p>
                      <p className="text-gray-600 dark:text-gray-400">{exp.description}</p></motion.div></div>
                      <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50"
                >
                  <exp.icon className="text-white" size={28} />
                </motion.div>
              </div>
              
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
</section>
);
};
const Projects = () => {
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
return (
<section id="projects" ref={ref} className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
<div className="absolute inset-0 opacity-10">
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" />
<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
</div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="text-center mb-20"
    >
      <h2 className="text-5xl md:text-6xl font-black mb-6">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Featured Projects
        </span>
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        Real-world solutions with measurable impact
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          whileHover={{ y: -15, rotateY: 5, rotateX: 5, scale: 1.02 }}
          onClick={() => setSelectedProject(project)}
          className="group cursor-pointer perspective-1000"
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform-gpu">
            <div className="relative h-64 overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute top-4 right-4 flex gap-3">
                <motion.a
                  href={project.githubUrl}
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30"
                >
                  <Github size={20} className="text-white" />
                </motion.a>
                <motion.a
                  href={project.demoUrl}
                  onClick={(e) => e.stopPropagation()}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30"
                >
                  <ExternalLink size={20} className="text-white" />
                </motion.a>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-3"
                  whileHover={{ rotate: 180, scale: 1.1 }}
                />
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              </div>
            </div>

            <div className="p-8">
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.slice(0, 3).map((tech, j) => (
                  <motion.span
                    key={j}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-semibold border border-blue-100 dark:border-blue-800"
                  >
                    {tech}
                  </motion.span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl text-sm font-semibold">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800"
              >
                <span className="text-gray-500 text-sm font-medium">View Details</span>
                <ArrowRight className="text-blue-600 dark:text-blue-400" size={20} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>

  {/* Enhanced Project Modal */}
  <AnimatePresence>
    {selectedProject && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedProject(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="relative h-80">
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <motion.button
              onClick={() => setSelectedProject(null)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white"
            >
              <X size={24} />
            </motion.button>
          </div>

          <div className="p-10">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {selectedProject.title}
            </motion.h2>

            <div className="space-y-8">
              {[
                { title: 'Problem', content: selectedProject.problem },
                { title: 'Solution', content: selectedProject.solution }
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    {section.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-4">
                    {section.content}
                  </p>
                </motion.div>
              ))}

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.tech.map((tech, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-bold border-2 border-blue-100 dark:border-blue-800"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Impact & Metrics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedProject.metrics.map((metric, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-100 dark:border-green-800"
                    >
                      <Award className="text-green-600 dark:text-green-400 mb-3" size={24} />
                      <p className="text-gray-900 dark:text-white font-bold">{metric}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <motion.a
                  href={selectedProject.demoUrl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-center shadow-lg shadow-blue-500/30"
                >
                  View Live Demo
                </motion.a>
                <motion.a
                  href={selectedProject.githubUrl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-bold text-center border-2 border-gray-300 dark:border-gray-700"
                >
                  View Source
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</section>
);
};
const Contact = () => {
const [formData, setFormData] = useState({ name: '', email: '', message: '' });
const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
setTimeout(() => {
setStatus('success');
setFormData({ name: '', email: '', message: '' });
setTimeout(() => setStatus('idle'), 3000);
}, 1000);
};
return (
<section id="contact" ref={ref} className="py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 relative overflow-hidden">
<div className="absolute inset-0 opacity-20">
<Canvas>
<Suspense fallback={null}>
<Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
</Suspense>
</Canvas>
</div>
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="text-center mb-16"
    >
      <h2 className="text-5xl md:text-6xl font-black mb-6">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Let's Build Something Great
        </span>
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300">
        I'm always open to discussing new projects and opportunities
      </p>
    </motion.div>

    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
    >
      {['name', 'email'].map((field, i) => (
        <motion.div
          key={field}
          initial={{ x: -20, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ delay: 0.3 + i * 0.1 }}
        >
          <label htmlFor={field} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            {field}
          </label>
          <motion.input
            type={field === 'email' ? 'email' : 'text'}
            id={field}
            required
            value={formData[field as keyof typeof formData]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            whileFocus={{ scale: 1.01 }}
            className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white font-medium"
            placeholder={field === 'email' ? 'john@example.com' : 'John Doe'}
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={inView ? { x: 0, opacity: 1 } : {}}
        transition={{ delay: 0.5 }}
      >
        <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
          Message
        </label>
        <motion.textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          whileFocus={{ scale: 1.01 }}
          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-600 dark:focus:border-blue-400 outline-none transition-all resize-none text-gray-900 dark:text-white font-medium"
          placeholder="Tell me about your project..."
        />
      </motion.div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        className="w-full px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/50 relative overflow-hidden group"
      >
        <span className="relative z-10">Send Message</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500"
          initial={{ x: '100%' }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 rounded-2xl text-green-600 dark:text-green-400 text-center font-bold"
          >
            ✨ Message sent successfully! I'll get back to you soon.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  </div>
</section>
);
};
const Footer = () => {
return (
<footer className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 py-16 relative overflow-hidden">
<div className="absolute inset-0 opacity-10">
<div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
<div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
</div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
      <div className="text-center md:text-left">
        <motion.h3
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
        >
          Michael Musyoka
        </motion.h3>
        <p className="text-gray-400 font-medium">
          Senior Full-Stack Software Engineer
        </p>
      </div>

      <div className="flex gap-4">
        {[
          { icon: Github, href: '#', label: 'GitHub', color: 'from-gray-600 to-gray-800' },
          { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'from-blue-600 to-blue-800' },
          { icon: Mail, href: '#', label: 'Email', color: 'from-purple-600 to-pink-600' }
        ].map((social, i) => (
          <motion.a
            key={i}
            href={social.href}
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            aria-label={social.label}
            className={`p-4 bg-gradient-to-br ${social.color} rounded-2xl shadow-xl hover:shadow-2xl transition-shadow`}
          >
            <social.icon className="text-white" size={22} />
          </motion.a>
        ))}
      </div>
    </div>

    <div className="pt-8 border-t border-gray-700 text-center">
      <p className="text-gray-400">
        © 2025 Michael Musyoka. Crafted with{' '}
        <span className="text-red-500">❤️</span> using React, TypeScript, Three.js & Tailwind CSS
      </p>
    </div>
  </div>
</footer>
);
};
// Main App
const App = () => {
const { theme, toggleTheme } = useTheme();
useSmoothScroll();
return (
<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
<Navigation theme={theme} toggleTheme={toggleTheme} />
<Hero />
<About />
<Projects />
<Contact />
<Footer />
</div>
);
};
export default App;