import { Navbar } from '../components/EnhancedNavbar';
import { Footer } from '../components/Footer';
import { AnimatedBackground } from '../components/animations/AnimatedBackground';
import { EnhancedHeroSection } from '../components/EnhancedHeroSection';
import { EnhancedSkillsSection } from '../components/EnhancedSkillsSection';
import { EnhancedProjectsSection } from '../components/EnhancedProjectsSection';
import { EnhancedExperienceSection } from '../components/EnhancedExperienceSection';
import { EnhancedEducationSection } from '../components/EnhancedEducationSection';
import { EnhancedBlogSection } from '../components/EnhancedBlogSection';

export default async function Home() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <EnhancedHeroSection />

      {/* Skills Section */}
      <EnhancedSkillsSection />

      {/* Experience Section */}
      <EnhancedExperienceSection />

      {/* Projects Section */}
      <EnhancedProjectsSection />

      {/* Education Section */}
      <EnhancedEducationSection />

      {/* Blog Section */}
      <EnhancedBlogSection />

      <Footer />
    </main>
  );
}