import * as React from 'react';
import {useEffect, useState} from "react";

const useDebounce = (value, timeout) => {
    const [state, setState] = useState(value);

    const effect = () => {
        const handler = setTimeout(() => setState(value), timeout);

        return () => clearTimeout(handler);
    };

    useEffect(effect, [value]);

    return state;
};

const Trim = ({ text, dataTestId = '' }) => {
    const [debounce, setDebounce] = React.useState(0);

    const [overflow, setOverflow] = React.useState(false);
    const trimRef = React.useRef(document.createElement('span'));
    const hiddenTextRef = React.useRef(document.createElement('span'));
    const debounceTracker = useDebounce(debounce, 300);

    const listener = () => {
        setDebounce(debounce + 1);
    };

    const effect = () => {
        window.addEventListener('resize', listener);
        return () => {
            window.removeEventListener('resize', listener);
        };
    };

    React.useEffect(effect, [debounce]);

    React.useEffect(() => {
        if (trimRef.current && hiddenTextRef.current) {
            const diff = hiddenTextRef.current.offsetWidth - trimRef.current.offsetWidth;
            setOverflow(diff > 1);
        }
    }, [debounceTracker]);

    return (
        <span className={"trim-wrapper"}>
            <span ref={trimRef} className={`trim ${overflow ? 'overflow' : ''}`}>
                <span ref={hiddenTextRef} className="hidden-text-ref" data-testid={dataTestId}>
                    {text}
                </span>

                {overflow ? (
                    <>
                        <span className="left">
                            <span>{String(text).substring(0, Math.floor(text.length / 2))}</span>
                        </span>
                        <span className="ellipsis">...</span>
                        <span className="right">
                            <span>{String(text).substring(Math.ceil(text.length / 2))}</span>
                        </span>
                    </>
                ) : (
                    <>{text}</>
                )}
            </span>
        </span>
    );
};

export default Trim;