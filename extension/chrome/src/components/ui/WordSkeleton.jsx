const WordSkeleton = () => {
  return (
    <div className="max-w-full flex flex-col gap-5 animate-pulse">
      <div className="flex items-center justify-center gap-2">
        <div className="h-9 w-10 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="h-6 flex-1 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="h-9 w-28 bg-gray-200 rounded-md dark:bg-gray-700"></div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-8 w-28 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div className="flex gap-4">
          <div className="h-7 w-22 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-7 w-22 bg-gray-200 rounded-md dark:bg-gray-700"></div>
          <div className="h-7 w-22 bg-gray-200 rounded-md dark:bg-gray-700"></div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-9 w-full bg-gray-200 rounded-md dark:bg-gray-700"></div>
        <div className="h-9 w-full bg-gray-200 rounded-md dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default WordSkeleton;
