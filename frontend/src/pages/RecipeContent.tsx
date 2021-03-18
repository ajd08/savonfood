import React, { useState } from "react";
import {
    Input,
    Button,
    Zoom,
    Fade,
    AppBar,
    Tabs,
    Tab,
    Box,
    Typography,
    CircularProgress,
    Divider,
} from "@material-ui/core";
import { selectedRecipeState } from "../atoms";
import { Header } from "../components/Header";
import { HomePageContent } from "../components/HomePageContent";
import { makeStyles, Theme } from "@material-ui/core/styles";

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

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const handleChange = () => {
    console.log("Something is changing!");
};

//const useStyles = makeStyles((theme: Theme) => ({
//    root: {
//        flexGrow: 1,
//        backgroundColor: theme.palette.background.paper,
//    },
//}));

function SimpleTabs() {
    //const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const recipeLoadable = useRecoilValueLoadable(selectedRecipeState);

    switch (recipeLoadable.state) {
        case "hasValue":
            const regex = /Chicken/i;
            let summary = recipeLoadable.contents.summary;
            let servings = recipeLoadable.contents.servings;
            let calories = recipeLoadable.contents.calories;
            let protein = recipeLoadable.contents.protein;
            let fat = recipeLoadable.contents.fat;

            return (
                <div id="Recipe-container">
                    <div className="header-container">
                        <Link to="/home">
                            <h4> BASiL </h4>
                        </Link>
                        <AppBar position="static">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="simple tabs example"
                            >
                                <Tab label="Ingredients" {...a11yProps(0)} />
                                <Tab label="Direction" {...a11yProps(1)} />
                            </Tabs>
                        </AppBar>
                    </div>
                    <div className="recipe-content">
                        <div className="recipe-content-title">
                            <div className="photo">
                                <img
                                    src={recipeLoadable.contents.image}
                                    alt={recipeLoadable.contents.title}
                                />
                            </div>
                            <div className="recipe-text">
                                <h4> {recipeLoadable.contents.title} </h4>

                                <Divider />
                                <div className="recipe-text-summary">
                                    <div className="text-summary-meta">
                                        <p className="title"> Servings </p>
                                        <p> {servings} </p>
                                    </div>
                                    <div className="vertical-line"></div>
                                    <div className="text-summary-meta">
                                        <p className="title"> Calories </p>
                                        <p> {calories} </p>
                                    </div>
                                    <div className="vertical-line"></div>
                                    <div className="text-summary-meta">
                                        <p className="title"> Protein </p>
                                        <p> {protein} </p>
                                    </div>
                                    <div className="vertical-line"></div>
                                    <div className="text-summary-meta">
                                        <p className="title"> Fat </p>
                                        <p> {fat} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="recipe-content-info">
                            <TabPanel value={value} index={0}>
                                Ingredients
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                Direction
                            </TabPanel>
                        </div>
                    </div>
                </div>
            );
        case "loading":
            return <CircularProgress />;
        case "hasError":
            return <div> </div>;
    }
}

const RecipePage = () => {
    const [value, setValue] = React.useState(0);
    return (
        <Router>
            <Fade in={true} timeout={1000}>
                <SimpleTabs />
            </Fade>
        </Router>
    );
};
//                        <AppBar position="static" color="default">
//                            <Tabs
//                                value={1}
//                                onChange={handleChange}
//                                indicatorColor="primary"
//                                textColor="primary"
//                                variant="fullWidth"
//                                aria-label="full width tabs example"
//                            >
//                                <Tab label="INGREDIENTS" />
//                                <Tab label="DIRECTIONS" />
//                            </Tabs>
//                        </AppBar>

export { RecipePage };
