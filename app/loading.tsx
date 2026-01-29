export default function Loading() {
  return (
    <div className="container-md">
      <div className="relative h-[70vh] w-full overflow-hidden rounded-lg bg-gray-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-400/60 to-transparent" />
      </div>
    </div>
  );
}
