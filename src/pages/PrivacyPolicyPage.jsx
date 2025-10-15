
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - JU Learning Portal</title>
        <meta name="description" content="Read the privacy policy for the JU Learning Portal." />
      </Helmet>
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                Your privacy is important to us. It is JU Learning Portal's policy to respect your privacy regarding any information we may collect from you across our website.
              </p>
              <h2>1. Information We Collect</h2>
              <p>
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. This includes your name, email, and role for authentication and profile management.
              </p>
              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our website and your account</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you for customer service, updates, and marketing</li>
                <li>Process your transactions and manage enrollments</li>
              </ul>
              <h2>3. Security</h2>
              <p>
                The security of your personal information is important to us. We use Supabase for authentication and database management, which provides robust security measures. However, no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
               <h2>4. Data Retention</h2>
              <p>
                We keep your collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
