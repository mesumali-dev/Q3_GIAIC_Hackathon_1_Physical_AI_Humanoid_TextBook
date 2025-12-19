import React from 'react';
import Layout from '@theme/Layout';
import SignupForm from '../../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <Layout title="Sign Up" description="Create your account to access personalized content">
      <main style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <div className="container">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <SignupForm />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SignupPage;