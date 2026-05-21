import { adminFetch, adminFetchFormData, publicApiGet } from "@/lib/api";
import type { GalleryItem, HeroBanner } from "@/types";

function normalizeList(data: unknown): { banners: HeroBanner[]; count: number } {
  const d = data as Record<string, unknown>;
  const banners = Array.isArray(d.banners) ? (d.banners as HeroBanner[]) : [];
  const count = typeof d.count === "number" ? d.count : banners.length;
  return { banners, count };
}

function normalizeGallery(data: unknown): { gallery: GalleryItem[]; count: number } {
  const d = data as Record<string, unknown>;
  const gallery = Array.isArray(d.gallery) ? (d.gallery as GalleryItem[]) : [];
  const count = typeof d.count === "number" ? d.count : gallery.length;
  return { gallery, count };
}

export const siteSettingsService = {
  async getHeroBanners(): Promise<{ banners: HeroBanner[]; count: number }> {
    const data = await publicApiGet("/site-settings/hero-background");
    return normalizeList(data);
  },

  async addHeroBanner(file: File): Promise<HeroBanner> {
    const fd = new FormData();
    fd.append("image", file);
    const data = (await adminFetchFormData("/site-settings/hero-background", fd, {
      method: "POST",
    })) as Record<string, unknown>;
    const banner = data.banner as HeroBanner | undefined;
    if (!banner?.id) throw new Error("Unexpected response from server");
    return banner;
  },

  async updateHeroBanner(bannerId: string, file: File): Promise<HeroBanner> {
    const fd = new FormData();
    fd.append("image", file);
    const data = (await adminFetchFormData(
      `/site-settings/hero-background/${encodeURIComponent(bannerId)}`,
      fd,
      { method: "PATCH" }
    )) as Record<string, unknown>;
    const banner = data.banner as HeroBanner | undefined;
    if (!banner?.id) throw new Error("Unexpected response from server");
    return banner;
  },

  async deleteHeroBanner(bannerId: string): Promise<void> {
    await adminFetch(`/site-settings/hero-background/${encodeURIComponent(bannerId)}`, {
      method: "DELETE",
    });
  },

  async deleteAllHeroBanners(): Promise<void> {
    await adminFetch("/site-settings/hero-background", { method: "DELETE" });
  },

  async getGallery(): Promise<{ gallery: GalleryItem[]; count: number }> {
    const data = await publicApiGet("/site-settings/gallery");
    return normalizeGallery(data);
  },

  async addGalleryImage(file: File): Promise<GalleryItem> {
    const fd = new FormData();
    fd.append("image", file);
    const data = (await adminFetchFormData("/site-settings/gallery", fd, {
      method: "POST",
    })) as Record<string, unknown>;
    const galleryItem = data.galleryItem as GalleryItem | undefined;
    if (!galleryItem?.id) throw new Error("Unexpected response from server");
    return galleryItem;
  },

  async updateGalleryImage(galleryId: string, file: File): Promise<GalleryItem> {
    const fd = new FormData();
    fd.append("image", file);
    const data = (await adminFetchFormData(
      `/site-settings/gallery/${encodeURIComponent(galleryId)}`,
      fd,
      { method: "PATCH" }
    )) as Record<string, unknown>;
    const galleryItem = data.galleryItem as GalleryItem | undefined;
    if (!galleryItem?.id) throw new Error("Unexpected response from server");
    return galleryItem;
  },

  async deleteGalleryImage(galleryId: string): Promise<void> {
    await adminFetch(`/site-settings/gallery/${encodeURIComponent(galleryId)}`, {
      method: "DELETE",
    });
  },

  async deleteAllGallery(): Promise<void> {
    await adminFetch("/site-settings/gallery", { method: "DELETE" });
  },
};
