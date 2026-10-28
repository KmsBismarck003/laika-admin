import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '@/services/apiClient';

/**
 * Hook de dominio para gestionar el Historial de Eventos Finalizados y sus analíticas
 * Cumple con POO, SOLID y separación de capas sin mocks.
 */
export const useEventHistory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros del catálogo
  const [searchQuery, setSearchQuery] = useState('');
  const [venueFilter, setVenueFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  // Evento seleccionado y analíticas
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [analytics, setAnalytics] = useState({
    tickets: null,
    revenue: null,
    attendees: []
  });

  // Filtro de asistentes en vista de detalle
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState('all');

  const fetchHistoricalEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/events/historical');
      setEvents(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Error al obtener eventos históricos:', err);
      setError('No se pudo cargar el historial de eventos. Intenta nuevamente.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistoricalEvents();
  }, [fetchHistoricalEvents]);

  const fetchAnalytics = useCallback(async (eventId) => {
    try {
      setLoadingAnalytics(true);
      setAnalyticsError(null);

      const [ticketsRes, revenueRes, attendeesRes] = await Promise.allSettled([
        apiClient.get(`/events/manager/events/${eventId}/tickets`),
        apiClient.get(`/events/manager/events/${eventId}/revenue`),
        apiClient.get(`/events/manager/events/${eventId}/attendees`)
      ]);

      const ticketsData = ticketsRes.status === 'fulfilled' ? ticketsRes.value : null;
      const revenueData = revenueRes.status === 'fulfilled' ? revenueRes.value : null;
      const attendeesData = attendeesRes.status === 'fulfilled' && Array.isArray(attendeesRes.value)
        ? attendeesRes.value
        : [];

      setAnalytics({
        tickets: ticketsData,
        revenue: revenueData,
        attendees: attendeesData
      });

      if (ticketsRes.status === 'rejected' && revenueRes.status === 'rejected') {
        setAnalyticsError('No se pudieron obtener las métricas detalladas del evento.');
      }
    } catch (err) {
      console.error('Error al cargar analíticas del evento:', err);
      setAnalyticsError('Error de red al consultar los datos del evento.');
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const selectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setAttendeeSearch('');
    setAttendeeStatusFilter('all');
    if (event?.id) {
      fetchAnalytics(event.id);
    }
  }, [fetchAnalytics]);

  const clearSelectedEvent = useCallback(() => {
    setSelectedEvent(null);
    setAnalytics({
      tickets: null,
      revenue: null,
      attendees: []
    });
    setAnalyticsError(null);
  }, []);

  const refreshAnalytics = useCallback(() => {
    if (selectedEvent?.id) {
      fetchAnalytics(selectedEvent.id);
    }
  }, [selectedEvent, fetchAnalytics]);

  // Lista única de sedes para el selector
  const availableVenues = useMemo(() => {
    const venues = new Set();
    events.forEach(e => {
      if (e.venue_name) venues.add(e.venue_name);
    });
    return Array.from(venues);
  }, [events]);

  // Eventos filtrados en el catálogo
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(e =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.venue_name && e.venue_name.toLowerCase().includes(q)) ||
        (e.event_date && e.event_date.toLowerCase().includes(q))
      );
    }

    if (venueFilter !== 'all') {
      result = result.filter(e => e.venue_name === venueFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.event_date || 0);
      const dateB = new Date(b.event_date || 0);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [events, searchQuery, venueFilter, sortOrder]);

  // Asistentes filtrados en el detalle
  const filteredAttendees = useMemo(() => {
    let list = analytics.attendees || [];

    if (attendeeStatusFilter !== 'all') {
      list = list.filter(a => a.status === attendeeStatusFilter);
    }

    if (attendeeSearch.trim()) {
      const q = attendeeSearch.toLowerCase().trim();
      list = list.filter(a =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q)) ||
        (a.ticket && a.ticket.toLowerCase().includes(q)) ||
        (a.entry && a.entry.toLowerCase().includes(q))
      );
    }

    return list;
  }, [analytics.attendees, attendeeSearch, attendeeStatusFilter]);

  // Paginación de asistentes en vista de detalle
  const [attendeePage, setAttendeePage] = useState(1);
  const [attendeePageSize, setAttendeePageSize] = useState(10);

  // Reiniciar a la primera página cuando cambian los filtros de asistentes
  useEffect(() => {
    setAttendeePage(1);
  }, [attendeeSearch, attendeeStatusFilter, selectedEvent]);

  // Asistentes paginados
  const totalFilteredAttendees = filteredAttendees.length;
  const totalAttendeePages = Math.max(1, Math.ceil(totalFilteredAttendees / attendeePageSize));

  const paginatedAttendees = useMemo(() => {
    const startIndex = (attendeePage - 1) * attendeePageSize;
    return filteredAttendees.slice(startIndex, startIndex + attendeePageSize);
  }, [filteredAttendees, attendeePage, attendeePageSize]);

  // Resumen global del catálogo
  const catalogSummary = useMemo(() => {
    const totalEvents = events.length;
    const totalCapacity = events.reduce((acc, curr) => acc + (Number(curr.capacity) || 0), 0);
    return {
      totalEvents,
      totalCapacity
    };
  }, [events]);

  return {
    events: filteredEvents,
    rawEventsCount: events.length,
    loading,
    error,
    catalogSummary,
    searchQuery,
    setSearchQuery,
    venueFilter,
    setVenueFilter,
    availableVenues,
    sortOrder,
    setSortOrder,
    selectedEvent,
    selectEvent,
    clearSelectedEvent,
    refreshAnalytics,
    analytics,
    loadingAnalytics,
    analyticsError,
    attendees: paginatedAttendees,
    rawAttendeesCount: analytics.attendees.length,
    totalFilteredAttendees,
    attendeeSearch,
    setAttendeeSearch,
    attendeeStatusFilter,
    setAttendeeStatusFilter,
    attendeePage,
    setAttendeePage,
    totalAttendeePages,
    attendeePageSize,
    setAttendeePageSize,
    reloadCatalog: fetchHistoricalEvents
  };
};
