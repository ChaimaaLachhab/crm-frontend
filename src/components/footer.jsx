import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
      <p style={{ margin: 0 }}>© 2023 CRM Company. All rights reserved.</p>
      <p style={{ margin: 0 }}>
        <a href="/privacy-policy" style={{ textDecoration: 'none', color: '#007bff' }}>Privacy Policy</a> | 
        <a href="/terms-of-service" style={{ textDecoration: 'none', color: '#007bff' }}>Terms of Service</a>
      </p>
    </footer>
  );
}

export default Footer;