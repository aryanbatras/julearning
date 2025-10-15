
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const CouponsTab = () => {
  const [coupons, setCoupons] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expiry: ''
  });
  const { toast } = useToast();

  const loadCoupons = useCallback(async () => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading coupons:', error);
    } else {
      setCoupons(data);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase.from('coupons').insert({
      ...formData,
      discount: parseFloat(formData.discount)
    });

    if (error) {
      console.error("Error creating coupon", error);
    } else {
      toast({ title: "Coupon Created! 🎉" });
      await loadCoupons();
      setIsOpen(false);
      setFormData({ code: '', discount: '', expiry: '' });
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) {
      console.error("Error deleting coupon", error);
    } else {
      toast({ title: "Coupon Deleted" });
      await loadCoupons();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Coupons</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border rounded-xl" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount (%)</label>
                <input type="number" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} className="w-full px-4 py-2 border rounded-xl" min="1" max="100" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                <input type="date" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Create Coupon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {coupons.map((coupon, index) => (
          <motion.div key={coupon.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-2xl p-6 shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-lg font-bold">{coupon.code}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{coupon.discount}% OFF</span>
                </div>
                <p className="text-gray-600">Expires: {new Date(coupon.expiry).toLocaleDateString()}</p>
              </div>
              <Button onClick={() => handleDelete(coupon.id)} variant="outline" size="icon" className="hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </motion.div>
        ))}
      </div>
      {coupons.length === 0 && <div className="text-center py-12 bg-white rounded-2xl"><p className="text-gray-500">No coupons yet. Create your first coupon!</p></div>}
    </div>
  );
};

export default CouponsTab;
  