import {deleteEvent, updateEvent, UserEvent} from "./user-events-slice";
import React, {ChangeEvent, useState} from "react";
import {useAppDispatch} from "../../redux/store";

interface Props {
    eventItem: UserEvent
}

const EventItem : React.FC<Props> = ({ eventItem}) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<UserEvent['title']>(eventItem.title);
    const handleDelete = () => {
        dispatch(deleteEvent(eventItem.id));
    }

    const handleUpdate = () => {
        const updated = {...eventItem};
        updated.title = title;
        dispatch(updateEvent(updated));
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
       setTitle(event.target.value);
    };

    return (
        <div className="calendar-event">
            <div className="calendar-event-info">
                <div className="calendar-event-time">10:00 - 12:00</div>
                <div className="calendar-event-title">
                    <input
                        type="text"
                        value={title}

                        onChange={handleChange}
                        onBlur={handleUpdate}
                    />
                </div>
            </div>
            <button className="calendar-event-delete-button" onClick={handleDelete}>
                &times;
            </button>
        </div>
    )
}

export default EventItem;