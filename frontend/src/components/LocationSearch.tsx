import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";
import { locationState } from "../atoms";

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState
} from "recoil";

const LocationSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [location, setLocationState] = useRecoilState(locationState);

    const onClick = () => {
        setLocationState((state)=>inputValue);
    };

    const onChange = (event: any) => {
        setInputValue(event.target.value);
    };

    return (
        <div>
        {location =='' && (
            <div className="LocationSearch" id="LocationSearch">
                <h1>BASiL</h1>
                <div className="LocationSearch-input">
                    <Input value={inputValue} onChange={onChange} />
                    <Button variant="contained" color="primary">
                        Search
                    </Button>
                </div>
            </div>
            
    )}
        </div>
    )

};

export {LocationSearch};

