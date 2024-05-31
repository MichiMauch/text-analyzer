import React from 'react';
import Image from 'next/image';

interface LoadingProps {
  spinnerImage: string;
}

const Loading: React.FC<LoadingProps> = ({ spinnerImage }) => (
  <div className="text-center">
    <p className="mb-4">Paul is analyzing your text...need some seconds.</p>
    <Image
      src={spinnerImage}
      alt="Loading..."
      width={256}
      height={256}
      className="mx-auto"
    />
  </div>
);

export default Loading;
