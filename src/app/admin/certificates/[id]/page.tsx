"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { certificateService } from "@/services/certificateService";
import { CertificateForm, type CertificateFormValues } from "@/components/certificate/CertificateForm";
import { getErrorMessage } from "@/utils";
import toast from "react-hot-toast";

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: certificateService.getAll,
  });

  const certificate = certificates.find((c) => c._id === id);

  const mutation = useMutation({
    mutationFn: (values: CertificateFormValues) => certificateService.update(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["certificates"] });
      await queryClient.refetchQueries({ queryKey: ["certificates"] });
      toast.success("Certificate updated successfully!");
      router.push("/admin/certificates");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Certificate not found.</p>
        <Link href="/admin/certificates" className="text-[#0d2353] font-medium mt-2 inline-block hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-3 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Certificates
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Certificate</h1>
        <p className="text-gray-500 text-sm mt-1">
          Editing: <span className="font-medium text-gray-700">{certificate.full_name}</span>
          &nbsp;•&nbsp;
          <span className="font-mono text-xs">{certificate.ref_no}</span>
        </p>
      </div>

      <CertificateForm
        defaultValues={certificate}
        onSubmit={(values) => mutation.mutate(values)}
        loading={mutation.isPending}
        submitLabel="Update Certificate"
      />
    </div>
  );
}
