import React from 'react';
import Layout from '@theme/Layout';
import SigninForm from '../../components/auth/SigninForm';

const SigninPage: React.FC = () => {
  return (
    <Layout title="Sign In" description="Sign in to access your personalized content">
      <main style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <div className="container">
          <div className="row">
            <div className="col col--6 col--offset-3">
              <SigninForm />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SigninPage;