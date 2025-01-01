import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCodeGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt }
      });

      if (error) throw error;

      return data;
    } catch (err) {
      setError(err.message || 'Произошла ошибка при генерации кода');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateCode,
    isLoading,
    error
  };
};