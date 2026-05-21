"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Certificate, CreateCertificateInput } from "@/types";
import { SKILL_OPTIONS } from "@/constants";

const schema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  date_of_birth: z.string().optional(),
  passport_no: z.string().optional(),
  nid_card_no: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  village: z.string().optional(),
  post_office: z.string().optional(),
  upazila: z.string().optional(),
  district: z.string().optional(),
  skill_title: z.string().optional(),
  experience_years: z.coerce.number().min(0).optional(),
  issue_date: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export type CertificateFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Certificate>;
  onSubmit: (values: CertificateFormValues) => void;
  loading: boolean;
  submitLabel?: string;
}

const InputField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export function CertificateForm({ defaultValues, onSubmit, loading, submitLabel = "Save" }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: defaultValues?.full_name || "",
      date_of_birth: defaultValues?.date_of_birth?.split("T")[0] || "",
      passport_no: defaultValues?.passport_no || "",
      nid_card_no: defaultValues?.nid_card_no || "",
      father_name: defaultValues?.father_name || "",
      mother_name: defaultValues?.mother_name || "",
      village: defaultValues?.village || "",
      post_office: defaultValues?.post_office || "",
      upazila: defaultValues?.upazila || "",
      district: defaultValues?.district || "",
      skill_title: defaultValues?.skill_title || "",
      experience_years: defaultValues?.experience_years || undefined,
      issue_date: defaultValues?.issue_date?.split("T")[0] || new Date().toISOString().split("T")[0],
      start_date: defaultValues?.start_date?.split("T")[0] || "",
      end_date: defaultValues?.end_date?.split("T")[0] || "",
      status: defaultValues?.status || "draft",
    },
  });

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2353] focus:border-transparent transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Full Name *" error={errors.full_name?.message}>
            <input {...register("full_name")} className={inputClass} placeholder="John Doe" />
          </InputField>
          <InputField label="Date of Birth" error={errors.date_of_birth?.message}>
            <input {...register("date_of_birth")} type="date" className={inputClass} />
          </InputField>
          <InputField label="Passport No" error={errors.passport_no?.message}>
            <input {...register("passport_no")} className={inputClass} placeholder="A12345678" />
          </InputField>
          <InputField label="NID Card No" error={errors.nid_card_no?.message}>
            <input {...register("nid_card_no")} className={inputClass} placeholder="1234567890" />
          </InputField>
          <InputField label="Father's Name" error={errors.father_name?.message}>
            <input {...register("father_name")} className={inputClass} placeholder="Father's name" />
          </InputField>
          <InputField label="Mother's Name" error={errors.mother_name?.message}>
            <input {...register("mother_name")} className={inputClass} placeholder="Mother's name" />
          </InputField>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Village" error={errors.village?.message}>
            <input {...register("village")} className={inputClass} placeholder="Village" />
          </InputField>
          <InputField label="Post Office" error={errors.post_office?.message}>
            <input {...register("post_office")} className={inputClass} placeholder="Post Office" />
          </InputField>
          <InputField label="Upazila" error={errors.upazila?.message}>
            <input {...register("upazila")} className={inputClass} placeholder="Savar" />
          </InputField>
          <InputField label="District" error={errors.district?.message}>
            <input {...register("district")} className={inputClass} placeholder="Dhaka" />
          </InputField>
        </div>
      </div>

      {/* Professional Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Professional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Skill Title" error={errors.skill_title?.message}>
            <select {...register("skill_title")} className={inputClass}>
              <option value="">Select skill</option>
              {SKILL_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </InputField>
          <InputField label="Experience Years" error={errors.experience_years?.message}>
            <input {...register("experience_years")} type="number" min={0} className={inputClass} placeholder="5" />
          </InputField>
          <InputField label="Issue Date" error={errors.issue_date?.message}>
            <input {...register("issue_date")} type="date" className={inputClass} />
          </InputField>
          <InputField label="Work period — start" error={errors.start_date?.message}>
            <input {...register("start_date")} type="date" className={inputClass} />
          </InputField>
          <InputField label="Work period — end" error={errors.end_date?.message}>
            <input {...register("end_date")} type="date" className={inputClass} />
          </InputField>
          <InputField label="Status" error={errors.status?.message}>
            <select {...register("status")} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </InputField>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0d2353] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a3a6e] transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
