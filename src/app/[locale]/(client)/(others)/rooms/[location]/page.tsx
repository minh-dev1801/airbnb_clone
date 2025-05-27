import ListRoom from '@/components/client/rooms/ListRoom';

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;

  return (
    <div className="max-w-md mx-auto sm:container mt-8 md:mt-0">
      <ListRoom location={location} />
    </div>
  );
}
