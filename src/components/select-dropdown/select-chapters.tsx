import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { StylesConfig, GroupBase } from 'react-select';
import { apiRequest } from '../../lib/api-client';
import type { ChapterApiResponse, ChapterResponseData } from '../../types/class-section';
import type { SelectOption } from '../../types/common';

interface SelectChapterProps {
  classId: string;
  subjectId: string;
  onSelectChapter: (chapterId: string) => void;
}

const SelectChapter = ({ classId, subjectId, onSelectChapter }: SelectChapterProps) => {
  const [chapterOptions, setChapterOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const payload = { school_id: '23', class_id: classId, subject_id: subjectId };
        const result = await apiRequest<ChapterApiResponse, typeof payload>(
          'POST',
          'Content/getChapters',
          payload
        );
        console.log(result);
        const formattedOptions: SelectOption[] = result.data.map((item: ChapterResponseData) => ({
          value: item.chapter_id.toString(),
          label: item.chapter_name,
        }));

        setChapterOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to fetch Chapters:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchChapters();
  }, [classId, subjectId]);

  const handleChapterChange = (option: SelectOption | null) => {
    if (option) {
      onSelectChapter(option.value);
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
        isLoading={loading}
        options={chapterOptions}
        onChange={handleChapterChange}
        placeholder="Select Chapter"
      />
    </div>
  );
};

export default SelectChapter;