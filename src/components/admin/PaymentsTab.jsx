import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const PaymentsTab = () => {
	const [payments, setPayments] = useState([]);

	const fetchPayments = useCallback(async () => {
		try {
			const { data, error } = await supabase
				.from('payments')
				.select(`
          *,
          profiles ( name ),
          courses ( name )
        `)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching payments:', error);
				setPayments([]);
			} else {
				setPayments(data || []);
			}
		} catch (err) {
			console.error('Unexpected error fetching payments:', err);
			setPayments([]);
		}
	}, []);

	useEffect(() => {
		fetchPayments();
	}, [fetchPayments]);

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-gray-900">Payment History</h2>

			<div className="bg-white rounded-2xl shadow-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[600px]">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
								<th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{payments.map((payment, index) => (
								<motion.tr
									key={payment.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: index * 0.05 }}
									className="hover:bg-gray-50"
								>
									<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{payment.profiles?.name || 'N/A'}</td>
									<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{payment.courses?.name || 'N/A'}</td>
									<td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">₹{payment.amount}</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${payment.status === 'success'
												? 'bg-green-100 text-green-700'
												: 'bg-red-100 text-red-700'
											}`}>
											{payment.status}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
										{payment.created_at ? new Date(payment.created_at).toLocaleDateString() : '-'}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{payments.length === 0 && (
					<div className="text-center py-12">
						<CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-500">No payment records yet</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default PaymentsTab;
