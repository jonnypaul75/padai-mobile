import { useEffect, useState } from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { LanguageData } from "../../types/language";
import { apiProxyRequest } from "../../lib/api-client-proxy";
import type {  LanguageOption } from "../../types/chapter-contents";

interface SelectLanguageProps {
  selectedLanguage: string | null;
  onSelectLanguage: (name: string) => void;
}

const SelectLanguage = ({
  selectedLanguage,
  onSelectLanguage,
}: SelectLanguageProps) => {
  const [languages, setLanguages] = useState<LanguageOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const payload = {};
        const response = await apiProxyRequest<LanguageData, typeof payload>(
          "POST",
          "Content/getLanguages",
          payload
        );

        const options: LanguageOption[] = response.languages.map(
          (language) => ({
            value: language.code,
            label: language.name,
            script: language.script,
          })
        );
        setLanguages(options);

        // if (response?.languages) {
        //   setLanguages(response.languages);
        // }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = (option: LanguageOption | null) => {
    if (option) {
      onSelectLanguage(option.label); // now using label instead of name
      console.log(option);
    }
  };

  const customStyles: StylesConfig<LanguageOption, false> = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#f97316" : provided.backgroundColor,
      color: state.isFocused ? "#fff" : provided.color,
      cursor: "pointer",
    }),
  };
    
  return (
    <div>
      <Select<LanguageOption, false>
        styles={customStyles}
        value={
          selectedLanguage
            ? languages.find((option) => option.label === selectedLanguage)
            : null
        }
        isLoading={loading}
        options={languages}
        onChange={handleLanguageChange}
        placeholder="Select Language"
      />
    </div>
  );
};

export default SelectLanguage;
