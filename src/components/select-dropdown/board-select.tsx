import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import type { SelectOption } from '../../types/common';

interface SelectBoardProps {
  selectedBoard: string | null;
  onSelectBoard: (board: string) => void;
}

const boardOptions: SelectOption[] = [
  { value: 'CBSE', label: 'CBSE' },
  { value: 'ICSE', label: 'ICSE' },
  { value: 'NCERT', label: 'NCERT' },
];

const customStyles: StylesConfig<SelectOption, false> = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f97316' : provided.backgroundColor, // Gold on hover/focus
    color: state.isFocused ? '#fff' : provided.color,                        // Text white on hover/focus
    cursor: 'pointer',
  }),
};

const SelectBoard = ({ selectedBoard, onSelectBoard }: SelectBoardProps) => {

  const handleBoardChange = (option: SelectOption | null) => {
    if (option) {
      onSelectBoard(option.value);
    }
  };

  return (
    <div>
      <Select
        key="board-select"
        value={selectedBoard ? { value: selectedBoard, label: selectedBoard } : null}
        styles={customStyles}
        options={boardOptions}
        onChange={handleBoardChange}
        placeholder="Select Board"
      />
    </div>
  );
};

export default SelectBoard;