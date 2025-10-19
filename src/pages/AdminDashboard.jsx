import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BookOpen, Tag, CreditCard, Users, GalleryHorizontal, UserCog } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoursesTab from '@/components/admin/CoursesTab';
import PaymentsTab from '@/components/admin/PaymentsTab';
import TeamTab from '@/components/admin/TeamTab';
import GalleryTab from '@/components/admin/GalleryTab';
import ProfileTab from '@/components/admin/ProfileTab';

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - JU Learning Portal</title>
        <meta name="description" content="Manage courses, coupons, payments, team, and gallery" />
      </Helmet>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your learning portal</p>
          </motion.div>

          <Tabs defaultValue="courses" className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                <TabsList className="inline-flex w-auto px-1 py-1 bg-white rounded-xl shadow-sm border mb-8">
                  <TabsTrigger value="profile" className="data-[state=active]:bg-accent data-[state=active]:text-secondary rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-medium transition-all flex-shrink-0 flex items-center gap-2">
                    <UserCog className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="data-[state=active]:bg-accent data-[state=active]:text-secondary rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-medium transition-all flex-shrink-0 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Courses</span>
                  </TabsTrigger>
                  <TabsTrigger value="coupons" className="data-[state=active]:bg-accent data-[state=active]:text-secondary rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-medium transition-all flex-shrink-0 flex items-center gap-2">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Coupons</span>
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="data-[state=active]:bg-accent data-[state=active]:text-secondary rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-medium transition-all flex-shrink-0 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Payments</span>
                  </TabsTrigger>
                  <TabsTrigger value="team" className="data-[state=active]:bg-accent data-[state=active]:text-secondary rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-medium transition-all flex-shrink-0 flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Team</span>
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:bg-accent data-[state=active]:text-secondary rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-medium transition-all flex-shrink-0 flex items-center gap-2">
                    <GalleryHorizontal className="w-4 h-4 sm:w-5 sm:h-5" /> <span>Gallery</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <TabsContent value="profile"><ProfileTab /></TabsContent>
            <TabsContent value="courses"><CoursesTab /></TabsContent>
            <TabsContent value="payments"><PaymentsTab /></TabsContent>
            <TabsContent value="team"><TeamTab /></TabsContent>
            <TabsContent value="gallery"><GalleryTab /></TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;