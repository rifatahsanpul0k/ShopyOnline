import React from "react";
import {
  Heart,
  BadgeCheck,
  Users,
  Target,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-slate-800/60 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition duration-300">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-slate-700 rounded-full">
          <Icon className="text-white w-6 h-6" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400">
        {description}
      </p>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white">
      
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">About ShopMate</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Your trusted e-commerce platform for quality products and exceptional service.
        </p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FeatureCard
          icon={Heart}
          title="Customer First"
          description="We put our customers at the heart of everything we do."
        />
        <FeatureCard
          icon={BadgeCheck}
          title="Quality Products"
          description="We ensure all products meet our high standards."
        />
        <FeatureCard
          icon={Users}
          title="Community"
          description="Building lasting relationships with our customers."
        />
        <FeatureCard
          icon={Target}
          title="Innovation"
          description="Constantly improving our platform and services."
        />
      </div>

      {/* Our Story */}
      <div className="max-w-5xl mx-auto px-4 mt-12 pb-16">
        <div className="bg-slate-800/60 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-400 leading-relaxed">
            Founded with a vision to make online shopping simple and enjoyable,
            ShopMate has grown to become a trusted platform for thousands of
            customers worldwide. We believe that everyone deserves access to
            quality products at fair prices, backed by exceptional customer
            service.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;