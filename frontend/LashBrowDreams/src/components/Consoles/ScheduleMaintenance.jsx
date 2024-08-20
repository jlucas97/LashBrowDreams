import React, { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useNavigate } from "react-router-dom";
import ScheduleService from "../../services/ScheduleService";
import ReservationServices from "../../services/ReservationServices";
import StoreServices from "../../services/StoreServices";
import "../../context/ScheduleMaintenance.css";

const locales = { es };
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
  const [storeId, setStoreId] = useState(
    localStorage.getItem("selectedStoreId")
  );
  const [stores, setStores] = useState([]);
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "1") fetchStores();
    if (storeId) fetchSchedulesAndReservations(storeId);
  }, [storeId, date, userRole]);

  const fetchStores = useCallback(() => {
    StoreServices.getStores()
      .then((response) => {
        const mappedStores = response.data.results.map((store) => ({
          id: store.id,
          name: store.name,
        }));
        setStores(mappedStores);
      })
      .catch(console.error);
  }, []);

  const fetchSchedulesAndReservations = useCallback(
    (storeId) => {
      const formattedEvents = [];

      ScheduleService.getSchedulesByStore(storeId)
        .then((scheduleResponse) => {
          if (Array.isArray(scheduleResponse)) {
            scheduleResponse.forEach((schedule) => {
              const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
              const eventDate = addDays(weekStartDate, schedule.dayOfWeek - 1);

              const [startHour, startMinute] = schedule.startTime
                .split(":")
                .map(Number);
              const startDate = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                startHour,
                startMinute
              );

              const [endHour, endMinute] = schedule.endTime
                .split(":")
                .map(Number);
              const endDate = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                endHour,
                endMinute
              );

              formattedEvents.push({
                id: schedule.id,
                title:
                  schedule.type === "horario"
                    ? "Horario Disponible"
                    : "Bloqueado",
                start: startDate,
                end: endDate,
                allDay: false,
                resource: schedule.type,
              });
            });
          }

          return ReservationServices.getReservationsByStoreAndUser(storeId);
        })
        .then((reservationResponse) => {
          if (Array.isArray(reservationResponse.results)) {
            reservationResponse.results.forEach((reservation) => {
              const reservationDate = new Date(reservation.date);
              const [startHour, startMinute] = reservation.time
                .split(":")
                .map(Number);

              const startDate = new Date(
                reservationDate.getFullYear(),
                reservationDate.getMonth(),
                reservationDate.getDate(),
                startHour,
                startMinute
              );

              const endDate = new Date(startDate);
              endDate.setHours(startDate.getHours() + 1);

              formattedEvents.push({
                id: reservation.id,
                title: `Reservado - ${reservation.status}`,
                start: startDate,
                end: endDate,
                allDay: false,
                resource: "reserva",
                status: reservation.status,
              });
            });

            setEvents(formattedEvents);
          }
        })
        .catch(console.error);
    },
    [date]
  );

  const handleStoreChange = (event) => {
    const selectedStoreId = event.target.value;
    setStoreId(selectedStoreId);
    localStorage.setItem("selectedStoreId", selectedStoreId);
    fetchSchedulesAndReservations(selectedStoreId);
  };

  const handleEventResize = ({ event, start, end }) => {
    if (event.resource === "horario") {
        const confirmation = window.confirm(
            "Está a punto de modificar un horario fijo. ¿Desea continuar?"
        );
        if (!confirmation) return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
  
    const startT = format(startDate, 'HH:mm:ss');
    const endT = format(endDate, 'HH:mm:ss');
  
    const nextEvents = events.map((existingEvent) => {
        if (existingEvent.id === event.id) {
            return { ...existingEvent, start, end };
        } else if (
            existingEvent.resource !== event.resource && // Tipo contrario (horario/bloqueo)
            existingEvent.start < end && // Solapa con el nuevo final del evento modificado
            existingEvent.end > start // Solapa con el nuevo inicio del evento modificado
        ) {
            // Ajustar el evento contrario (bloqueo)
            if (existingEvent.start < start) {
                return {
                    ...existingEvent,
                    end: start, // Ajusta el fin del bloqueo
                };
            } else {
                return {
                    ...existingEvent,
                    start: end, // Ajusta el inicio del bloqueo
                };
            }
        }
        return existingEvent;
    });
  
    setEvents(nextEvents);
    updateScheduleOnServer(event.id, startT, endT, event.resource);
};
  
const handleEventDrop = ({ event, start, end }) => {
    if (event.resource === "horario") {
        const confirmation = window.confirm(
            "Está a punto de mover un horario fijo. ¿Desea continuar?"
        );
        if (!confirmation) return;
    }
  
    const nextEvents = events.map((existingEvent) => {
        if (existingEvent.id === event.id) {
            return { ...existingEvent, start, end };
        } else if (
            existingEvent.resource !== event.resource && // Tipo contrario (horario/bloqueo)
            existingEvent.start < end && // Solapa con el nuevo final del evento modificado
            existingEvent.end > start // Solapa con el nuevo inicio del evento modificado
        ) {
            // Ajustar el evento contrario (bloqueo)
            if (existingEvent.start < start) {
                return {
                    ...existingEvent,
                    end: start, // Ajusta el fin del bloqueo
                };
            } else {
                return {
                    ...existingEvent,
                    start: end, // Ajusta el inicio del bloqueo
                };
            }
        }
        return existingEvent;
    });
  
    setEvents(nextEvents);
    updateScheduleOnServer(event.id, start, end, event.resource);
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
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
      deleteScheduleOnServer(eventId);
    }
  };

  const updateScheduleOnServer = (eventId, startTime, endTime, type) => {
    ScheduleService.updateSchedule(eventId, { startTime, endTime, type })
      .then(console.log)
      .catch(console.error);
  };  

  const createScheduleOnServer = (event) => {
    ScheduleService.createSchedule(event)
      .then(console.log)
      .catch(console.error);
  };

  const deleteScheduleOnServer = (eventId) => {
    ScheduleService.deleteSchedule(eventId)
      .then(console.log)
      .catch(console.error);
  };

  const handleNavigate = (newDate) => setDate(newDate);
  const handleViewChange = (newView) => setView(newView);
  const handleSelectEvent = (event) => {
    if (event.resource === "reserva") navigate(`/reservation/${event.id}`);
  };

  const eventPropGetter = (event) => {
    let style = {
      backgroundColor:
        event.resource === "reserva"
          ? "green"
          : event.resource === "bloqueo"
          ? "grey"
          : "blue",
      zIndex: event.resource === "reserva" ? 2 : 1,
    };
    return { style };
  };

  return (
    <div
      style={{ paddingTop: "70px", paddingRight: "700px", paddingLeft: "0" }}
    >
      {userRole === "1" && (
        <div style={{ marginBottom: "20px" }}>
          <label>Seleccionar Sucursal:</label>
          <select value={storeId} onChange={handleStoreChange}>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div style={{ height: "80vh", width: "180%" }}>
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
          onSelectEvent={handleSelectEvent}
          resizable
          style={{ height: "80vh", width: "170%" }}
          components={{
            event: EventWithDeleteButton,
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
}

const EventWithDeleteButton = ({ event }) => (
  <div style={{ position: "relative" }}>
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
  const goToBack = () => onNavigate("PREV");
  const goToNext = () => onNavigate("NEXT");

  const currentLabel = () => {
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), "dd MMM", {
      locale: es,
    });
    const end = format(
      addDays(startOfWeek(date, { weekStartsOn: 1 }), 6),
      "dd MMM",
      {
        locale: es,
      }
    );
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
