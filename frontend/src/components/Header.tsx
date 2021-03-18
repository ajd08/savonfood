import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Header = () => {
    return (
        <Router>
            <div className="Header-container">
                <header id="Header">
                    <h2>BASiL</h2>
                </header>
                <div className="header-navigation">
                    <Link className="link-appetizers" to="/home">APPETIZERS</Link>
                    <Link className="link-entrees" to="/home">ENTRÉES</Link>
                    <Link className="link-desserts" to="/home">DESSERTS</Link>
                    <Link className="link-cocktails" to="/home">COCKTAILS</Link>
                </div>
            </div>
        </Router>
    );
};

export { Header };
