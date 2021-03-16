import React, { useState } from "react";
import { Input, Button, Zoom, Fade } from "@material-ui/core";
import { locationState } from "../atoms";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const Home = () => {
    return (
        <div className="home-container">
            <div className="home" id="home">
                <h1>Hello World</h1>
            </div>
        </div>
    );
};

export { Home };
