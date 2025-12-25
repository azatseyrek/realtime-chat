'use client';

import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

const RoomPage = () => {
  const params = useParams();
  const roomId = params.roomId as string;

  const inputReft = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [copyStatus, setCopyStatus] = useState('COPY');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopyStatus('COPIED');
    setTimeout(() => {
      setCopyStatus('COPY');
    }, 2000);
  };

  return (
    <div>
      <p>{roomId}</p>
    </div>
  );
};

export default RoomPage;
