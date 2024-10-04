import React from 'react';

const HiddenMem: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="border border-black p-4 max-w-md">
        <div className="font-bold">Position 1 &gt; </div>
        <div className="flex">
          <div className="bg-gray-200 p-2 mr-2">[ Data 1 ]</div>
          <div className="bg-gray-200 p-2 mr-2">[ Data 2 ]</div>
          <div className="bg-gray-200 p-2">[ Data 3 ]</div>
        </div>
      </div>

      <div className="border border-black p-4 max-w-md">
        <div className="font-bold">Position 2 &gt; </div>
        <div className="flex">
          <div className="bg-gray-200 p-2 mr-2">[ Data 1 ]</div>
          <div className="bg-gray-200 p-2 mr-2">[ Data 2 ]</div>
          <div className="bg-gray-200 p-2">[ Data 3 ]</div>
        </div>
      </div>

      <div className="border border-black p-4 max-w-md">
        <div className="font-bold">Position 3 &gt; </div>
        <div className="flex">
          <div className="bg-gray-200 p-2 mr-2">[ Data 1 ]</div>
          <div className="bg-gray-200 p-2">[ Data 2 ]</div>
        </div>
      </div>

      <div className="border border-black p-4 max-w-md">
        <div className="font-bold">Position 4 &gt; </div>
        <div className="flex">
          <div className="bg-gray-200 p-2">[ Data 1 ]</div>
        </div>
      </div>
    </div>
  );
};

export default HiddenMem;
