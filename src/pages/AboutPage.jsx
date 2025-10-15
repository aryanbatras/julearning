
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Eye } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - JU Learning Portal</title>
        <meta name="description" content="Learn more about the JU Learning Portal mission, vision, and team." />
      </Helmet>
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">About JU Learning Portal</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Your dedicated platform for academic excellence at Jammu University.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"><GraduationCap className="w-8 h-8 text-indigo-600" /></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Story</h2>
              <p className="text-gray-600">Founded by students, for students. We aim to bridge the gap in accessible, high-quality learning resources for everyone at Jammu University.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><Target className="w-8 h-8 text-purple-600" /></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
              <p className="text-gray-600">To empower every student with the tools, knowledge, and community support they need to succeed academically and beyond.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-8 rounded-2xl shadow-lg border">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Eye className="w-8 h-8 text-green-600" /></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h2>
              <p className="text-gray-600">To become the central hub for learning and collaboration, fostering a culture of continuous growth and academic achievement at JU.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
