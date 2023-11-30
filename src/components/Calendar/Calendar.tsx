import './Calendar.css';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {loadEvents, UserEvent} from "./user-events-slice";
import {RootState, useAppDispatch} from "../../redux/store";
import { addZero } from '../../lib/utils';


const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};

  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(event);
  };

  events.forEach(event => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateEnd));

    addToGroup(dateStartKey, event);

    if (dateEndKey !== dateStartKey) {
      addToGroup(dateEndKey, event);
    }
  });

  return groups;
};

const Calendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const eventsData = useSelector((state: RootState) => state.userEvents.byIds);
  const events = Object.values(eventsData);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
        (date1, date2) => +new Date(date1) - +new Date(date2)
    );
  }

  return groupedEvents && sortedGroupKeys ? (
      <div className="calendar">
        {sortedGroupKeys.map(dayKey => {
          const events = groupedEvents ? groupedEvents[dayKey] : [];
          const groupDate = new Date(dayKey);
          const day = groupDate.getDate();
          const month = groupDate.toLocaleString(undefined, { month: 'long' });

          return (
              <div className="calendar-day" key={`${day}-${month}`}>
                <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
                </div>
                <div className="calendar-events">
                  {events.map(event => {
                    return (
                        <div className="calendar-event" key={event.id}>
                          <div className="calendar-event-info">
                            <div className="calendar-event-time">10:00 - 12:00</div>
                            <div className="calendar-event-title">{event.title}</div>
                          </div>
                          <button className="calendar-event-delete-button">
                            &times;
                          </button>
                        </div>
                    );
                  })}
                </div>
              </div>
          );
        })}
      </div>
  ) : (
      <p>Loading...</p>
  );
};

export default Calendar;
