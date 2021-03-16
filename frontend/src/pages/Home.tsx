import React, { useState } from "react";
import { Input, Button, Zoom, Fade } from "@material-ui/core";
import { locationState } from "../atoms";
import { Header } from "../components/Header";


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
        <Header/>
    );
};

export { Home };
