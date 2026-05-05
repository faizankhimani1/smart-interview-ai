interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Preparing your interview...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🎯</div>
        </div>
        <p className="text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  );
}
