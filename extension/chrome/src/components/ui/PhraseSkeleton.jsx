const WordSkeleton = () => {
  return (
    <div className="max-w-full flex flex-col gap-8 animate-pulse">
      <div className="flex items-center justify-center gap-2">
        <div className="h-9 w-10 self-start bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="h-20 flex-1 bg-gray-200 rounded-md dark:bg-gray-700"></div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="h-9 w-10 self-start bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="h-20 flex-1 bg-gray-200 rounded-md dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default WordSkeleton;
