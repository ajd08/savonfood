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
                    <a href="/home">APPETIZERS</a>
                    <a href="/home">ENTREES</a>
                    <a href="/home">DESSERTS</a>
                    <a href="/home">COCKTAILS</a>
                </div>
            </div>
        </Router>
    );
};

export { Header };
