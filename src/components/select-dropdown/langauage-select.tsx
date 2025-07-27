import { useState } from 'react';
import Select, { type SingleValue } from 'react-select';
import type { SelectOption } from '../../types/common';


const languageOptions: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
];

const LanguageSelect = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<SelectOption | null>(null);

  const handleChange = (option: SingleValue<SelectOption>) => {
    setSelectedLanguage(option);
    console.log('Selected language:', option?.value);
  };

  return (
    <Select
      options={languageOptions}
      value={selectedLanguage}
      onChange={handleChange}
      placeholder="Select Language"
      isSearchable={false}
      classNamePrefix="language-select"
    />
  );
};

export default LanguageSelect;
