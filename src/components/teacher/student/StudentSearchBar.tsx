
import React from "react";
import { Input } from "@/components/ui/input";

interface StudentSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  classFilter: string;
  setClassFilter: (filter: string) => void;
  availableClasses: string[];
}

const StudentSearchBar = ({
  searchTerm,
  setSearchTerm,
  classFilter,
  setClassFilter,
  availableClasses
}: StudentSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Input
          placeholder="Buscar aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
        <select
          className="border rounded p-2"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="all">Todas as Turmas</option>
          {availableClasses.map(className => (
            <option key={className} value={className}>{className}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StudentSearchBar;
