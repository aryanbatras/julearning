
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - JU Learning Portal</title>
        <meta name="description" content="Read the privacy policy for the JU Learning Portal." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Your Privacy Matters
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Privacy Policy
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We are committed to protecting your personal information and ensuring transparency in how we handle your data.
                </p>
              </div>
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Database className="w-8 h-8 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We collect only the information necessary to provide you with our services. This includes your name, email address, and profile details when you create an account or enroll in courses. We may also collect usage data, such as which pages you visit or how you interact with our platform, to improve your learning experience. All collection is done with your consent and in compliance with privacy laws.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-purple-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                  </div>
                  <p className="text-gray-700 mb-4">We use your information to:</p>
                  <ul className="text-gray-700 space-y-2 ml-6">
                    <li>Run and maintain the platform, including your account and course access</li>
                    <li>Personalize your experience and suggest relevant courses or content</li>
                    <li>Analyze usage to fix issues and add new features that help students</li>
                    <li>Develop better tools and resources for learning</li>
                    <li>Send updates, support, or important notices about your account</li>
                    <li>Handle payments and track enrollments securely</li>
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Lock className="w-8 h-8 text-green-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">3. Security</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Protecting your data is our top priority. We use secure tools like Supabase for storing and managing information, with encryption and other safeguards to prevent unauthorized access. While no online system is 100% secure, we follow industry standards to keep your details safe. If something goes wrong, we'll notify you as required by law.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">4. Data Retention</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We keep your information only as long as needed to provide our services, such as during your enrollment or to resolve any issues. Once it's no longer necessary, we securely delete or anonymize it. This helps us comply with laws and ensures we don't hold onto data longer than required.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-orange-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">5. Sharing Your Information</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We do not sell or rent your personal information to third parties. We may share it only when necessary, such as with service providers who help us run the platform (e.g., payment processors), or if required by law. In such cases, we ensure they protect your data and use it only for the agreed purpose.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Database className="w-8 h-8 text-teal-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">6. Cookies and Tracking</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze site usage. These help us improve the platform for all students. You can manage cookie settings in your browser, but some features may not work without them.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Lock className="w-8 h-8 text-red-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">7. Your Rights and Choices</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    You have the right to access, update, or delete your personal information. You can also opt out of non-essential communications. To exercise these rights, contact us at julearning.com@gmail.com. We'll respond promptly and assist you as per applicable laws.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <Eye className="w-8 h-8 text-purple-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">8. Changes to This Policy</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or laws. We'll notify you of significant changes via email or a notice on our site. By continuing to use the platform, you agree to the updated terms.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
