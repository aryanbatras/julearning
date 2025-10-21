
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Target, Eye, Users, BookOpen, Award, Heart, ChevronRight, Star } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - JU Learning Portal</title>
        <meta name="description" content="Discover the mission, vision, and passionate team behind JU Learning Portal - your gateway to academic excellence at Jammu University." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2 animate-pulse" />
                Made with passion for JU students
              </div>
              <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                About JU Learning Portal
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Empowering Jammu University students with <span className="font-semibold text-indigo-600">cutting-edge courses</span>,
                <span className="font-semibold text-purple-600"> collaborative learning</span>, and
                <span className="font-semibold text-green-600"> lifelong success</span>.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why We Exist</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Born from the passion of JU students and educators, we bridge the gap between traditional learning and modern digital education.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-200"
              >
                <div className="w-20 h-20 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
                <p className="text-gray-700 leading-relaxed">
                  Founded by a team of dedicated JU alumni and students who experienced firsthand the challenges of accessing quality educational resources.
                  We created this platform to democratize learning and make premium education accessible to every JU student.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="group bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200"
              >
                <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To empower every JU student with innovative, practical courses that bridge academic theory with real-world application.
                  We foster a community where knowledge sharing and collaborative growth drive academic excellence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Eye className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To transform JU into a beacon of digital learning excellence, where every student has the tools to excel academically,
                  develop professionally, and contribute meaningfully to society.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Course Relevance Section */}
        <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">The Relevance of Our Courses</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our carefully curated courses are designed to address real-world challenges and align with industry demands.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry-Aligned Curriculum</h3>
                    <p className="text-gray-700">
                      Our courses incorporate the latest industry trends and technologies, ensuring you're job-ready upon graduation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Practical Learning Approach</h3>
                    <p className="text-gray-700">
                      Move beyond theory with hands-on projects, case studies, and real-world applications that build practical skills.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaborative Community</h3>
                    <p className="text-gray-700">
                      Learn alongside peers, share knowledge, and build lasting professional networks within the JU community.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-8 rounded-3xl shadow-xl"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Success Stories</h3>
                  <p className="text-gray-600">
                    "JU Learning Portal deepened my understanding of complex subjects and helped me excel in my exams. The structured courses made learning enjoyable and effective!"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Priya Sharma, Computer Science Student</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet Our Passionate Team</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A dedicated group of JU alumni, students, and educators united by a shared vision of educational excellence.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Developers</h3>
                <p className="text-gray-600">
                  Talented coders and designers crafting seamless learning experiences with cutting-edge technology.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Educators</h3>
                <p className="text-gray-600">
                  Experienced faculty and subject matter experts ensuring content quality and academic rigor.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-3xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">
                  Students and alumni working together to create a supportive, inclusive learning environment.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-lg text-gray-700 mb-6">
                Together, we're building something amazing for the JU community.
              </p>
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Link to="/team" className="flex items-center">
                  Meet Our Team
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
