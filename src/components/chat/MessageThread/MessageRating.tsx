
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageRatingProps {
  messageId: string;
  initialRating?: 'positive' | 'negative' | null;
  onRating?: (messageId: string, rating: 'positive' | 'negative' | null) => void;
}

export const MessageRating: React.FC<MessageRatingProps> = ({
  messageId,
  initialRating = null,
  onRating
}) => {
  const [rating, setRating] = useState<'positive' | 'negative' | null>(initialRating);
  const { toast } = useToast();

  const handleRating = (newRating: 'positive' | 'negative') => {
    const finalRating = rating === newRating ? null : newRating;
    setRating(finalRating);
    
    if (onRating) {
      onRating(messageId, finalRating);
    }

    if (finalRating) {
      toast({
        title: "反馈已提交",
        description: finalRating === 'positive' ? "感谢您的好评！" : "我们会努力改进",
      });
    }
  };

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleRating('positive')}
        className={`h-7 px-2 ${rating === 'positive' ? 'bg-green-100 text-green-600' : ''}`}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleRating('negative')}
        className={`h-7 px-2 ${rating === 'negative' ? 'bg-red-100 text-red-600' : ''}`}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  );
};
