import React, { useState } from "react";
import { Input, Button, Zoom, Fade } from "@material-ui/core";
import { locationState, currentRecipesQuery } from "../atoms";
import { Header } from "../components/Header";
import { HomePageContent } from "../components/HomePageContent";

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
        <div id="HomePage-container">
            <Header />
            <HomePageContent />
        </div>
    );
};

export { Home };
