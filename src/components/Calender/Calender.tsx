import React, { useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  color: string;
  phone: string;
}

interface Property {
  id: string;
  address: string;
  type: string;
  price: string;
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  agentId: string;
  propertyId: string;
  clientName: string;
  clientPhone: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

type ViewType = "day" | "week" | "month";

const agents: Agent[] = [
  {
    id: "1",
    name: "Parth Chauhan",
    color: "bg-red-500",
    phone: "+91 9313759966",
  },
  {
    id: "2",
    name: "Nency Chauhan",
    color: "bg-green-500",
    phone: "+91 9713895675",
  },
  {
    id: "3",
    name: "Chirag Mehta",
    color: "bg-purple-500",
    phone: "+91 98765 43210",
  },
  {
    id: "4",
    name: "Nirali Shah",
    color: "bg-orange-500",
    phone: "+91 96874 53656",
  },
];

const properties: Property[] = [
  {
    id: "1",
    address: "12 Shivalik Residency, Science City Road, Ahmedabad",
    type: "Apartment",
    price: "₹45,00,000",
  },
  {
    id: "2",
    address: "108 Green Meadows, Gotri Road, Vadodara",
    type: "House",
    price: "₹75,00,000",
  },
  {
    id: "3",
    address: "9 Sun Residency, Pal Road, Surat",
    type: "Condo",
    price: "₹32,00,000",
  },
  {
    id: "4",
    address: "32 Sardar Park, Kalawad Road, Rajkot",
    type: "Townhouse",
    price: "₹58,00,000",
  },
];

const initialAppointments: Appointment[] = [
  {
    id: "1",
    title: "Property Viewing",
    date: "2025-01-15",
    time: "10:00",
    duration: 60,
    agentId: "1",
    propertyId: "1",
    clientName: "Alpesh Patel",
    clientPhone: "+91 98765 43210",
    status: "scheduled",
    notes: "First-time buyer, interested in 2BHK near Science City, Ahmedabad",
  },
  {
    id: "2",
    title: "House Tour",
    date: "2025-01-15",
    time: "14:00",
    duration: 90,
    agentId: "2",
    propertyId: "2",
    clientName: "Pravin Desai",
    clientPhone: "+91 98250 12345",
    status: "confirmed",
    notes: "Looking for a 3BHK bungalow in Anand with nearby schools",
  },
  {
    id: "3",
    title: "Condo Viewing",
    date: "2025-01-16",
    time: "11:30",
    duration: 45,
    agentId: "3",
    propertyId: "3",
    clientName: "Kiranben Shah",
    clientPhone: "+91 90990 11223",
    status: "scheduled",
    notes: "Investor from Surat, interested in rental flats near Pal area",
  },
];

function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAgent = (agentId: string) =>
    agents.find((agent) => agent.id === agentId);
  const getProperty = (propertyId: string) =>
    properties.find((property) => property.id === propertyId);

  const formatDate = (date: Date, format: "short" | "long" = "short") => {
    if (format === "long") {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatLocalDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // देता है: YYYY-MM-DD
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = formatLocalDate(date);
    return appointments.filter((appointment) => appointment.date === dateStr);
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }

    return week;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);

    if (viewType === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewType === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewType === "month") {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    }

