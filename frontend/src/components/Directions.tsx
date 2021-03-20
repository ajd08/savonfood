import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Icon from "@material-ui/core/Icon";
import { Button } from "@material-ui/core";
import { VerticalTabButton } from "../components/VerticalTabButton";
import { selectedRecipeState, stepState, currentStepTextState } from "../atoms";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
    useRecoilValueLoadable,
} from "recoil";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function VerticalTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const recipeLoadable = useRecoilValueLoadable(selectedRecipeState);
    //const stepLoadable = useRecoilValueLoadable(currentStepTextState);
    const currentStep = useRecoilValue(stepState);

    switch (recipeLoadable.state) {
        case "hasValue":
            let steps = recipeLoadable.contents.instructions[0].steps;
            console.log(steps);
            console.log(currentStep);
            return (
                <div className="Directions-container" id="Directions-container">
                    <div className="step-text">
                        {steps[currentStep - 1].step
                            .split(".")
                            .map((sentence: string) => {
                                console.log(sentence.trim());
                                return (
                                    <p>
                                        {sentence.trim().toString() 
                                        }
                                    </p>
                                );
                            })}
                    </div>
                    <div className="steps">
                        {steps.map((step: any) => {
                            return <VerticalTabButton index={step.number} />;
                        })}
                    </div>
                </div>
            );
        case "loading":
            return <div></div>;

        case "hasError":
            return <div></div>;
    }
}
export { VerticalTabs };
