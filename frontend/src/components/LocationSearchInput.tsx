import React, { useState, useEffect } from "react";
import { Input, Button, Zoom, Fade, CircularProgress } from "@material-ui/core";
import {
    locationState,
    locationSearchState,
    currentRecipesQuery,
} from "../atoms";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
    useRecoilValueLoadable,
} from "recoil";

import { useHistory } from "react-router-dom";

const LocationSearchInput = () => {
    const history = useHistory();
    const recipesLoadable = useRecoilValueLoadable(currentRecipesQuery);
    const [location, setLocationState] = useRecoilState(locationState);
    const [inputValue, setInputValue] = useState("");

    const onChange = (event: any) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        if (
            location != "" &&
            recipesLoadable.state != "loading" &&
            recipesLoadable.state != "hasError"
        ) {
            history.push("/home");
        }
    });

    const onClick = async () => {
        await setLocationState(inputValue);
    };
    const check = true;

    switch (recipesLoadable.state) {
        case "hasValue":
            return (
                <Fade
                    in={check}
                    timeout={2000}
                    style={{ transitionDelay: check ? "2000ms" : "0ms" }}
                >
                  <div className="LocationSearch-searchInput">
                      <Input
                          value={inputValue}
                          onChange={onChange}
                          placeholder="enter postal code"
                      />
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={onClick}
                      >
                          Search
                      </Button>
                  </div>
                </Fade>
            );

        case "loading":
            return (
                <Fade
                    in={check}
                    timeout={500}
                    style={{ transitionDelay: check ? "2000ms" : "0ms" }}
                >
                    <div className="Location-search-loading">
                        <CircularProgress />
                        <div className="container-loading-text">
                            <p>Finding the best recipes for you...</p>
                        </div>
                    </div>
                </Fade>
            );
        case "hasError":
            //setLocationState("");
            return (
                <div className="LocationSearch-searchInput">
                    <Input
                        value={inputValue}
                        onChange={onChange}
                        placeholder="enter postal code"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onClick}
                    >
                        Search
                    </Button>
                    <p> Invalid. Please try again </p>
                </div>
            );
    }
};

export { LocationSearchInput };
