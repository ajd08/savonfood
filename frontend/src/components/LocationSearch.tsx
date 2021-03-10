import React, { useState } from "react";
import  Input from "@material-ui/core/Input";
import  Button from "@material-ui/core/Button";

import { locationState } from "../atoms";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const LocationSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const setLocationState = useSetRecoilState(locationState);
    const [location, setLocation] = useRecoilState(locationState);

    const onChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const onClick = () => {
        setLocationState((location) => inputValue); 
        setInputValue('');
    }

    return (
        <div>
            {location == '' && (
                <div className="LocationSearch">
                    <h1>BASiL</h1>
                    <Input onChange={onChange} value={inputValue} />
                    <Button onClick={onClick} variant="contained" color="primary"/>
                </div>
            )}
        </div>
    );
};

export { LocationSearch };
