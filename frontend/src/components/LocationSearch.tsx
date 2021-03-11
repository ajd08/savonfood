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

const LocationSearch = () => {
    const [inputValue, setInputValue] = useState("");
    const [location, setLocationState] = useRecoilState(locationState);

    const check: boolean = true;

    const onClick = () => {
        setLocationState((state) => inputValue);
    };

    const onChange = (event: any) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="LocationSearch-container">
            {location == "" && (
                <div className="LocationSearch" id="LocationSearch">
                    <Fade in={check} timeout={3000}>
                        <h1>BASiL</h1>
                    </Fade>
                    <Fade
                        in={check}
                        timeout={3000}
                        style={{ transitionDelay: check ? "3000ms" : "0ms" }}
                    >
                        <div className="LocationSearch-searchInput">
                            <Input
                                value={inputValue}
                                onChange={onChange}
                                placeholder="enter postal code"
                            />
                            <Button variant="contained" color="primary">
                                Search
                            </Button>
                        </div>
                    </Fade>
                </div>
            )}
        </div>
    );
};

export { LocationSearch };
