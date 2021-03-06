import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { useHistory } from "react-router-dom";

const Header = () => {
    const history = useHistory();


    const onClick = () => (event: any) => {
        history.push('/');
    };

    return (
        <Router>
            <div className="Header-container">
                <Link to="/" onClick={onClick()}>
                    <header id="Header">
                        <h2>THYME</h2>
                    </header>
                </Link>
                <div className="header-navigation">
                    <Link className="link-appetizers" to="/home">
                        APPETIZERS
                    </Link>
                    <Link className="link-entrees" to="/home">
                        ENTRÉES
                    </Link>
                    <Link className="link-desserts" to="/home">
                        DESSERTS
                    </Link>
                    <Link className="link-cocktails" to="/home">
                        About
                    </Link>
                </div>
            </div>
        </Router>
    );
};

export { Header };
