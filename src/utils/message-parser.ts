import { createScopedLogger } from './logger';

const ARTIFACT_TAG_OPEN = '<lov-write';
const ARTIFACT_TAG_CLOSE = '```';
const ACTION_TAG_OPEN = '<lov-action';
const ACTION_TAG_CLOSE = '</lov-action>';

const logger = createScopedLogger('MessageParser');

interface ParserCallbacks {
  onArtifactOpen?: (artifact: string) => void;
  onActionOpen?: (action: string) => void;
}

interface ParserState {
  position: number;
  insideArtifact: boolean;
  content: string;
}

export class StreamingMessageParser {
  private callbacks: ParserCallbacks;
  private messages: Map<string, ParserState>;

  constructor(callbacks: ParserCallbacks = {}) {
    this.callbacks = callbacks;
    this.messages = new Map();
  }

  parse(messageId: string, input: string): string {
    let state = this.messages.get(messageId) || { 
      position: 0, 
      insideArtifact: false, 
      content: '' 
    };
    
    let output = '';

    let i = state.position;
    while (i < input.length) {
      if (input.startsWith(ARTIFACT_TAG_OPEN, i)) {
        const closeIndex = input.indexOf(ARTIFACT_TAG_CLOSE, i);
        if (closeIndex !== -1) {
          const artifactContent = input.slice(
            i + ARTIFACT_TAG_OPEN.length, 
            closeIndex
          );
          this.callbacks.onArtifactOpen?.(artifactContent);
          i = closeIndex + ARTIFACT_TAG_CLOSE.length;
        } else {
          break;
        }
      } else if (input.startsWith(ACTION_TAG_OPEN, i)) {
        const closeIndex = input.indexOf(ACTION_TAG_CLOSE, i);
        if (closeIndex !== -1) {
          const actionContent = input.slice(
            i + ACTION_TAG_OPEN.length, 
            closeIndex
          );
          this.callbacks.onActionOpen?.(actionContent);
          i = closeIndex + ACTION_TAG_CLOSE.length;
        } else {
          break;
        }
      } else {
        output += input[i];
        i++;
      }
    }

    state.position = i;
    this.messages.set(messageId, state);

    return output;
  }

  reset(): void {
    this.messages.clear();
  }
}