import {deleteEvent, updateEvent, UserEvent} from "./user-events-slice";
import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../redux/store";
import {addZero} from "../../lib/utils";


const createTime = (dateString: string) => {
    const date = new Date(dateString);
    return  `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
};

interface Props {
    eventItem: UserEvent
}

const EventItem : React.FC<Props> = ({ eventItem}) => {
    const dispatch = useAppDispatch();
    const [title, setTitle] = useState<UserEvent['title']>(eventItem.title);
    const [editing, setEditing] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null)
    const handleDelete = () => {
        dispatch(deleteEvent(eventItem.id));
    }

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    const handleUpdate = () => {
        const updated = {...eventItem};
        updated.title = title;
        dispatch(updateEvent(updated));
        setEditing(false);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
       setTitle(event.target.value);
    };

    return (
        <div className="calendar-event"
             tabIndex={0}  // Make the div focusable
             onClick={() => setEditing(true)}
             style={{ outline: 'none' }}  // Optionally remove the outline on focus
        >
            <div className="calendar-event-info">
                <div className="calendar-event-time">
                    {createTime(eventItem.dateStart)} - {createTime(eventItem.dateEnd)}
                </div>
                <div className="calendar-event-title"  style={{display: editing ? 'block' : 'none'}}>
                    <input
                        type="text"
                        value={title}
                        ref={inputRef}
                        onBlur={handleUpdate}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="calendar-event-title" style={{display: editing ? 'none' : 'block'}}>
                {eventItem.title}
            </div>
            <button className="calendar-event-delete-button" onClick={handleDelete}>
                &times;
            </button>
        </div>
    )
}

export default EventItem;