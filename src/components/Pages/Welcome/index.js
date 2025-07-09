import React from 'react';
import cx from 'classnames';
import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className={cx(styles.container)}>
      <h1 className={cx(styles.title)}>Welcome to Whiteboard App</h1>
      <p className={cx(styles.subtitle)}>Collaborate. Create. Connect.</p>
      <div className={cx(styles.buttonContainer)}>
        <button className={cx(styles.button)} onClick={() => navigate('/login')}>
          Login
        </button>
        <button className={cx(styles.button)} onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
}
