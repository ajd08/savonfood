import "./App.css";
import React from "react";
import { LocationSearch } from "./components/LocationSearch";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from "recoil";

function App() {
    return (
        <RecoilRoot>
            <div className="App">
                <LocationSearch/>
            </div>
        </RecoilRoot>
    );
}

export default App;
