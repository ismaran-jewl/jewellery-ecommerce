import CommunityClient from "./CommunityClient";

export const metadata = {
  title: "Ismaran Community | Customer Stories & Gallery",
  description: "Explore the stories behind our luxury jewellery and see how our community wears their Ismaran pieces.",
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB]">
        <CommunityClient />
    </main>
  );
}
