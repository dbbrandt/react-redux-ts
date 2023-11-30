import React, {useRef, useState, useEffect, ChangeEvent} from 'react';
import './Recorder.css';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import {startRecording, stopRecording} from './recorder-slice';
import {RootState, useAppDispatch} from "../../redux/store";
import { addZero } from "../../lib/utils";
import {createEvent, initialEvent, UserEvent} from "../Calendar/user-events-slice";

const Recorder = () => {
    const dispatch = useAppDispatch();
    const dateStart = useSelector((state: RootState) => state.recorderEvents.dateStart);
    const started = dateStart !== '';
    const interval = useRef<number>(0);
    const [, setCount] = useState<number>(0);
    const [event, setEvent] = useState<UserEvent>(initialEvent);

    const handleClick = () => {
        if (started) {
            window.clearInterval(interval.current);
            dispatch(stopRecording());
            event.dateEnd = new Date().toISOString();
            dispatch(createEvent(event));
            setEvent(initialEvent);
        } else {
            if (event.title === "") alert("Please enter a title first.");
            else {
                dispatch(startRecording());
                event.dateStart = new Date().toISOString();
                interval.current = window.setInterval(() => {
                    setCount(count => count + 1);
                }, 1000);
            }
        }
    };

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEvent(prev => ({
            ...prev,  // Spread the previous state
            title: event.target.value  // Update the title property
        }));
    };

    useEffect(() => {
        return () => {
            window.clearInterval(interval.current);
        };
    }, []);

    let seconds = started
        ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
        : 0;
    const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
    seconds -= hours * 60 * 60;
    const minutes = seconds ? Math.floor(seconds / 60) : 0;
    seconds -= minutes * 60;

    return (
        <div className={cx('recorder', { 'recorder-started': started })}>
            <button onClick={handleClick} className="recorder-record">
                <span></span>
            </button>
            <div className="recorder-counter">
                {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
            </div>
            <div>
                <input
                    type="text"
                    value={event.title}
                    onChange={handleTitleChange}
                    placeholder="Enter a title"
                />
            </div>

        </div>
    );
};

export default Recorder;
