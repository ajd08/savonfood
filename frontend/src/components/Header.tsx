import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Header = () => {
    return (
        <Router>
            <header id="Header">
                <div className="Header-container">
                    <h2>BASiL</h2>
                </div>
            </header>
        </Router>
    );
};

export { Header };
