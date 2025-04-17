import React from 'react';

const Header = () => {
    return (
        <header style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Your Company Name</h1>
        <nav style={{ marginTop: '10px' }}>
            <a href="/" style={{ margin: '0 15px', textDecoration: 'none', color: '#007bff' }}>Home</a>
            <a href="/about" style={{ margin: '0 15px', textDecoration: 'none', color: '#007bff' }}>About</a>
            <a href="/contact" style={{ margin: '0 15px', textDecoration: 'none', color: '#007bff' }}>Contact</a>
        </nav>
        </header>
    );
    }   

export default Header;