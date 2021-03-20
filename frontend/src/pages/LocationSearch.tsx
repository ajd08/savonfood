import React, { useState, useEffect } from "react";
import { Input, Button, Zoom, Fade, CircularProgress } from "@material-ui/core";
import { LocationSearchInput } from "../components/LocationSearchInput";
import { locationState, locationSearchState } from "../atoms";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
    useRecoilValueLoadable,
} from "recoil";

const axios = require("axios");

const LocationSearch = () => {
    const check = true;
    return (
        <div className="LocationSearch-container">
            <div className="LocationSearch" id="LocationSearch">
                <Fade in={true} timeout={2000}>
                    <h1>THYME</h1>
                </Fade>

                <Fade
                    in={check}
                    timeout={2000}
                    style={{ transitionDelay: check ? "2000ms" : "0ms" }}
                >
                    <LocationSearchInput />
                </Fade>
            </div>
        </div>
    );
};

export { LocationSearch };
