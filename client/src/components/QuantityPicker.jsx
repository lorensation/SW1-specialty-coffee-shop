import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuantityPicker = ({ value, onChange, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="w-12 text-center font-semibold">{value}</span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantityPicker;
