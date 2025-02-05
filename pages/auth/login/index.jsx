
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/lib/useAuthStore';
import styles from '@/styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { setUserId, setUserRole } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      const userId = authData.user.id;
      setUserId(userId);

      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

      if (dbError) {
        setError('Failed to fetch user role. Please try again.');
        return;
      }

      const userRole = userData.role;
      setUserRole(userRole);

      router.push(userRole === 'admin' ? '/' : '/');
    } catch (err) {
      console.error('Unexpected error:', err.message);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.background}>
  <div className={styles.formContainer}>
    <h2 className="h2">Login</h2>
    <form onSubmit={handleLogin} className={styles.form}>
      {/* Email Input */}
      <div className={styles.inputGroup}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      
      {/* Password Input */}
      <div className={styles.inputGroup}>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      
      {/* Remember Me */}
      <div className={styles.rememberMe}>
        <input
          type="checkbox"
          id="rememberMe"
          className={styles.checkbox}
        />
        <label htmlFor="rememberMe">Remember Me</label>
      </div>
      
      {/* Error Message */}
      {error && <p className={styles.error}>{error}</p>}
      
      {/* Submit Button */}
      <button type="submit" className={styles.button}>
        Login
      </button>
    </form>
    
    {/* Links for Forget Password and Sign Up */}
    <div className={styles.links}>
      <a href="/forgot-password" className={styles.link}>
        Forgot Password?
      </a>
      <a href="/auth/register" className={styles.link}>
        Sign Up
      </a>
    </div>
  </div>
</div>

  );
};

export default Login;



