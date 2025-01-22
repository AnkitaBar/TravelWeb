import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import styles from '@/styles/Register.module.css'; // Import the CSS module
import { supabase } from '@/lib/supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Register user with Supabase auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        name,
        password,
      });

      if (authError) throw new Error(authError.message);

      // Insert user data into the 'users' table
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .insert([
          {
            name:name,
            email: email,
            password:password
          },
        ]);

      if (dbError) throw new Error(dbError.message);

      setMessage('Registration successful! Please check your email to verify.');

      // Success toast
      toast.success('Registration successful! Please check your email to verify.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      router.push('/auth/login'); // Redirect to login page
    } catch (err) {
      setError(err.message);

      // Error toast
      toast.error(err.message || 'Registration failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <h2 className="h2">Register</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
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
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>

        <div className={styles.links}>
          <a href="/auth/login" className={styles.link}>
            Sign In
          </a>
        </div>
      </div>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
};

export default Register;
