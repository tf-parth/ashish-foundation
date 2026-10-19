// ============================================================
// LocalStorage CRUD Utilities
// All data persistence for the demo uses localStorage.
// Replace with API calls when a backend is available.
// ============================================================

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: "pending" | "completed";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
}

export interface StoredEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  date: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

// ---- Generic helpers ----

function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---- Donations ----

const DONATIONS_KEY = "af_donations";

export function getDonations(): Donation[] {
  return getItems<Donation>(DONATIONS_KEY);
}

export function addDonation(
  data: Omit<Donation, "id" | "date" | "status"> & { status?: "pending" | "completed" }
): Donation {
  const donations = getDonations();
  const donation: Donation = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
    // Default to pending - payments can only be confirmed after bank statement reconciliation
    status: data.status || "pending",
  };
  donations.unshift(donation);
  setItems(DONATIONS_KEY, donations);
  return donation;
}

export function updateDonationStatus(
  id: string,
  status: "pending" | "completed"
): Donation | null {
  const donations = getDonations();
  const index = donations.findIndex((d) => d.id === id);
  if (index === -1) return null;
  donations[index].status = status;
  setItems(DONATIONS_KEY, donations);
  return donations[index];
}

export function deleteDonation(id: string): void {
  const donations = getDonations().filter((d) => d.id !== id);
  setItems(DONATIONS_KEY, donations);
}

// ---- Contact Messages ----

const CONTACTS_KEY = "af_contacts";

export function getContacts(): ContactMessage[] {
  return getItems<ContactMessage>(CONTACTS_KEY);
}

export function addContact(data: Omit<ContactMessage, "id" | "date" | "read">): ContactMessage {
  const contacts = getContacts();
  const contact: ContactMessage = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
    read: false,
  };
  contacts.unshift(contact);
  setItems(CONTACTS_KEY, contacts);
  return contact;
}

export function markContactRead(id: string): void {
  const contacts = getContacts().map((c) =>
    c.id === id ? { ...c, read: true } : c
  );
  setItems(CONTACTS_KEY, contacts);
}

export function deleteContact(id: string): void {
  const contacts = getContacts().filter((c) => c.id !== id);
  setItems(CONTACTS_KEY, contacts);
}

// ---- Volunteers ----

const VOLUNTEERS_KEY = "af_volunteers";

export function getVolunteers(): Volunteer[] {
  return getItems<Volunteer>(VOLUNTEERS_KEY);
}

export function addVolunteer(data: Omit<Volunteer, "id" | "date">): Volunteer {
  const volunteers = getVolunteers();
  const volunteer: Volunteer = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
  };
  volunteers.unshift(volunteer);
  setItems(VOLUNTEERS_KEY, volunteers);
  return volunteer;
}

export function deleteVolunteer(id: string): void {
  const volunteers = getVolunteers().filter((v) => v.id !== id);
  setItems(VOLUNTEERS_KEY, volunteers);
}

// ---- Events ----

const EVENTS_KEY = "af_events";

export function getStoredEvents(): StoredEvent[] {
  return getItems<StoredEvent>(EVENTS_KEY);
}

export function addStoredEvent(data: Omit<StoredEvent, "id">): StoredEvent {
  const events = getStoredEvents();
  const event: StoredEvent = {
    ...data,
    id: generateId(),
  };
  events.unshift(event);
  setItems(EVENTS_KEY, events);
  return event;
}

export function updateStoredEvent(id: string, data: Partial<StoredEvent>): void {
  const events = getStoredEvents().map((e) =>
    e.id === id ? { ...e, ...data } : e
  );
  setItems(EVENTS_KEY, events);
}

export function deleteStoredEvent(id: string): void {
  const events = getStoredEvents().filter((e) => e.id !== id);
  setItems(EVENTS_KEY, events);
}

// ---- Event Registrations ----

const EVENT_REGISTRATIONS_KEY = "af_event_registrations";

export function getEventRegistrations(): EventRegistration[] {
  return getItems<EventRegistration>(EVENT_REGISTRATIONS_KEY);
}

export function addEventRegistration(
  data: Omit<EventRegistration, "id" | "date">
): EventRegistration {
  const registrations = getEventRegistrations();
  const registration: EventRegistration = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
  };
  registrations.unshift(registration);
  setItems(EVENT_REGISTRATIONS_KEY, registrations);
  return registration;
}

// ---- Gallery ----

const GALLERY_KEY = "af_gallery";

export function getStoredGallery(): GalleryImage[] {
  return getItems<GalleryImage>(GALLERY_KEY);
}

export function addGalleryImage(data: GalleryImage): void {
  const images = getStoredGallery();
  images.push(data);
  setItems(GALLERY_KEY, images);
}

export function removeGalleryImage(src: string): void {
  const images = getStoredGallery().filter((img) => img.src !== src);
  setItems(GALLERY_KEY, images);
}

// ---- Stats helpers for admin dashboard ----

export function getAdminStats() {
  const donations = getDonations();
  const completedDonations = donations.filter((d) => d.status === "completed");
  const pendingDonations = donations.filter((d) => d.status === "pending");

  return {
    totalDonations: donations.length,
    totalDonationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    verifiedDonationAmount: completedDonations.reduce((sum, d) => sum + d.amount, 0),
    pendingDonationsCount: pendingDonations.length,
    completedDonationsCount: completedDonations.length,
    totalMessages: getContacts().length,
    unreadMessages: getContacts().filter((c) => !c.read).length,
    totalVolunteers: getVolunteers().length,
    totalEvents: getStoredEvents().length,
    totalRegistrations: getEventRegistrations().length,
  };
}
