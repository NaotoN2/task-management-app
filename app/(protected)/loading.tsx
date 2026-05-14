export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

      <p className="mt-6 text-xl font-bold">読み込み中...</p>

      <p className="mt-2 text-sm text-gray-500">しばらくお待ちください</p>
    </div>
  );
}
