
import { useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Global registry to track all active channels
const globalChannelRegistry = new Map<string, any>();

export const useChannelManager = () => {
  const activeChannelsRef = useRef<Set<string>>(new Set());

  const createChannel = (channelName: string) => {
    // Remove any existing channel with this name globally
    if (globalChannelRegistry.has(channelName)) {
      const existingChannel = globalChannelRegistry.get(channelName);
      supabase.removeChannel(existingChannel);
      globalChannelRegistry.delete(channelName);
    }

    // Create new channel
    const channel = supabase.channel(channelName);
    globalChannelRegistry.set(channelName, channel);
    activeChannelsRef.current.add(channelName);
    
    return channel;
  };

  const removeChannel = (channelName: string) => {
    if (globalChannelRegistry.has(channelName)) {
      const channel = globalChannelRegistry.get(channelName);
      supabase.removeChannel(channel);
      globalChannelRegistry.delete(channelName);
    }
    activeChannelsRef.current.delete(channelName);
  };

  const cleanup = () => {
    activeChannelsRef.current.forEach((channelName) => {
      removeChannel(channelName);
    });
    activeChannelsRef.current.clear();
  };

  return {
    createChannel,
    removeChannel,
    cleanup
  };
};
