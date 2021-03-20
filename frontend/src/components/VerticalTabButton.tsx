import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Icon from "@material-ui/core/Icon";
import { Button } from "@material-ui/core";
import React, { useState, useEffect } from 'react';
import {stepState} from "../atoms";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
    useRecoilValueLoadable,
} from "recoil";

const VerticalTabButton = (props: any) => {
    const [className, setClassName] = useState('btn');

    const index = props.index;
    const [currentStep, setCurrentStep] = useRecoilState(stepState);

    const onClick = (e: any) => {
        setCurrentStep(index);
    };

    useEffect(() => {
        if(currentStep == index) {
            setClassName("btn btn-active");
        }
        else {
            setClassName("btn");
        }
        console.log(currentStep);
    })

    return (
        <div className="link-container">
            <div className={className}>
                <a onClick={onClick}> {props.index} </a>
            </div>
        </div>
    );
}
export { VerticalTabButton };
