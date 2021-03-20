import React, { useState, useEffect } from "react";
import { Input, Button, Zoom, Fade, CircularProgress } from "@material-ui/core";
import {
    locationState,
    currentRecipesQuery,
    selectedRecipeState,
} from "../atoms";
import { Header } from "../components/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
    useRecoilValueLoadable,
} from "recoil";

import {selectedRecipePositionState, stepState} from "../atoms";

import { useHistory } from "react-router-dom";

const HomePageContent = () => {
    const history = useHistory();
    const recipesLoadable = useRecoilValueLoadable(currentRecipesQuery);
    const location = useRecoilValue(locationState);
    const recipeLoadable = useRecoilValueLoadable(selectedRecipeState);
    const [step, setStepState] = useRecoilState(stepState);

    const [recipePosition, setRecipePosition] = useRecoilState(selectedRecipePositionState);
    if (location == "") {
        history.push("/");
    }

    const onClick = (index: number) => (event:any) => {
        setRecipePosition(index);
    }

    useEffect(()=> {
        setStepState(1);

    })



    switch (recipesLoadable.state) {
        case "hasValue":
            let recipes = recipesLoadable.contents;
            console.log("ALL RECIPES");
            console.log(recipesLoadable.contents);

            console.log("FOCUSED RECIPE");
            console.log(recipeLoadable.contents);

            return (
                <Fade in={true} timeout={500}>
                    <div className="HomePage-content-container">
                        {recipes.map((recipe: any, index: number) => (
                            <div className="recipe-container">
                                <Link to="/home/recipe" onClick={onClick(index)}>
                                    <div className="photo">
                                        <img
                                            src={recipe.image.replace(
                                                "312x231",
                                                "636x393"
                                            )}
                                            alt={recipe.title}
                                        ></img>
                                    </div>
                                    <div className="photo-caption">
                                        <figcaption>{recipe.title}</figcaption>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        <div className="text-container">
                            <p>
                                Hearty, organic entrees made just a little
                                better than homemade.
                            </p>
                        </div>

                        <div className="text-container">
                            <p>
                                Customized to sale items from your local grocery
                                store.
                            </p>
                        </div>
                    </div>
                </Fade>
            );

        case "loading":
            return (
                <div className="HomePage-content-container">
                    <div className="Location-search-loading">
                        <CircularProgress />
                    </div>
                </div>
            );
        case "hasError":
            return <div className="HomePage-content-container"></div>;
    }
};

export { HomePageContent };
