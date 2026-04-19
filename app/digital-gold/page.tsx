'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLiveRates } from '@/hooks/use-live-rates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Vault, TrendingUp, History, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';

export default function DigitalGoldVault() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading } = useAuth();
  const { rates } = useLiveRates();
  
  const [amountInr, setAmountInr] = useState('');
  const [grams, setGrams] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // Get 24K gold rate
  const goldRate = rates.find(r => r.metal === 'Gold' && r.purity === '24K');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // Load transactions
  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/digital-gold/transactions?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Convert rupees to grams
  useEffect(() => {
    if (amountInr && goldRate) {
      const calculatedGrams = Math.floor((parseFloat(amountInr) / goldRate.price) * 100) / 100;
      setGrams(calculatedGrams);
    } else {
      setGrams(0);
    }
  }, [amountInr, goldRate]);

  const handleBuyGold = async () => {
    if (!amountInr || !user?.id || !goldRate) {
      setMessage('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      const response = await fetch('/api/digital-gold/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amountInr: parseFloat(amountInr),
          gramsToReceive: grams,
          rateApplied: goldRate.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }

      setMessage(`Successfully purchased ${grams}g of digital gold!`);
      setAmountInr('');
      setGrams(0);

      // Refresh balance and transactions
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Purchase error:', error);
      setMessage('Failed to process purchase. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-richblack-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-cream-deep rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-richblack" />
          </button>
          <div>
            <h1 className="font-playfair text-4xl text-richblack flex items-center gap-3">
              <Vault className="w-8 h-8 text-gold" />
              Digital Gold Vault
            </h1>
            <p className="text-richblack-muted mt-2">Buy and manage your digital gold holdings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vault Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-gold/10 to-cream-deep border-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Vault className="w-6 h-6" />
                    Your Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-richblack-muted text-sm mb-2">Total Digital Gold</p>
                      <motion.p
                        key={profile?.digital_gold_balance}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        className="text-5xl font-bold text-gold"
                      >
                        {profile?.digital_gold_balance?.toFixed(2) || '0.00'}
                        <span className="text-lg font-semibold ml-2">grams</span>
                      </motion.p>
                    </div>
                    {goldRate && (
                      <div className="pt-4 border-t border-gold/20">
                        <p className="text-richblack-muted text-sm mb-1">Current Rate (24K)</p>
                        <p className="text-2xl font-semibold text-richblack">
                          ₹{goldRate.price.toLocaleString('en-IN')}/gram
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Buy Gold Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Buy Digital Gold</CardTitle>
                  <p className="text-richblack-muted text-sm mt-2">Enter amount in rupees to convert to grams</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {message && (
                    <Alert className={message.includes('Successfully') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription className={message.includes('Successfully') ? 'text-green-700' : 'text-red-700'}>
                        {message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {!goldRate && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription className="text-yellow-700">
                        Gold rate data is loading. Please wait...
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    {/* Amount Input */}
                    <div>
                      <Label htmlFor="amount" className="text-base font-semibold mb-2 block">
                        Amount (₹)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-richblack-muted text-lg">₹</span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount in rupees"
                          value={amountInr}
                          onChange={(e) => setAmountInr(e.target.value)}
                          className="pl-8 py-6 text-lg"
                          disabled={!goldRate || processing}
                        />
                      </div>
                    </div>

                    {/* Grams Display */}
                    <div>
                      <Label className="text-base font-semibold mb-2 block">
                        You will receive
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-richblack-muted text-lg">📊</span>
                        <Input
                          type="text"
                          placeholder="0.00"
                          value={grams.toFixed(2)}
                          disabled
                          className="pl-8 py-6 text-lg bg-cream-deep"
                        />
                      </div>
                      <p className="text-richblack-muted text-sm mt-2">
                        Based on current rate: ₹{goldRate?.price.toLocaleString('en-IN')}/gram
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleBuyGold}
                    disabled={!amountInr || !goldRate || processing}
                    className="btn-gold w-full py-6 text-lg"
                  >
                    {processing ? 'Processing...' : 'Buy Now'}
                  </Button>

                  {/* Info Box */}
                  <div className="bg-cream-deep p-4 rounded-lg space-y-2">
                    <p className="text-sm font-semibold text-richblack">How it works:</p>
                    <ul className="text-sm text-richblack-muted space-y-1 list-disc list-inside">
                      <li>Enter the amount in rupees you want to invest</li>
                      <li>We calculate grams based on real-time 24K gold rates</li>
                      <li>Your digital gold is added to your vault instantly</li>
                      <li>Track all transactions in the history section</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Current Rate Card */}
            {goldRate && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Market Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">
                      ₹{goldRate.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-blue-600 text-sm mt-2">Per gram (24K)</p>
                    <div className="mt-4 p-3 bg-white rounded flex items-center gap-2">
                      <span className={`text-lg ${goldRate.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {goldRate.trend === 'up' ? '↑' : '↓'}
                      </span>
                      <span className={`font-semibold ${goldRate.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {goldRate.change_percent?.toFixed(2) || '0.00'}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Common Amounts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Amounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['10000', '25000', '50000', '100000'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAmountInr(amount)}
                    disabled={!goldRate || processing}
                    className="w-full py-2 px-3 border border-gold text-gold hover:bg-gold/5 rounded transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    ₹{parseInt(amount).toLocaleString('en-IN')}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTransactions ? (
                <p className="text-richblack-muted text-center py-8">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-richblack-muted text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-cream-deep rounded-lg">
                      <div>
                        <p className="font-semibold text-richblack">{tx.transaction_type}</p>
                        <p className="text-sm text-richblack-muted">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-richblack">+{tx.grams_received.toFixed(2)}g</p>
                        <p className="text-sm text-richblack-muted">₹{tx.amount_inr.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
