import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CodeChangesSliderProps {
  before: string;
  after: string;
}

export const CodeChangesSlider = ({ before, after }: CodeChangesSliderProps) => {
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  return (
    <div className="w-full">
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        onValueChange={handleSliderChange}
      />
      <div className="grid grid-cols-2 gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Before</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-red-50 p-4 rounded-lg overflow-x-auto border-l-4 border-red-400">
              <code>{before}</code>
            </pre>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-green-600">After</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-green-50 p-4 rounded-lg overflow-x-auto border-l-4 border-green-400">
              <code>{after}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};