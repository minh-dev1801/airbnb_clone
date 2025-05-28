import ListRoom from '@/components/client/rooms/ListRoom';

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;

  return (
    <div className="mx-auto container px-4 mt-4 sm:mt-8 md:mt-0">
      <ListRoom location={location} />
    </div>
  );
}
