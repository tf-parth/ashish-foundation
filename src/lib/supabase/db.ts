import { supabase, isSupabaseConfigured } from "./client";
import {
  getDonations as getLocalDonations,
  updateDonationStatus as updateLocalDonationStatus,
  deleteDonation as deleteLocalDonation,
  getContacts as getLocalContacts,
  markContactRead as markLocalContactRead,
  deleteContact as deleteLocalContact,
  getVolunteers as getLocalVolunteers,
  deleteVolunteer as deleteLocalVolunteer,
  getStoredEvents as getLocalStoredEvents,
  addStoredEvent as addLocalStoredEvent,
  deleteStoredEvent as deleteLocalStoredEvent,
  getStoredGallery as getLocalStoredGallery,
  addGalleryImage as addLocalGalleryImage,
  removeGalleryImage as removeLocalGalleryImage,
  getEventRegistrations as getLocalEventRegistrations,
  type Donation,
  type ContactMessage,
  type Volunteer,
  type StoredEvent,
  type GalleryImage,
} from "@/lib/storage";
import { EVENTS, STORIES, GALLERY_IMAGES } from "@/lib/constants";

// ============================================================
// Public Data Fetchers (with graceful fallback)
// ============================================================

export async function fetchPublicEvents(): Promise<StoredEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, date, location, description, image, created_at")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          location: e.location,
          description: e.description,
          image: e.image,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch events, falling back to local:", err);
    }
  }

  // Fallback to local storage custom events + default constants
  const stored = getLocalStoredEvents();
  return [
    ...stored,
    ...EVENTS.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      description: e.description,
      image: e.image,
    })),
  ];
}

export async function fetchPublicStories() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          title: s.title,
          location: s.location,
          programme: s.programme,
          image: s.image,
          tagline: s.tagline,
          before: s.before_text,
          after: s.after_text,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch stories, falling back to constants:", err);
    }
  }

  return [...STORIES];
}

export async function fetchPublicGallery(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("src, alt, category")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return [
          ...data.map((img) => ({
            src: img.src,
            alt: img.alt,
            category: img.category,
          })),
          ...GALLERY_IMAGES,
        ];
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch gallery, falling back to local:", err);
    }
  }

  const stored = getLocalStoredGallery();
  return [...stored, ...GALLERY_IMAGES];
}

// ============================================================
// Admin Data Handlers
// ============================================================

export async function fetchAdminDonations(): Promise<Donation[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          amount: Number(d.amount),
          date: d.created_at,
          status: d.status as "pending" | "completed",
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin donations:", err);
    }
  }
  return getLocalDonations();
}

export async function updateDonationStatusInDb(
  id: string,
  status: "pending" | "completed"
): Promise<void> {
  updateLocalDonationStatus(id, status);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("donations").update({ status }).eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to update donation status:", err);
    }
  }
}

export async function deleteDonationFromDb(id: string): Promise<void> {
  deleteLocalDonation(id);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("donations").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete donation:", err);
    }
  }
}

export async function fetchAdminContacts(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          subject: c.subject,
          message: c.message,
          date: c.created_at,
          read: c.is_read,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch contact messages:", err);
    }
  }
  return getLocalContacts();
}

export async function markContactReadInDb(id: string): Promise<void> {
  markLocalContactRead(id);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to mark message read:", err);
    }
  }
}

export async function deleteContactFromDb(id: string): Promise<void> {
  deleteLocalContact(id);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete contact message:", err);
    }
  }
}

export async function fetchAdminVolunteers(): Promise<Volunteer[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((v) => ({
          id: v.id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          interest: v.interest,
          message: v.message,
          date: v.created_at,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch volunteers:", err);
    }
  }
  return getLocalVolunteers();
}

export async function deleteVolunteerFromDb(id: string): Promise<void> {
  deleteLocalVolunteer(id);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("volunteers").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete volunteer:", err);
    }
  }
}

export async function fetchAdminEvents(): Promise<StoredEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          location: e.location,
          description: e.description,
          image: e.image,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin events:", err);
    }
  }
  return getLocalStoredEvents();
}

export async function createAdminEvent(event: Omit<StoredEvent, "id">): Promise<void> {
  addLocalStoredEvent(event);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("events").insert({
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        image: event.image,
      });
    } catch (err) {
      console.error("[Supabase] Failed to create event:", err);
    }
  }
}

export async function deleteAdminEvent(id: string): Promise<void> {
  deleteLocalStoredEvent(id);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("events").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete event:", err);
    }
  }
}

export async function fetchAdminGallery(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("src, alt, category")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((img) => ({
          src: img.src,
          alt: img.alt,
          category: img.category,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin gallery:", err);
    }
  }
  return getLocalStoredGallery();
}

export async function createAdminGalleryImage(image: GalleryImage): Promise<void> {
  addLocalGalleryImage(image);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("gallery_images").insert({
        src: image.src,
        alt: image.alt,
        category: image.category,
      });
    } catch (err) {
      console.error("[Supabase] Failed to insert gallery image:", err);
    }
  }
}

export async function removeAdminGalleryImage(src: string): Promise<void> {
  removeLocalGalleryImage(src);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("gallery_images").delete().eq("src", src);
    } catch (err) {
      console.error("[Supabase] Failed to delete gallery image:", err);
    }
  }
}

export async function fetchAdminStats() {
  const [donations, contacts, volunteers, events] = await Promise.all([
    fetchAdminDonations(),
    fetchAdminContacts(),
    fetchAdminVolunteers(),
    fetchAdminEvents(),
  ]);

  const completed = donations.filter((d) => d.status === "completed");
  const pending = donations.filter((d) => d.status === "pending");

  return {
    totalDonations: donations.length,
    totalDonationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    verifiedDonationAmount: completed.reduce((sum, d) => sum + d.amount, 0),
    pendingDonationsCount: pending.length,
    completedDonationsCount: completed.length,
    totalMessages: contacts.length,
    unreadMessages: contacts.filter((c) => !c.read).length,
    totalVolunteers: volunteers.length,
    totalEvents: events.length,
    totalRegistrations: getLocalEventRegistrations().length,
  };
}
