import CtaSection from "../components/landing/CtaSection";
import FeaturesSection from "../components/landing/FeatureSection";
import HeroSection from "../components/landing/HeroSection";
import RolesSection from "../components/landing/RoleSection";


const LandingPage = () => {
  return (
    <div className="bg-[var(--color-bg-main)] text-[var(--color-text-main)]">
      <HeroSection />
      <FeaturesSection />
      <RolesSection />
      <CtaSection />
    </div>
  );
};

export default LandingPage;
