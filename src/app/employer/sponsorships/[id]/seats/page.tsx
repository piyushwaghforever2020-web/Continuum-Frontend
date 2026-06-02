import EmployerSponsorshipClient from "../EmployerSponsorshipClient";

export function generateStaticParams() {
  return Array.from({ length: 500 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default function EmployerSponsorshipSeatsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <EmployerSponsorshipClient
      sponsorshipId={params.id}
      initialView="seats"
    />
  );
}
