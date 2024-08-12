import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
} from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import ScheduleService from "../../services/ScheduleService";
import '../../context/ScheduleMaintenance.css';

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) =>
    format(date, formatStr, { ...options, locale: es }),
  parse: (dateString, formatString, options) =>
    parse(dateString, formatString, new Date(), { ...options, locale: es }),
  startOfWeek: (date, options) => startOfWeek(date, { ...options, locale: es }),
  getDay: (date) => getDay(date),
  locales,
});

const DragAndDropCalendar = withDragAndDrop(Calendar);

export function ScheduleMaintenance() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(Views.WEEK);
  const storeId = localStorage.getItem("selectedStoreId");

  useEffect(() => {
    if (storeId) {
      fetchSchedules(storeId);
    }
  }, [storeId, date]);

  const fetchSchedules = useCallback((storeId) => {
    console.log("fetchSchedules called with storeId:", storeId);
    ScheduleService.getSchedulesByStore(storeId)
      .then((response) => {
        console.log("API Response:", response);
        if (response && Array.isArray(response)) {
          const formattedEvents = response.map((schedule) => {
            const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
            const eventDate = addDays(weekStartDate, schedule.dayOfWeek - 1);

            const [startHour, startMinute] = schedule.startTime.split(":").map(Number);
            const startDate = new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              startHour,
              startMinute
            );

            const [endHour, endMinute] = schedule.endTime.split(":").map(Number);
            const endDate = new Date(
              eventDate.getFullYear(),
              eventDate.getMonth(),
              eventDate.getDate(),
              endHour,
              endMinute
            );

            const event = {
              id: schedule.id,
              title: schedule.type === "horario" ? "Horario Disponible" : "Bloqueado",
              start: startDate,
              end: endDate,
              allDay: false,
              resource: schedule.type,
            };

            console.log("Created Event:", event);
            return event;
          });

          console.log("Formatted Events:", formattedEvents);
          setEvents(formattedEvents);
        } else {
          console.log("No results in response");
          setEvents([]); 
        }
      })
      .catch((error) => {
        console.error("Error al obtener los horarios:", error);
        setEvents([]);
      });
  }, [date]);

  const handleEventResize = ({ event, start, end }) => {
    if (event.resource === "horario") {
      const confirmation = window.confirm(
        "Está a punto de modificar un horario fijo. ¿Desea continuar?"
      );
      if (!confirmation) {
        return;
      }
    }

    if (!event.id) {
      console.error("Event ID is undefined");
      return;
    }

    const nextEvents = events.map((existingEvent) =>
      existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    setEvents(nextEvents);
    updateScheduleOnServer(event.id, start, end);
  };

  const handleEventDrop = ({ event, start, end }) => {
    if (event.resource === "horario") {
      const confirmation = window.confirm(
        "Está a punto de mover un horario fijo. ¿Desea continuar?"
      );
      if (!confirmation) {
        return;
      }
    }
  
    if (!event.id) {
      console.error("Event ID is undefined");
      return;
    }
  
    const nextEvents = events.map((existingEvent) =>
      existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    setEvents(nextEvents);
    updateScheduleOnServer(event.id, start, end);  // Asegúrate de que event.id no sea undefined
  };
  

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Ingrese un título para este horario");
    if (title) {
      const newEvent = {
        start,
        end,
        title,
        id: Math.random(), 
        allDay: false,
        resource: "custom", 
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      createScheduleOnServer(newEvent);
    }
  };

  const handleEventDelete = (eventId) => {
    const confirmation = window.confirm(
      "¿Está seguro de que desea eliminar este bloque?"
    );
    if (confirmation) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      deleteScheduleOnServer(eventId);
    }
  };

  const updateScheduleOnServer = (eventId, start, end) => {
    if (!eventId) {
      console.error("Event ID is undefined for update");
      return;
    }
    ScheduleService.updateSchedule(eventId, { start, end })
      .then(response => {
        console.log('Horario actualizado en el servidor:', response);
      })
      .catch(error => {
        console.error('Error al actualizar el horario:', error);
      });
  };

  const createScheduleOnServer = (event) => {
    ScheduleService.createSchedule(event)
      .then(response => {
        console.log('Horario creado en el servidor:', response);
      })
      .catch(error => {
        console.error('Error al crear el horario:', error);
      });
  };

  const deleteScheduleOnServer = (eventId) => {
    if (!eventId) {
      console.error("Event ID is undefined for deletion");
      return;
    }
    ScheduleService.deleteSchedule(eventId)
      .then(response => {
        console.log('Horario eliminado en el servidor:', response);
      })
      .catch(error => {
        console.error('Error al eliminar el horario:', error);
      });
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div style={{ paddingTop: "70px", marginRight: "140px" }}>
      <div style={{ height: "80vh", width: "100%" }}>
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          onNavigate={handleNavigate}
          defaultView={view}
          views={["week", "month"]}
          onView={handleViewChange}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          selectable
          onSelectSlot={handleSelectSlot}
          resizable
          style={{ height: "80vh", width: "170%" }}
          components={{
            event: EventWithDeleteButton,
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  );
}

const EventWithDeleteButton = ({ event }) => (
  <div>
    <span>{event.title}</span>
    <button
      onClick={() => handleEventDelete(event.id)}
      style={{
        position: "absolute",
        top: "2px",
        right: "2px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        cursor: "pointer",
      }}
    >
      ×
    </button>
  </div>
);

const CustomToolbar = ({ date, view, onNavigate, onView }) => {
  const goToBack = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const currentLabel = () => {
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), "dd MMM", {
      locale: es,
    });
    const end = format(addDays(startOfWeek(date, { weekStartsOn: 1 }), 6), "dd MMM", {
      locale: es,
    });
    return view === Views.WEEK
      ? `${start} - ${end}`
      : format(date, "MMMM yyyy", { locale: es });
  };

  return (
    <div
      className="rbc-toolbar"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <span className="rbc-btn-group">
        <button onClick={goToBack}>&lt;</button>
        <span className="rbc-toolbar-label">{currentLabel()}</span>
        <button onClick={goToNext}>&gt;</button>
      </span>
      <span className="rbc-btn-group">
        <button onClick={() => onView(Views.WEEK)}>Semana</button>
        <button onClick={() => onView(Views.MONTH)}>Mes</button>
      </span>
    </div>
  );
};
