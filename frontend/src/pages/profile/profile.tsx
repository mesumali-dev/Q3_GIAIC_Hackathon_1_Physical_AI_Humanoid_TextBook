import React from 'react';
import Layout from '@theme/Layout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import ProfileForm from '../../components/auth/ProfileForm';

const ProfilePage: React.FC = () => {
  return (
    <Layout title="User Profile" description="Manage your profile and background information">
      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <ProtectedRoute>
                <ProfileForm />
              </ProtectedRoute>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ProfilePage;