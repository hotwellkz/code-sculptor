import { useState, useCallback } from 'react';
import { StreamingMessageParser } from '@/utils/message-parser';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ParsedMessages {
  [key: string]: string;
}

export function useMessageParser() {
  const [parsedMessages, setParsedMessages] = useState<ParsedMessages>({});
  
  const messageParser = new StreamingMessageParser({
    onArtifactOpen: (artifact) => {
      console.log('Artifact opened:', artifact);
    },
    onActionOpen: (action) => {
      console.log('Action opened:', action);
    }
  });

  const parseMessages = useCallback((messages: Message[]) => {
    const newParsedMessages: ParsedMessages = {};
    
    messages.forEach((message) => {
      if (message.role === 'assistant') {
        newParsedMessages[message.id] = messageParser.parse(
          message.id, 
          message.content
        );
      }
    });
    
    setParsedMessages(newParsedMessages);
  }, []);

  return { parsedMessages, parseMessages };
}