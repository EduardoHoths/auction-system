'use client';

import { baseURL } from '@/lib/api';
import { io } from 'socket.io-client';

const socket = io(baseURL);

export default socket;
