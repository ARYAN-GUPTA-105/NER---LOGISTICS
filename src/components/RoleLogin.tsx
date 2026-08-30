import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, Truck, Building2, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ROLES } from '../data/roles';
import type { RoleId } from '../data/roles';
import { useAuth } from '../context/AuthContext';
import styles from './RoleLogin.module.css';

const IconMap: Record<string, React.ReactNode> = {
  'Truck': <Truck size={28} />,
  'Building2': <Building2 size={28} />,
  'MapPin': <MapPin size={28} />,
  'ShieldCheck': <ShieldCheck size={28} />
};

interface RoleLoginProps {
  roleId: RoleId;
  onChangeRole: () => void;
}

export const RoleLogin: React.FC<RoleLoginProps> = ({ roleId, onChangeRole }) => {
  const role = ROLES.find(r => r.id === roleId);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, signup, authState, error: authError, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let valid = true;
    if (!email) {
      setEmailError('Email or username is required.');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) return;

    if (mode === 'login') {
      await login(roleId, email, password);
    } else {
      await signup(roleId, email, password);
    }
  };

  if (!role) return null;

  if (authState === 'authenticated') {
    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.successMsg}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Successfully Authenticated</h2>
            <p>Welcome back, {role.name}.</p>
            <button className={styles.loginBtn} style={{ marginTop: '2rem' }} onClick={() => { logout(); onChangeRole(); }}>
              Log out / Change Role
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <button className={styles.backBtn} onClick={() => { logout(); onChangeRole(); }} type="button">
          <ArrowLeft size={18} />
          Change role
        </button>

        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            {IconMap[role.icon]}
          </div>
          <h2 className={styles.title}>{role.name} {mode === 'login' ? 'Login' : 'Registration'}</h2>
        </header>

        {authError && (
          <div className={styles.globalError}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email or Username</label>
            <div className={styles.inputWrapper}>
              <input
                id="email"
                type="text"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!emailError}
                disabled={authState === 'authenticating'}
                placeholder="Enter your email"
              />
            </div>
            {emailError && <span className={styles.errorMsg}>{emailError}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!passwordError}
                disabled={authState === 'authenticating'}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={authState === 'authenticating'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <span className={styles.errorMsg}>{passwordError}</span>}
          </div>

          <div className={styles.row}>
            <label className={styles.checkboxWrapper}>
              <input type="checkbox" className={styles.checkbox} disabled={authState === 'authenticating'} />
              <span className={styles.checkboxLabel}>Remember me</span>
            </label>
            <a href="#" className={styles.link}>Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className={styles.loginBtn}
            disabled={authState === 'authenticating'}
          >
            {authState === 'authenticating' ? (
              <>
                <Loader2 size={20} className={styles.spinner} />
                {mode === 'login' ? 'Authenticating...' : 'Registering...'}
              </>
            ) : (
              mode === 'login' ? 'Login' : 'Sign Up'
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              className={styles.link}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setEmailError('');
                setPasswordError('');
              }}
              disabled={authState === 'authenticating'}
            >
              {mode === 'login' 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
