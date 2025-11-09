import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import './Layout.scss';

const testMenuItems = [
    { href: "/", title: "Home" },
    { href: "/inventory", title: "Inventory" },
    { href: "/aging-report", title: "Aging Report" },
    { href: "/payment-extract", title: "Payment Extract" },
    { href: "/bank-statement", title: "Bank Statement" },
];

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    
    return (
        <div className="layout">
            <button 
                className="hamburger-button" 
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    {sidebarOpen ? (
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" 
                        />
                    ) : (
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 6h16M4 12h16M4 18h16" 
                        />
                    )}
                </svg>
            </button>
            
            <div 
                className={`overlay ${sidebarOpen ? 'active' : ''}`} 
                onClick={closeSidebar}
            ></div>
            
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>PyGrays</h2>
                </div>
                <nav>
                    <ul>
                        {testMenuItems.map(({ href, title }) => (
                            <li key={title}>
                                <NavLink 
                                    to={href} 
                                    className={({ isActive }) => 
                                        `nav-link ${isActive ? 'active' : ''}`
                                    }
                                    onClick={() => {
                                        if (window.innerWidth < 992) {
                                            closeSidebar();
                                        }
                                    }}
                                >
                                    {title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;