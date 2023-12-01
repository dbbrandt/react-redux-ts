import './Calendar.css';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {loadEvents, UserEvent} from "./user-events-slice";
import {RootState, useAppDispatch} from "../../redux/store";
import { addZero } from '../../lib/utils';
import EventItem from "./EventItem";


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
  const eventsData = useSelector((state: RootState) => state.userEvents.byIds);
  const events = Object.values(eventsData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
        (date1, date2) => +new Date(date2) - +new Date(date1)
    );
  }

  return groupedEvents && sortedGroupKeys ? (
      <div className="calendar">
        {sortedGroupKeys.map(dayKey => {
          const events = groupedEvents ? groupedEvents[dayKey] : [];
          const groupDate = new Date(dayKey);
          const day = groupDate.getDate();
          const month = groupDate.toLocaleString(undefined, { month: 'long' });
          const year = groupDate.toLocaleString(undefined, { year: 'numeric' });

          return (
              <div className="calendar-day" key={`${day}-${month}-${year}`}>
                <div className="calendar-day-label">
              <span>
                {day} {month} {year}
              </span>
                </div>
                <div className="calendar-events">
                  {events.map(event => {
                    return (
                        <EventItem key={`eventId-${event.id}`} eventItem={event}/>
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
