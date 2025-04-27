import { NavLink, Outlet } from "react-router-dom";
import './Layout.scss';

const testMenuItems = [
    { href: "/", title: "Home" },
    { href: "/inventory", title: "Inventory" },
];

const Layout = () => {
    return (
        <div className="layout">
            <aside className="sidebar">
                <nav>
                    <ul>
                        {testMenuItems.map(({ href, title }) => (
                            <li key={title}>
                                <NavLink to={href} className="nav-link">
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