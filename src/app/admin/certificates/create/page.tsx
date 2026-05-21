"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { certificateService } from "@/services/certificateService";
import { CertificateForm, type CertificateFormValues } from "@/components/certificate/CertificateForm";
import { getErrorMessage } from "@/utils";
import toast from "react-hot-toast";

export default function CreateCertificatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CertificateFormValues) => certificateService.create(values),
    onSuccess: async (newCert) => {
      // Invalidate AND immediately refetch so list is current before redirect
      await queryClient.invalidateQueries({ queryKey: ["certificates"] });
      await queryClient.refetchQueries({ queryKey: ["certificates"] });
      toast.success(`Certificate created! Ref: ${newCert.ref_no}`);
      router.push("/admin/certificates");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Create Certificate</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to issue a new certificate</p>
      </div>

      <CertificateForm
        onSubmit={(values) => mutation.mutate(values)}
        loading={mutation.isPending}
        submitLabel="Create Certificate"
      />
    </div>
  );
}

