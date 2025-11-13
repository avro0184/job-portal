export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-3">
      <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
        ↑
      </button>
      <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
        ?
      </button>
    </div>
  );
}
