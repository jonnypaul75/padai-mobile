import  { useEffect, useState } from 'react';
import Select from 'react-select';
import type { StylesConfig, GroupBase } from 'react-select';
import { apiRequest } from '../../lib/api-client';
import type { ClassApiResponse } from '../../types/class-section';
import type { SelectOption } from '../../types/common';


interface SelectClassProps {
  selectedClass: string | null;
  onSelectClass: (classId: string) => void;
}

const SelectClass = ({ selectedClass, onSelectClass }: SelectClassProps) => {
  const [classOptions, setClassOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const payload = { school_id: '23' };
        const result = await apiRequest<ClassApiResponse, typeof payload>(
          'POST',
          'Content/getClasses',
          payload
        );

        const formattedOptions: SelectOption[] = result.data.map((item) => ({
          value: item.class_id.toString(),
          label: item.class_name,
        }));

        setClassOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  const handleClassChange = (option: SelectOption | null) => {
    if (option) {
      onSelectClass(option.value);
    }
  };

  const customStyles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f97316' : provided.backgroundColor,
      color: state.isFocused ? '#fff' : provided.color,
      cursor: 'pointer',
    }),
  };

  return (
    <div>
      <Select<SelectOption, false, GroupBase<SelectOption>>
        styles={customStyles}
        value={selectedClass ? classOptions.find((option) => option.value === selectedClass) : null}
        isLoading={loading}
        options={classOptions}
        onChange={handleClassChange}
        placeholder="Select Class"
      />
    </div>
  );
};

export default SelectClass;
