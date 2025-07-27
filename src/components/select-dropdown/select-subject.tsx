import  { useEffect, useState } from 'react';
import Select from 'react-select';
import type { StylesConfig, GroupBase } from 'react-select';
import { apiRequest } from '../../lib/api-client';
import type { SubjectApiResponse, SubjectResponseData } from '../../types/class-section';
import type { SelectOption } from '../../types/common';

interface SelectSubjectProps {
  classId: string;
  subjectId: string;
  onSelectSubject: (SubjectId: string) => void;
}

const SelectSubject = ({ classId,subjectId, onSelectSubject }: SelectSubjectProps) => {
  const [SubjectOptions, setSubjectOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchSubjectes() {
      try {
        const payload = { school_id: '23', class_id: classId };
        const result = await apiRequest<SubjectApiResponse, typeof payload>(
          'POST',
          'Content/getSubjects',
          payload
        );
        const formattedOptions: SelectOption[] = result.data.map((item: SubjectResponseData) => ({
          value: item.subject_id.toString(),
          label: item.subject_name,
        }));

        setSubjectOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to fetch Subjectes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjectes();
  }, [classId]);

  const handleSubjectChange = (option: SelectOption | null) => {
    if (option) {
      onSelectSubject(option.value);
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
        value={subjectId ? SubjectOptions.find((option) => option.value === subjectId) : null}
        isLoading={loading}
        options={SubjectOptions}
        onChange={handleSubjectChange}
        placeholder="Select Subject"
      />
    </div>
  );
};

export default SelectSubject;
