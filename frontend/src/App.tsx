import "./App.css";
import React from "react";
import { LocationSearch } from "./pages/LocationSearch";
import { Home } from "./pages/Home";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from "recoil";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
    return (
        <RecoilRoot>
            <Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/">
                            <LocationSearch />
                        </Route>
                        <Route path="/home">
                            <Home />
                        </Route>
                        <Route path="/dashboard"></Route>
                    </Switch>
                </div>
            </Router>
        </RecoilRoot>
    );
}

export default App;
