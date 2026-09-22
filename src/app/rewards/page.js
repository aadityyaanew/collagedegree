import RewardsClient from './RewardsClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Rewards & Grants | Compare Degree',
  description: 'Explore available scholarships, grants, and referral rewards at Compare Degree.',
};

export default function RewardsPage() {
  return (
    <>
      <Navbar />
      <RewardsClient />
      <Footer />
    </>
  );
}