    setCurrentDate(newDate);
  };

  const openModal = (appointment?: Appointment) => {
    setSelectedAppointment(appointment || null);
    setIsEditing(!!appointment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setIsEditing(false);
  };

  const handleSaveAppointment = (appointmentData: Partial<Appointment>) => {
    if (isEditing && selectedAppointment) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, ...appointmentData }
            : apt
        )
      );
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        title: appointmentData.title || "Property Viewing",
        date: appointmentData.date
          ? formatLocalDate(new Date(appointmentData.date))
          : formatLocalDate(new Date()),
        time: appointmentData.time || "",
        duration: appointmentData.duration || 60,
        agentId: appointmentData.agentId || "1",
        propertyId: appointmentData.propertyId || "1",
        clientName: appointmentData.clientName || "",
        clientPhone: appointmentData.clientPhone || "",
        status: appointmentData.status || "scheduled",
        notes: appointmentData.notes || "",
      };
      setAppointments((prev) => [...prev, newAppointment]);
    }
    closeModal();
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
    closeModal();
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="grid grid-cols-7 gap-1 h-full">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center font-semibold text-gray-600 bg-gray-50 text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-16 sm:min-h-20 md:min-h-24 p-1 border border-gray-200 ${
              day ? "bg-white hover:bg-gray-50" : "bg-gray-50"
            }`}
          >
            {day && (
              <>
                <div className="font-medium text-xs sm:text-sm text-gray-700 mb-1">
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {getAppointmentsForDate(day)
                    .slice(0, 2)
                    .map((appointment) => {
                      const agent = getAgent(appointment.agentId);
                      return (
                        <div
                          key={appointment.id}
                          className={`text-xs p-1 rounded cursor-pointer ${agent?.color} text-white truncate`}
                          onClick={() => openModal(appointment)}
                        >
                          {appointment.time} - {appointment.clientName}
                        </div>
                      );
                    })}
                  {getAppointmentsForDate(day).length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{getAppointmentsForDate(day).length - 2} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="grid grid-cols-8 gap-1 h-full">
        <div className="p-2 bg-gray-50 text-center font-semibold text-gray-600 text-xs sm:text-sm">
          Time
        </div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="p-2 bg-gray-50 text-center font-semibold text-gray-600 text-xs sm:text-sm"
          >
            <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div>{day.getDate()}</div>
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="p-2 text-right text-xs sm:text-sm text-gray-500 border-r border-gray-200">
              {hour}:00
            </div>
            {weekDays.map((day) => {
              const dayAppointments = getAppointmentsForDate(day).filter(
                (apt) => {
                  const aptHour = parseInt(apt.time.split(":")[0]);
                  return aptHour === hour;
                }
              );

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="p-1 border border-gray-200 min-h-12 sm:min-h-16"
                >
                  {dayAppointments.map((appointment) => {
                    const agent = getAgent(appointment.agentId);
                    return (
                      <div
                        key={appointment.id}
                        className={`text-xs p-1 rounded cursor-pointer ${agent?.color} text-white mb-1`}
                        onClick={() => openModal(appointment)}
                      >
                        {appointment.clientName}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate);
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="space-y-1">
        {hours.map((hour) => {
          const hourAppointments = dayAppointments.filter((apt) => {
            const aptHour = parseInt(apt.time.split(":")[0]);
            return aptHour === hour;
          });

          return (
            <div key={hour} className="flex border-b border-gray-200 min-h-16">
              <div className="w-20 p-3 text-right text-sm text-gray-500 border-r border-gray-200">
                {hour}:00
              </div>
              <div className="flex-1 p-2 space-y-2">
                {hourAppointments.map((appointment) => {
                  const agent = getAgent(appointment.agentId);
                  const property = getProperty(appointment.propertyId);
                  return (
                    <div
                      key={appointment.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => openModal(appointment)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${agent?.color}`}
                          ></div>
                          <span className="font-medium text-sm">
                            {appointment.clientName}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {appointment.time} ({appointment.duration} min)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{property?.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{agent?.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Property Viewing Scheduler
              </h1>
              <p className="text-gray-600 mt-1">
                Manage property viewings and agent assignments
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateDate("prev")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {viewType === "day"
                    ? formatDate(currentDate, "long")
                    : currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                        ...(viewType === "week" && { day: "numeric" }),
                      })}
                </h2>
                <button
                  onClick={() => navigateDate("next")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex space-x-2">
                {(["day", "week", "month"] as ViewType[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => setViewType(view)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      viewType === view
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              {viewType === "month" && renderMonthView()}
              {viewType === "week" && renderWeekView()}
              {viewType === "day" && renderDayView()}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${agent.color}`}></div>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-500">{agent.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <AppointmentModal
          appointment={selectedAppointment}
          agents={agents}
          properties={properties}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
          onClose={closeModal}
          isEditing={isEditing}
        />
      )}
    </div>
  );
}

interface AppointmentModalProps {
  appointment: Appointment | null;
  agents: Agent[];
  properties: Property[];
  onSave: (appointment: Partial<Appointment>) => void;
  onDelete: (appointmentId: string) => void;
  onClose: () => void;
  isEditing: boolean;
}

function AppointmentModal({
  appointment,
  agents,
  properties,
  onSave,
  onDelete,
  onClose,
  isEditing,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    title: appointment?.title || "Property Viewing",
    date: appointment?.date || new Date().toISOString().split("T")[0],
    time: appointment?.time || "10:00",
    duration: appointment?.duration || 60,
    agentId: appointment?.agentId || agents[0]?.id || "",
    propertyId: appointment?.propertyId || properties[0]?.id || "",
    clientName: appointment?.clientName || "",
    clientPhone: appointment?.clientPhone || "",
    status: appointment?.status || "scheduled",
    notes: appointment?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? "Edit Appointment" : "New Appointment"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Appointment["status"],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent
            </label>
            <select
              value={formData.agentId}
              onChange={(e) =>
                setFormData({ ...formData, agentId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) =>
                setFormData({ ...formData, propertyId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.address} - {property.type} ({property.price})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Phone
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) =>
                  setFormData({ ...formData, clientPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about the appointment..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => appointment && onDelete(appointment.id)}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Calender;
