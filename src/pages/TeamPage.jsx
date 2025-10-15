
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const MemberCard = ({ member, onCardClick }) => (
  <motion.div
    layoutId={`card-${member.id}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl shadow-lg border text-center p-6 hover:shadow-xl transition-shadow group cursor-pointer"
    onClick={() => onCardClick(member)}
  >
    <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-100 flex items-center justify-center">
      {member.image_url ? (
        <img className="w-full h-full object-cover" alt={`Profile of ${member.name}`} src={member.image_url} />
      ) : (
        <User className="w-12 h-12 text-gray-400" />
      )}
    </div>
    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
    <p className="text-indigo-600 font-medium">{member.role}</p>
  </motion.div>
);

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchTeam = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error("Error fetching team members:", error);
    } else {
      setTeamMembers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const { techTeam, nonTechTeam } = useMemo(() => {
    return teamMembers.reduce((acc, member) => {
      if (member.team_category === 'Tech') {
        acc.techTeam.push(member);
      } else {
        acc.nonTechTeam.push(member);
      }
      return acc;
    }, { techTeam: [], nonTechTeam: [] });
  }, [teamMembers]);

  return (
    <>
      <Helmet>
        <title>Our Team - JU Learning Portal</title>
        <meta name="description" content="Meet the team behind the JU Learning Portal." />
      </Helmet>
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Meet Our Team</h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals dedicated to improving your learning experience.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <section>
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Tech Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {techTeam.map((member) => (
                    <MemberCard key={member.id} member={member} onCardClick={setSelectedMember} />
                  ))}
                </div>
              </section>
              <section>
                <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">Non-Tech Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {nonTechTeam.map((member) => (
                    <MemberCard key={member.id} member={member} onCardClick={setSelectedMember} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <AnimatePresence>
          {selectedMember && (
            <DialogContent className="p-0 max-w-md">
              <motion.div layoutId={`card-${selectedMember.id}`}>
                <DialogHeader className="p-6 text-left">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-full flex-shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {selectedMember.image_url ? (
                        <img className="w-full h-full object-cover" alt={`Profile of ${selectedMember.name}`} src={selectedMember.image_url} />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-gray-900">{selectedMember.name}</DialogTitle>
                      <p className="text-indigo-600 font-semibold text-lg">{selectedMember.role}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${selectedMember.team_category === 'Tech' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{selectedMember.team_category} Team</span>
                    </div>
                  </div>
                </DialogHeader>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{selectedMember.description}</p>
                </div>
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
};

export default TeamPage;
