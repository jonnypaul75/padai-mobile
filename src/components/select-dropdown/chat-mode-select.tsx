import { useState } from 'react';
import Select,  {type SingleValue } from 'react-select';
import type { SelectOption } from '../../types/common';



const modeOptions: SelectOption[] = [
  { value: 'translate', label: 'Translate' },
  { value: 'explain', label: 'Explain' },
  { value: 'rtc', label: 'RTC' },
];

const ModeSelect = () => {
  const [selectedMode, setSelectedMode] = useState<SelectOption | null>(modeOptions[0]);

  const handleChange = (option: SingleValue<SelectOption>) => {
    setSelectedMode(option);
    console.log('Selected mode:', option?.value);
  };

  return (
    <Select
      
      options={modeOptions}
      value={selectedMode}
      onChange={handleChange}
      placeholder="Select Mode"
      isSearchable={false}
      classNamePrefix="mode-select"
    />
  );
};

export default ModeSelect;
